/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

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

const formSchema = z.object({
  education_level: z.string().min(1, "Education level is required."),
  field_of_study: z.string().min(1, "Field of study is required."),
  skills: z.string().min(1, "Please list at least one skill."),
  interests: z.string().min(1, "Please list at least one interest."),
  career_aspirations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OnboardingPage() {
  const navigate = useNavigate();

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

  const parseStringToArray = (str: string) => {
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  async function onSubmit(values: FormData) {
    const payload = {
      ...values,
      skills: parseStringToArray(values.skills),
      interests: parseStringToArray(values.interests),
    };
    
    try {
      await api.post("/profile/me", payload);
      toast.success("Profile created successfully!");
      navigate("/dashboard/chat");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create profile. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-8">
      <div className="w-full max-w-2xl rounded-lg border bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome! Let's set up your profile.</h1>
        <p className="mb-6 text-muted-foreground">This will help us personalize your career advice.</p>
        
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
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save and Continue"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}