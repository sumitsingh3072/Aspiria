import { useState } from "react";
import { MessageSquarePlus, X, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [comment, setComment] = useState("");

    const submitMutation = useMutation({
        mutationFn: async () => {
            await api.post("/feedback/platform", {
                rating,
                comment: comment.trim() || null,
            });
        },
        onSuccess: () => {
            toast.success("Thank you for your feedback! 🎉");
            setIsOpen(false);
            setRating(0);
            setComment("");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to submit feedback.");
        },
    });

    const resetAndClose = () => {
        setIsOpen(false);
        setRating(0);
        setHoveredStar(0);
        setComment("");
    };

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
                                    <CardTitle className="text-sm font-semibold">
                                        Rate Your Experience
                                    </CardTitle>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetAndClose}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        How would you rate your overall experience with Aspiria?
                                    </p>
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                onClick={() => setRating(star)}
                                                className="p-1 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`h-7 w-7 transition-colors ${
                                                        star <= (hoveredStar || rating)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-zinc-300 dark:text-zinc-600"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {rating > 0 && (
                                        <p className="text-center text-xs text-muted-foreground mt-1.5">
                                            {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Comments (optional)
                                    </label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us what you think..."
                                        className="mt-1 text-xs resize-none h-20"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full text-xs h-9"
                                    onClick={() => submitMutation.mutate()}
                                    disabled={rating === 0 || submitMutation.isPending}
                                >
                                    <Send className="h-3 w-3 mr-1.5" />
                                    {submitMutation.isPending ? "Sending..." : "Submit Feedback"}
                                </Button>
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
