import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/auth-provider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            login(token);
            toast.success("Successfully logged in via Google!");
            navigate("/dashboard");
        } else {
            toast.error("Authentication failed. No token received.");
            navigate("/auth/login");
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                <p className="text-zinc-500 font-medium">Authenticating...</p>
            </div>
        </div>
    );
}
