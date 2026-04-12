import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { BellRing, CheckCircle2, Circle, Loader2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/use-notifications";

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    notification_type: string;
}

export default function NotificationsPage() {
    const queryClient = useQueryClient();
    const { refetchCount } = useNotifications();

    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get("/notifications/");
            return data;
        }
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.put(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            refetchCount();
        }
    });

    const testTriggerMutation = useMutation({
        mutationFn: async () => {
            await api.post("/notifications/test-trigger");
        },
        onSuccess: () => {
            toast.success("Desktop Notification Triggered!");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            // The background hook will instantly detect the unread-count discrepancy on its next background poll!
        }
    });

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notification Center</h2>
                    <p className="text-muted-foreground mt-1">Manage and view your system alerts</p>
                </div>
                <Button 
                    variant="default"
                    onClick={() => testTriggerMutation.mutate()}
                    disabled={testTriggerMutation.isPending}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {testTriggerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                    Test Desktop API Alert
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Your latest notifications from the AI Advisor and System.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-8 flex justify-center text-zinc-500">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div 
                                    key={notif.id}
                                    className={`relative flex flex-col gap-2 p-4 rounded-lg border transition-all duration-200 ${
                                        notif.is_read 
                                        ? "bg-zinc-50/50 border-zinc-100 dark:bg-zinc-900/20 dark:border-zinc-800/50 opacity-70" 
                                        : "bg-white border-blue-100 shadow-sm dark:bg-zinc-900 dark:border-blue-900/30"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 p-1.5 rounded-full ${notif.is_read ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                                                <BellRing className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-semibold ${!notif.is_read && 'text-blue-950 dark:text-blue-100'}`}>
                                                        {notif.title}
                                                    </h4>
                                                    {!notif.is_read && <Badge variant="default" className="h-5 px-1.5 bg-blue-500 text-[10px]">New</Badge>}
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{notif.message}</p>
                                                <span className="text-xs text-zinc-400 mt-2 block">
                                                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {!notif.is_read ? (
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="text-zinc-400 hover:text-green-600 flex-shrink-0"
                                                onClick={() => markReadMutation.mutate(notif.id)}
                                                disabled={markReadMutation.isPending}
                                                title="Mark as read"
                                            >
                                                <Circle className="h-5 w-5" />
                                            </Button>
                                        ) : (
                                            <div className="text-green-500/50 p-2" title="Read">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                            <BellRing className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                            <p className="text-zinc-500 font-medium">You're all caught up!</p>
                            <p className="text-xs text-zinc-400 mt-1">No notifications to display.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
