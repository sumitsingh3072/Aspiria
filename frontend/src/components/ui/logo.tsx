import { cn } from "@/lib/utils";

export const APP_NAME = "Aspiria";

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    showText?: boolean;
}

export function Logo({
    className,
    iconClassName,
    textClassName,
    showText = true
}: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div
                className={cn(
                    "h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20",
                    iconClassName
                )}
            >
                A
            </div>
            {showText && (
                <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
                    {APP_NAME}
                </span>
            )}
        </div>
    );
}

export function LogoIcon({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20",
                className
            )}
        >
            A
        </div>
    );
}
