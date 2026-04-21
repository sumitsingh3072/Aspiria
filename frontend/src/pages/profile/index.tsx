import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Save, FileText, CheckCircle2, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";

const formSchema = z.object({
    education_level: z.string().optional(),
    field_of_study: z.string().optional(),
    skills: z.string().optional(),
    interests: z.string().optional(),
    career_aspirations: z.string().optional(),
    experience: z.string().optional(),
    preferred_job_roles: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: profile, isLoading: isProfileLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                const res = await api.get("/profile/me");
                return res.data;
            } catch (error: any) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        },
    });

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            education_level: "",
            field_of_study: "",
            skills: "",
            interests: "",
            career_aspirations: "",
            experience: "",
            preferred_job_roles: "",
        },
    });

    // Reset form when profile data loads
    useEffect(() => {
        if (profile) {
            form.reset({
                education_level: profile.education_level || "",
                field_of_study: profile.field_of_study || "",
                skills: profile.skills?.join(", ") || "",
                interests: profile.interests?.join(", ") || "",
                career_aspirations: profile.career_aspirations || "",
                experience: profile.experience || "",
                preferred_job_roles: profile.preferred_job_roles?.join(", ") || "",
            });
            setIsEditing(true); // Profile exists, so we are updating
        } else {
            setIsEditing(false); // No profile, creating
        }
    }, [profile, form]);

    const mutation = useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            const payload = {
                ...values,
                skills: values.skills ? values.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
                interests: values.interests ? values.interests.split(",").map((s) => s.trim()).filter(Boolean) : [],
                preferred_job_roles: values.preferred_job_roles ? values.preferred_job_roles.split(",").map((s) => s.trim()).filter(Boolean) : [],
            };

            if (isEditing) {
                return api.put("/profile/me", payload);
            } else {
                return api.post("/profile/me", payload);
            }
        },
        onSuccess: () => {
            toast.success("Profile saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setIsEditing(true);
        },
        onError: (error) => {
            toast.error("Failed to save profile.");
            console.error(error);
        },
    });

    function onSubmit(values: ProfileFormValues) {
        mutation.mutate(values);
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        setUploadingResume(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Base resume uploaded and parsed successfully!");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload resume.");
        } finally {
            setUploadingResume(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (isProfileLoading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Base Resume
                    </CardTitle>
                    <CardDescription>
                        Upload your master resume. Our AI will extract your skills and experience.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {profile?.is_complete ? (
                        <div className="flex items-center gap-3 p-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md border border-green-500/20">
                            <CheckCircle2 className="h-5 w-5" />
                            <div>
                                <p className="font-medium text-sm">Resume Uploaded</p>
                                <p className="text-xs opacity-80">Your base resume is ready for tailoring.</p>
                            </div>
                            <div className="ml-auto">
                                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingResume}>
                                    {uploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : "Replace"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-lg bg-background">
                            <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                            <p className="text-sm font-medium mb-1">Upload your Base Resume</p>
                            <p className="text-xs text-muted-foreground mb-4">PDF format only (Max 5MB)</p>
                            <Button onClick={() => fileInputRef.current?.click()} disabled={uploadingResume}>
                                {uploadingResume ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                                ) : (
                                    "Select File"
                                )}
                            </Button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Update your education and career details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="education_level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Education Level</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Bachelor's Degree" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="field_of_study"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Field of Study</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Computer Science" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skills</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. React, Python, Data Science (comma separated)" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Separate skills with commas.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="interests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interests</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. AI, Web Development (comma separated)" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Separate interests with commas.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="career_aspirations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Career Aspirations</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share your career goals..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experience</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Fresher, 2 years, 5+ years" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Your total work experience.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="preferred_job_roles"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred Job Roles</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Software Engineer, Data Scientist, ML Engineer (comma separated)" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Job titles you're looking for. These drive your personalized job recommendations.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
