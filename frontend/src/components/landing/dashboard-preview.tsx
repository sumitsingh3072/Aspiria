import { motion } from "framer-motion";

export const DashboardPreview = () => {
    return (
        <div className="w-full max-w-5xl mx-auto perspective-1000 hidden md:block relative">
            <motion.div
                initial={{ rotateX: 20, opacity: 0, scale: 0.9 }}
                animate={{ rotateX: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative rounded-xl border border-border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
                {/* Mock Browser Bar */}
                <div className="h-8 bg-muted/50 border-b border-border flex items-center gap-2 px-4">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <div className="ml-4 h-5 w-64 rounded-full bg-muted text-[10px] text-muted-foreground flex items-center px-3">aspiria.ai/dashboard</div>
                </div>

                {/* Dashboard Content Mock */}
                <div className="p-6 grid grid-cols-3 gap-6 opacity-90">
                    {/* Sidebar Mock */}
                    <div className="col-span-1 space-y-4">
                        <div className="h-8 w-24 bg-primary/20 rounded-md" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-8 w-full bg-muted/50 rounded-md flex items-center px-2 gap-2">
                                    <div className="h-4 w-4 bg-muted-foreground/30 rounded" />
                                    <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Main Content Mock */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex-1 h-24 bg-zinc-800/80 rounded-xl border border-white/5 p-3 space-y-2">
                                    <div className="h-3 w-12 bg-zinc-700/50 rounded" />
                                    <div className="h-6 w-16 bg-primary/20 rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="h-48 w-full bg-zinc-800/50 rounded-xl border border-white/5 flex items-end p-4 gap-2">
                            {[40, 70, 45, 90, 60, 80, 55, 85].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                                    className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-sm opacity-80"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            </motion.div>
        </div>
    )
}
