import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
    role: "user" | "ai";
    content: string;
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

    const sendMessageMutation = useMutation({
        mutationFn: async (_message: string) => {
            // Mock response for now
            return new Promise<string>((resolve) => {
                setTimeout(() => resolve("That's a great question. Based on current market trends in AI and Software Engineering, I would recommend focusing on Agentic Workflows and LangGraph."), 1000);
            })
        },
        onSuccess: (data) => {
            setMessages((prev) => [...prev, { role: "ai", content: data }]);
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
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            AI Career Advisor
                        </CardTitle>
                        <CardDescription>Ask about skills, resume reviews, or job market insights.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                        <ScrollArea className="flex-1 p-6">
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
                                            <div className={`rounded-2xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                                {msg.content}
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
                                                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-75" />
                                                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-150" />
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
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    className="flex-1"
                                />
                                <Button onClick={handleSend} disabled={sendMessageMutation.isPending} size="icon">
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
