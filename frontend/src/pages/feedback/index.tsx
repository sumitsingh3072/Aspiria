import { useQuery } from "@tanstack/react-query";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";

interface PlatformFeedbackItem {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
}

export default function FeedbackPage() {
    const { data: feedbacks, isLoading } = useQuery<PlatformFeedbackItem[]>({
        queryKey: ["my-platform-feedback"],
        queryFn: async () => {
            const { data } = await api.get("/feedback/platform");
            return data;
        },
    });

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Feedback</h2>
                <p className="text-muted-foreground mt-1">Your submitted platform reviews</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Feedback History</CardTitle>
                    <CardDescription>All your past platform ratings and comments.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-8 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : feedbacks && feedbacks.length > 0 ? (
                        <div className="space-y-4">
                            {feedbacks.map((fb) => (
                                <div key={fb.id} className="p-4 rounded-lg border bg-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`h-4 w-4 ${s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(fb.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    {fb.comment && (
                                        <p className="text-sm text-muted-foreground">{fb.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                            <MessageSquare className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                            <p className="text-zinc-500 font-medium">No feedback submitted yet</p>
                            <p className="text-xs text-zinc-400 mt-1">Click the feedback button in the bottom right to rate your experience.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
