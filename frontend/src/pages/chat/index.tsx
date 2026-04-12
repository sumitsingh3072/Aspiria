import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, ThumbsUp, ThumbsDown, Loader2, History } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";

interface Message {
    role: "user" | "ai";
    content: string;
    messageId?: number;
}

interface ChatApiResponse {
    response: string;
    message_id: number;
    session_id: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your Personal Career Advisor. How can I help you advance your career today? I can review your resume, suggest skills to learn, or find job matches." }
    ]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [ratedMessages, setRatedMessages] = useState<Set<number>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessageMutation = useMutation({
        mutationFn: async (message: string): Promise<ChatApiResponse> => {
            const { data } = await api.post("/chat/", {
                message,
                session_id: sessionId,
            });
            return data;
        },
        onSuccess: (data) => {
            setSessionId(data.session_id);
            setMessages((prev) => [...prev, { role: "ai", content: data.response, messageId: data.message_id }]);
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail || "AI advisor is temporarily unavailable.";
            toast.error(detail);
            setMessages((prev) => [...prev, { role: "ai", content: `⚠️ Error: ${detail}` }]);
        },
    });

    const feedbackMutation = useMutation({
        mutationFn: async ({ chatMessageId, rating }: { chatMessageId: number; rating: number }) => {
            await api.post("/feedback/", {
                chat_message_id: chatMessageId,
                rating,
            });
        },
        onSuccess: (_, variables) => {
            setRatedMessages((prev) => new Set(prev).add(variables.chatMessageId));
            toast.success("Thanks for your feedback!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Could not submit feedback.");
        },
    });

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        sendMessageMutation.mutate(input);
        setInput("");
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]"
        >
            <motion.div variants={item} className="flex-1 min-h-0">
                <Card className="h-full flex flex-col shadow-sm">
                    <CardHeader className="border-b px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-primary" />
                                    AI Career Advisor
                                </CardTitle>
                                <CardDescription>Ask about skills, resume reviews, or job market insights.</CardDescription>
                            </div>
                            {sessionId && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                    <History className="h-3 w-3" />
                                    Session active
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                            <Avatar className="h-8 w-8 mt-1 border">
                                                <AvatarFallback className={msg.role === "ai" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                                                    {msg.role === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-1">
                                                <div className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                                    {msg.content}
                                                </div>
                                                {/* Feedback buttons for AI messages */}
                                                {msg.role === "ai" && msg.messageId && !ratedMessages.has(msg.messageId) && (
                                                    <div className="flex items-center gap-1 ml-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-muted-foreground hover:text-green-600"
                                                            onClick={() => feedbackMutation.mutate({ chatMessageId: msg.messageId!, rating: 5 })}
                                                            disabled={feedbackMutation.isPending}
                                                        >
                                                            <ThumbsUp className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-muted-foreground hover:text-red-600"
                                                            onClick={() => feedbackMutation.mutate({ chatMessageId: msg.messageId!, rating: 1 })}
                                                            disabled={feedbackMutation.isPending}
                                                        >
                                                            <ThumbsDown className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                                {msg.role === "ai" && msg.messageId && ratedMessages.has(msg.messageId) && (
                                                    <span className="text-[10px] text-muted-foreground ml-1">✓ Feedback submitted</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {sendMessageMutation.isPending && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3 max-w-[80%]">
                                            <Avatar className="h-8 w-8 mt-1 border">
                                                <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                            <div className="bg-muted rounded-2xl px-4 py-2 text-sm flex items-center gap-1">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground ml-1">Thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t bg-muted/20">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type your career question..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !sendMessageMutation.isPending && handleSend()}
                                    className="flex-1"
                                    disabled={sendMessageMutation.isPending}
                                />
                                <Button onClick={handleSend} disabled={sendMessageMutation.isPending || !input.trim()} size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
