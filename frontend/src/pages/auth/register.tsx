import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";

const formSchema = z
    .object({
        full_name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await api.post("/auth/register", {
                email: values.email,
                full_name: values.full_name,
                password: values.password,
            });

            toast.success("Account created successfully! Please sign in.");
            navigate("/auth/login");
        } catch (error: any) {
            toast.error(
                error.response?.data?.detail || "Registration failed. Please try again."
            );
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-zinc-900/20">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                        Enter your information below to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                disabled={isLoading}
                                                className="h-10 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder:text-zinc-400"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@example.com"
                                                type="email"
                                                disabled={isLoading}
                                                className="h-10 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder:text-zinc-400"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="••••••••"
                                                    type="password"
                                                    disabled={isLoading}
                                                    className="h-10 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="••••••••"
                                                    type="password"
                                                    disabled={isLoading}
                                                    className="h-10 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-900/90 dark:hover:bg-zinc-50/90 h-10 font-medium"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500 dark:text-zinc-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50"
                            disabled={isLoading}
                        >
                            <FaGithub className="mr-2 h-4 w-4" />
                            Github
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50"
                            disabled={isLoading}
                            onClick={handleGoogleLogin}
                        >
                            <FcGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <div>
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20 pointer-events-none"></div>
        </div>
    );
}
