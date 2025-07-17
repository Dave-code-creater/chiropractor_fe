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
} from "lucide-react";

const DoctorChat = () => {
  const [statusFilter, setStatusFilter] = useState("active");
  const [priorityFilter, setPriorityFilter] = useState("all");

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
    isPolling,
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
        // Remove role filter to get all conversations for the doctor
        status: statusFilter,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      },
    },
  });

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-1 shadow-xl border-0 overflow-hidden">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-[400px] border-r bg-gradient-to-b from-muted/10 to-muted/30 flex flex-col">
            <div className="p-6 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Patient Messages</h2>
                    <p className="text-sm text-muted-foreground">Manage patient communications</p>
                    {isPolling && selectedConversation && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Live</span>
                      </div>
                    )}
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
              <div className="space-y-3">
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Filter className="h-4 w-4 mr-2" />
                        Status: {statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
                        Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                        Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Priority: {priorityFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 h-10 text-sm bg-background/60"
                    disabled={!isBackendAvailable}
                  />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {(() => {
                if (conversationsLoading) {
                  return (
                    <div className="flex items-center justify-center h-32">
                      <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  );
                }
                
                if (!isBackendAvailable) {
                  return (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground mb-4">Chat service is currently unavailable</p>
                    </div>
                  );
                }
                
                if (conversations.length === 0) {
                  return (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No conversations found</p>
                    </div>
                  );
                }
                
                return conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                    }}
                    className={`p-4 rounded-xl mb-3 cursor-pointer transition-all duration-200 ${
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                        : "hover:bg-muted/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg font-semibold">
                          {conversation.patient_name?.[0] || conversation.doctor_name?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-base truncate mb-1">
                            {conversation.patient_name || conversation.doctor_name || "Patient"}
                          </p>
                          {conversation.priority && (
                            <Badge className={`${getPriorityBadge(conversation.priority)} text-xs`}>
                              {conversation.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message || conversation.subject || conversation.title || conversation.description || "Start a conversation"}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
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
                    Choose a patient conversation from the sidebar
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {selectedConversation.patient_name?.[0] || selectedConversation.doctor_name?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-base">
                            {selectedConversation.patient_name || selectedConversation.doctor_name || "Patient"}
                          </h3>
                          {selectedConversation.priority && (
                            <Badge className={getPriorityBadge(selectedConversation.priority)}>
                              {selectedConversation.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.subject || selectedConversation.title || "Conversation"}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Set Priority
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {(() => {
                    if (messagesLoading) {
                      return (
                        <div className="flex items-center justify-center h-32">
                          <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                        </div>
                      );
                    }
                    
                    if (messages.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No messages yet</p>
                          <p className="text-sm text-muted-foreground mt-2">Start the conversation by sending a message below</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_type === "doctor"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.sender_type === "doctor"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                               <p className="text-sm leading-relaxed">
                                {message.content || message.message_content}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                                <Clock className="h-3 w-3" />
                                {formatMessageTime(message.sent_at || message.created_at)}
                                {message.sender_type === "doctor" && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    );
                  })()}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[40px] max-h-32 text-sm resize-none"
                      disabled={!isBackendAvailable}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!messageInput.trim() || sendingMessage || !isBackendAvailable}
                    >
                      {sendingMessage ? (
                        <MessageCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
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

export default DoctorChat; 