"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock user list
const users = [
    { id: 1, name: "Dr. Sarah Lee", role: "Doctor", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Marcus Cain", role: "Staff", avatar: "https://i.pravatar.cc/150?img=2" },
];

export default function ChatPage() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([
        { id: 1, sender: "self", text: "Hi Doctor!" },
        { id: 2, sender: "other", text: "Hello, how can I help?" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    // Track live screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Auto-select first user on large screens
            if (!mobile && !selectedUser && users.length > 0) {
                setSelectedUser(users[0]);
            }
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [selectedUser]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, sender: "self", text: newMessage },
        ]);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col md:flex-row h-screen border rounded-md overflow-hidden">
            {/* Sidebar */}
            <div
                className={cn(
                    "w-full md:w-1/3 max-w-sm border-r flex flex-col",
                    selectedUser && isMobile && "hidden"
                )}
            >
                <div className="p-4 border-b">
                    <Input placeholder="Search contacts..." />
                </div>
                <ScrollArea className="flex-1">
                    <ul>
                        {users.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={cn(
                                    "px-4 py-3 flex items-center gap-3 cursor-pointer p-4 border-b hover:bg-accent",
                                    selectedUser?.id === user.id && "bg-accent"
                                )}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.role}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            {(selectedUser || !isMobile) && (
                <div className="flex-1 flex flex-col w-full md:w-2/3">
                    {/* Header */}
                    {selectedUser && (
                        <div className="px-4 py-3 border-b bg-background flex items-center gap-3">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-base font-semibold">{selectedUser.name}</h2>
                                <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {selectedUser && (
                        <>
                            <ScrollArea className="flex-1 p-4 space-y-2 bg-background">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "self" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs rounded-lg px-4 py-2 text-sm ${msg.sender === "self"
                                                ? "bg-primary text-white"
                                                : "bg-muted text-foreground"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>

                            {/* Input */}
                            <div className="border-t p-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    />
                                    <Button size="icon" onClick={handleSend}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}