import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useEffect, useRef } from "react";

export function useNotifications() {
    const prevCountRef = useRef<number | null>(null);

    // System: Request OS notification privileges from the browser upon first load.
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // Polling Mechanism: Silently pings the backend every 10 seconds.
    const { data: unreadCount = 0, refetch } = useQuery({
        queryKey: ["unread-notifications-count"],
        queryFn: async () => {
            const response = await api.get<number>("/notifications/unread-count");
            return response.data;
        },
        refetchInterval: 10000, 
    });

    // Event Listener: Detect if the unread count mathematically increases
    useEffect(() => {
        if (prevCountRef.current !== null && unreadCount > prevCountRef.current) {
            const fireAlert = async () => {
                if ("Notification" in window && Notification.permission === "granted") {
                    try {
                        // Quick-fetch the text of the newest database entry to display inside the OS popup
                        const topRes = await api.get("/notifications/?limit=1");
                        if (topRes.data && topRes.data.length > 0) {
                            const latest = topRes.data[0];
                            new Notification(latest.title, {
                                body: latest.message,
                            });
                        } else {
                            new Notification("Aspiria", { body: "You have new unread alerts!" });
                        }
                    } catch (err) {
                        new Notification("Aspiria", { body: "You have new unread alerts!" });
                    }
                }
            };
            fireAlert();
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount]);

    return {
        unreadCount,
        refetchCount: refetch
    };
}
