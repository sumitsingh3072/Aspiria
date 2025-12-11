import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface User {
    id: number;
    email: string;
    full_name?: string | null;
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await api.get<User>("/auth/me");
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                localStorage.removeItem("accessToken");
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem("accessToken", token);
        // Fetch user immediately after setting token
        api.get<User>("/auth/me")
            .then(({ data }) => setUser(data))
            .catch((error) => {
                console.error("Login fetch user failed", error);
                logout();
            });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
        queryClient.clear();
        window.location.href = "/auth/login";
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
