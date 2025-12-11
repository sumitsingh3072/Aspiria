import { cn } from "@/lib/utils";

interface BrowserFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    url?: string;
}

export function BrowserFrame({
    className,
    children,
    url = "https://aspiria.ai/dashboard",
    ...props
}: BrowserFrameProps) {
    return (
        <div
            className={cn(
                "relative rounded-xl border bg-background shadow-2xl overflow-hidden",
                className
            )}
            {...props}
        >
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>

                {/* Address Bar */}
                <div className="flex-1 ml-4 flex justify-center">
                    <div className="w-full max-w-lg bg-background/50 border rounded-md px-3 py-1 text-xs text-muted-foreground truncate flex items-center justify-center font-mono h-6">
                        {url}
                    </div>
                </div>

                <div className="w-10" /> {/* Spacer for balance */}
            </div>

            {/* Content */}
            <div className="relative w-full h-full bg-muted/10">
                {children}
            </div>
        </div>
    );
}
