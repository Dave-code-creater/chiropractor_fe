"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
} from "@/services/chatApi";
import { useSelector } from "react-redux";

export default function ChatPage() {
    const userId = useSelector((state) => state.data.auth.userID);
    const [selectedConvo, setSelectedConvo] = useState(null);
    const { data: convoData, isLoading: convLoading } = useGetConversationsQuery();
    const conversations = convoData?.metadata ?? convoData ?? [];
    const {
        data: msgData,
        isLoading: msgLoading,
        refetch,
    } = useGetMessagesQuery(selectedConvo?._id, { skip: !selectedConvo });
    const [sendMessage] = useSendMessageMutation();
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        if (msgData) {
            setMessages(msgData.metadata ?? msgData ?? []);
        }
    }, [msgData]);
    const [newMessage, setNewMessage] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    // Track live screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (!mobile && !selectedConvo && conversations.length > 0) {
                setSelectedConvo(conversations[0]);
            }
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [selectedConvo, conversations]);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConvo) return;
        try {
            await sendMessage({ conversationId: selectedConvo._id, text: newMessage }).unwrap();
            setNewMessage("");
            refetch();
        } catch (err) {
            /* ignore */
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen border rounded-md overflow-hidden">
            {/* Sidebar */}
            <div
                className={cn(
                    "w-full md:w-1/3 max-w-sm border-r flex flex-col",
                    selectedConvo && isMobile && "hidden"
                )}
            >
                <div className="p-4 border-b">
                    <Input placeholder="Search contacts..." />
                </div>
                <ScrollArea className="flex-1">
                    <ul>
                        {convLoading ? (
                            <li className="p-4 text-sm">Loading...</li>
                        ) : conversations.map((convo) => {
                              const other = convo.participants?.find((p) => p !== userId) || convo._id;
                              return (
                                  <li
                                      key={convo._id || convo.id}
                                      onClick={() => setSelectedConvo(convo)}
                                      className={cn(
                                          "px-4 py-3 flex items-center gap-3 cursor-pointer border-b hover:bg-accent",
                                          selectedConvo?._id === (convo._id || convo.id) && "bg-accent"
                                      )}
                                  >
                                      <Avatar className="h-8 w-8">
                                          <AvatarFallback>{String(other).charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                          <span className="font-medium text-sm">{other}</span>
                                      </div>
                                  </li>
                              );
                          })}
                    </ul>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            {(selectedConvo || !isMobile) && (
                <div className="flex-1 flex flex-col w-full md:w-2/3">
                    {/* Header */}
                    {selectedConvo && (
                        <div className="px-4 py-3 border-b bg-background flex items-center gap-3">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedConvo(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    {String(
                                        selectedConvo.participants?.find((p) => p !== userId) ||
                                            selectedConvo._id
                                    ).charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-base font-semibold">
                                    {selectedConvo.participants?.find((p) => p !== userId) ||
                                        selectedConvo._id}
                                </h2>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {selectedConvo && (
                        <>
                            <ScrollArea className="flex-1 p-4 space-y-2 bg-background">
                                {msgLoading ? (
                                    <p>Loading...</p>
                                ) : messages.map((msg) => (
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