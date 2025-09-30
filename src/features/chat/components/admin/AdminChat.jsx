import { useState } from "react";
import { useSelector } from "react-redux";
import BaseChat from "../BaseChat";


import {
  UserPlus,
  Shield,
} from "lucide-react";

const AdminChat = () => {
  const [statusFilter, _setStatusFilter] = useState("active");
  const [roleFilter, _setRoleFilter] = useState("all");
  const _user = useSelector((state) => state?.auth);

  const {
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
    isFromCurrentUser,
    Button,
    Input,
    Textarea,
    ScrollArea,
    Avatar,
    AvatarFallback,
    Card,
    CardContent,
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
        role: "admin",
        status: statusFilter,
        participant_role: roleFilter !== "all" ? roleFilter : undefined,
      },
    },
  });

  

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      doctor: "bg-blue-100 text-blue-800",

      patient: "bg-yellow-100 text-yellow-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="h-screen min-h-screen max-h-screen mx-auto max-w-full">
      <Card className="h-full shadow-none border-0 overflow-hidden rounded-none">
        <div className="flex h-full">
          <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-[400px] border-r bg-gradient-to-b from-muted/10 to-muted/30 flex-col`}>
            <div className="p-8 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Admin Chat</h2>
                    <p className="text-base text-muted-foreground">System-wide Communication</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {}}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 h-14 text-base bg-background/60"
                  disabled={!isBackendAvailable}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {conversationsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 rounded-lg mb-2 cursor-pointer ${selectedConversation?.id === conversation.id
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {conversation.participant_name || "User"}
                            </p>
                            {conversation.participant_role && (
                              <Badge className={getRoleBadgeColor(conversation.participant_role)}>
                                {conversation.participant_role}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.last_message || conversation.subject}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-gradient-to-br from-background to-muted/20`}>
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">Admin Control Panel</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Select a conversation to manage communications
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 sm:p-4 lg:p-8 border-b bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden p-1 h-8 w-8"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                        <AvatarFallback>
                          {selectedConversation.participant_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {selectedConversation.participant_name || "User"}
                          </h3>
                          {selectedConversation.participant_role && (
                            <Badge className={`${getRoleBadgeColor(selectedConversation.participant_role)} text-xs`}>
                              {selectedConversation.participant_role}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {selectedConversation.subject}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

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
                      {messages.map((message) => {
                        const senderType = (message?.sender_type || "").toString().toLowerCase();
                        const isCurrentUser = isFromCurrentUser(message) || senderType === "admin";
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-xl p-5 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                            >
                              <p className="text-base leading-relaxed">{message.content || message.message_content}</p>
                              <div className="flex items-center gap-2 mt-3 text-xs opacity-70">
                                <Clock className="h-3 w-3" />
                                {formatMessageTime(message.sent_at || message.created_at)}
                                {isCurrentUser && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

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

export default AdminChat;
