/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
import { toast } from "sonner";

// Same schema as onboarding
const formSchema = z.object({
  education_level: z.string().min(1, "Education level is required."),
  field_of_study: z.string().min(1, "Field of study is required."),
  skills: z.string().min(1, "Please list at least one skill."),
  interests: z.string().min(1, "Please list at least one interest."),
  career_aspirations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education_level: "",
      field_of_study: "",
      skills: "",
      interests: "",
      career_aspirations: "",
    },
  });

  // Fetch existing profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        // Convert arrays back to comma-separated strings for the form
        form.reset({
          ...data,
          skills: data.skills.join(', '),
          interests: data.interests.join(', '),
        });
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const parseStringToArray = (str: string) => {
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  // Handle profile update
  async function onSubmit(values: FormData) {
    const payload = {
      ...values,
      skills: parseStringToArray(values.skills),
      interests: parseStringToArray(values.interests),
    };
    
    try {
      await api.put("/profile/me", payload);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update profile. Please try again.");
    }
  }
  
  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="container mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Your Profile</h1>
      <p className="mb-6 text-muted-foreground">Keep your details up-to-date for the best recommendations.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="education_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor's Degree" {...field} />
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
                    <Input placeholder="e.g., Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Python, React, Public Speaking" {...field} />
                </FormControl>
                <FormDescription>Separate skills with a comma.</FormDescription>
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
                  <Input placeholder="AI, Web Development, Finance" {...field} />
                </FormControl>
                <FormDescription>Separate interests with a comma.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="career_aspirations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Aspirations (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., To become a full-stack developer..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}