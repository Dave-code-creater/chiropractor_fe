import React, { useState } from "react";
import BaseChat from "../BaseChat";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  MoreVertical,
  UserPlus,
  Archive,
  AlertTriangle,
  Tag,
} from "lucide-react";

const StaffChat = () => {
  const [statusFilter, setStatusFilter] = useState("active");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const {
    // Extract all needed props from BaseChat
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchTerm,
    setSearchTerm,
    messagesEndRef,
    conversations,
    messages,
    isBackendAvailable,
    conversationsLoading,
    messagesLoading,
    sendingMessage,
    handleSendMessage,
    formatMessageTime,
    // Components
    Button,
    Input,
    Textarea,
    ScrollArea,
    Avatar,
    AvatarFallback,
    Card,
    CardContent,
    // Icons
    Send,
    MessageCircle,
    Clock,
    Check,
    CheckCheck,
    WifiOff,
    Plus,
  } = BaseChat({
    roleSpecificProps: {
      conversationQueryParams: {
        role: "staff",
        status: statusFilter,
        department: departmentFilter !== "all" ? departmentFilter : undefined,
      },
    },
  });

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "reception", name: "Reception" },
    { id: "billing", name: "Billing" },
    { id: "scheduling", name: "Scheduling" },
    { id: "records", name: "Medical Records" },
  ];

  return (
    <div className="h-screen min-h-screen max-h-screen mx-auto max-w-full">
      <Card className="h-full shadow-xl border-0 overflow-hidden rounded-none">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-[400px] border-r bg-gradient-to-b from-muted/10 to-muted/30 flex flex-col">
            <div className="p-8 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                    <p className="text-base text-muted-foreground">Patient & Staff Communications</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {/* TODO: Implement new conversation */}}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {departments.map((dept) => (
                        <DropdownMenuItem
                          key={dept.id}
                          onClick={() => setDepartmentFilter(dept.id)}
                          className={departmentFilter === dept.id ? "bg-muted" : ""}
                        >
                          {dept.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {conversationsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 rounded-lg mb-2 cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/10"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {conversation.participant_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {conversation.participant_name || "User"}
                          </p>
                          {conversation.department && (
                            <Badge variant="outline" className="ml-2">
                              {conversation.department}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message || conversation.subject}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-background to-muted/20">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {selectedConversation.participant_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {selectedConversation.participant_name || "User"}
                          </h3>
                          {selectedConversation.department && (
                            <Badge variant="outline">
                              {selectedConversation.department}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.subject}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Tag className="h-4 w-4 mr-2" />
                          Change Department
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Flag for Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center">
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_type === "staff"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl p-5 ${
                              message.sender_type === "staff"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-base leading-relaxed">{message.content}</p>
                            <div className="flex items-center gap-2 mt-3 text-xs opacity-70">
                              <Clock className="h-3 w-3" />
                              {formatMessageTime(message.sent_at || message.created_at)}
                              {message.sender_type === "staff" && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-8 border-t bg-background/80 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-4">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[60px] max-h-40 text-base"
                      disabled={!isBackendAvailable}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!messageInput.trim() || sendingMessage || !isBackendAvailable}
                    >
                      {sendingMessage ? (
                        <MessageCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaffChat; 