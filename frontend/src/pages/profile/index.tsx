import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Save, FileText, CheckCircle2, Upload, Briefcase, Building2, MapPin, Calendar } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface JobApplication {
    id: number;
    user_id: number;
    job_id: number;
    status: string;
    applied_at: string;
    job: {
        id: number;
        title: string;
        company: string | null;
        location: string | null;
        schedule_type: string | null;
    };
}

const STATUS_OPTIONS = [
    { value: "applied", label: "Applied", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { value: "in-touch", label: "In Touch", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    { value: "selected", label: "Selected", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { value: "rejected", label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20" },
];

function getStatusStyle(status: string) {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "";
}

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

    const { data: applications, isLoading: appsLoading } = useQuery<JobApplication[]>({
        queryKey: ["my-applications"],
        queryFn: async () => {
            const { data } = await api.get("/profile/applications");
            return data;
        },
    });

    const statusMutation = useMutation({
        mutationFn: async ({ appId, status }: { appId: number; status: string }) => {
            const { data } = await api.put(`/profile/applications/${appId}/status`, { status });
            return data;
        },
        onSuccess: () => {
            toast.success("Status updated!");
            queryClient.invalidateQueries({ queryKey: ["my-applications"] });
        },
        onError: () => {
            toast.error("Failed to update status.");
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

    // Stats for Applications tab header
    const totalApps = applications?.length ?? 0;
    const statusCounts = applications?.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) ?? {};

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="details" className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Profile Details
                    </TabsTrigger>
                    <TabsTrigger value="applications" className="gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        Applications
                        {totalApps > 0 && (
                            <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5">{totalApps}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* ===== Profile Details Tab ===== */}
                <TabsContent value="details" className="space-y-6 mt-4">
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
                </TabsContent>

                {/* ===== Applications Tab ===== */}
                <TabsContent value="applications" className="space-y-6 mt-4">
                    {/* Stats Row */}
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                        {STATUS_OPTIONS.map((opt) => (
                            <Card key={opt.value} className="shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{opt.label}</p>
                                    <p className="text-2xl font-bold mt-1">{statusCounts[opt.value] ?? 0}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Applications List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                My Applications
                            </CardTitle>
                            <CardDescription>
                                Track and manage the status of jobs you've applied to.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {appsLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : applications && applications.length > 0 ? (
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                                        >
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className="text-sm font-semibold truncate">{app.job.title}</p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                    {app.job.company && (
                                                        <span className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" /> {app.job.company}
                                                        </span>
                                                    )}
                                                    {app.job.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" /> {app.job.location}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(app.applied_at).toLocaleDateString()}
                                                    </span>
                                                    {app.job.schedule_type && (
                                                        <Badge variant="secondary" className="text-[10px]">{app.job.schedule_type}</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="shrink-0">
                                                <Select
                                                    value={app.status}
                                                    onValueChange={(val) => statusMutation.mutate({ appId: app.id, status: val })}
                                                >
                                                    <SelectTrigger
                                                        size="sm"
                                                        className={`w-[140px] text-xs font-semibold border ${getStatusStyle(app.status)}`}
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {STATUS_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                                    <Briefcase className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                                    <p className="text-zinc-500 font-medium">No applications yet</p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Go to the Job Market page and mark jobs as applied to start tracking.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
