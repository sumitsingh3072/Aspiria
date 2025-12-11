import { useState } from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);

    // Mock feedback data
    const feedbacks = [
        { id: 1, user: "Alex M.", text: "The resume AI caught 3 errors I missed.", time: "2m ago" },
        { id: 2, user: "Sarah K.", text: "Love the new detailed job matches!", time: "15m ago" },
        { id: 3, user: "David L.", text: "Can we get a dark mode for the PDF export?", time: "1h ago" },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2 mr-2"
                    >
                        <Card className="w-80 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
                            <CardHeader className="pb-3 border-b">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Recent Feedback</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[300px] overflow-y-auto">
                                    {feedbacks.map((item) => (
                                        <div key={item.id} className="p-3 border-b last:border-0 hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-semibold">{item.user}</span>
                                                <span className="text-[10px] text-muted-foreground">{item.time}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                    <div className="p-3 bg-muted/30">
                                        <Button size="sm" className="w-full text-xs h-8" variant="outline">
                                            Submit New Feedback
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className="h-14 w-14 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
                <MessageSquarePlus className="h-6 w-6" />
                <span className="sr-only">Feedback</span>
            </Button>
        </div>
    );
}
