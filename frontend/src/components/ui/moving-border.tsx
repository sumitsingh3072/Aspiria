"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function MovingBorderButton({
    borderRadius = "1.75rem",
    children,
    as: Component = "button",
    containerClassName,
    borderClassName,
    duration = 2000,
    className,
    ...otherProps
}: any) {
    return (
        <Component
            className={cn(
                "bg-transparent relative text-xl  h-16 w-40 p-[1px] overflow-hidden ",
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorder duration={duration} rx="30%" ry="30%">
                    <div
                        className={cn(
                            "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>

            <div
                className={cn(
                    "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
                style={{
                    borderRadius: `calc(${borderRadius} * 0.96)`,
                }}
            >
                {children}
            </div>
        </Component>
    );
}

export const MovingBorder = ({
    children,
    duration = 2000,
    rx,
    ry,
    ...otherProps
}: any) => {
    const pathRef = React.useRef<any>(null);
    const progress = React.useRef<any>(0);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);

    React.useLayoutEffect(() => {
        if (!pathRef.current) return;
        const length = pathRef.current.getTotalLength();

        // Simple rotation logic to simulate movement without complex path following for now
        // In a real implementation we would use requestAnimationFrame to interpolate position along the path
        // But to satisfy the linter and unused vars, we'll keep it simple for now or just comment out the unused logic if we aren't using it fully.
        // Actually, let's just implement a basic tick to "use" the variables or remove the complexity.
        // Given the previous error, I will simply remove the unused logic and keeps the SVG static for stability, or just fix the unused vars.

        const animate = () => {
            progress.current = (progress.current + 1) % length;
            const point = pathRef.current.getPointAtLength(progress.current);
            const valX = point.x;
            const valY = point.y;
            setX(valX);
            setY(valY);
            requestAnimationFrame(animate);
        }
        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
                {...otherProps}
            >
                <rect
                    fill="none"
                    width="100%"
                    height="100%"
                    rx={rx}
                    ry={ry}
                    ref={pathRef}
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform: `translate(${x}px, ${y}px)`,
                }}
            >
                {children}
            </div>
        </>
    );
};
