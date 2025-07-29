import React from "react";
import { Card } from "@/components/ui/card";
import ConversationsList from "./ConversationsList";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";
import NewConversationModal from "./NewConversationModal";
import { useChat } from "../hooks/useChat";

const NewChat = () => {
    const {
        // State
        selectedConversation,
        messageInput,
        searchTerm,
        showNewConversationModal,

        // Data
        conversations,
        messages,
        user,
        userRole,

        // Loading states
        conversationsLoading,
        messagesLoading,
        creatingConversation,
        sendingMessage,
        isBackendAvailable,

        // Setters
        setSelectedConversation,
        setMessageInput,
        setSearchTerm,
        setShowNewConversationModal,

        // Handlers
        handleSendMessage,
        handleCreateConversation,
        handleDeleteConversation,
        handleUpdateStatus,
        getParticipantInfoForConversation,
    } = useChat();

    return (
        <div className="h-[70vh] sm:h-[80vh] lg:h-screen max-h-screen mx-auto max-w-full">
            <Card className="h-full shadow-xl border-0 overflow-hidden rounded-lg sm:rounded-none">
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Conversations Sidebar */}
                    <ConversationsList
                        conversations={conversations}
                        selectedConversation={selectedConversation}
                        onSelectConversation={setSelectedConversation}
                        onDeleteConversation={handleDeleteConversation}
                        onUpdateStatus={handleUpdateStatus}
                        onNewConversation={() => setShowNewConversationModal(true)}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        loading={conversationsLoading}
                        isBackendAvailable={isBackendAvailable}
                        userRole={userRole}
                        getParticipantInfo={getParticipantInfoForConversation}
                    />

                    {/* Chat Area */}
                    <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-gradient-to-br from-background to-muted/20`}>
                        {!selectedConversation ? (
                            <EmptyState
                                type="no-conversation"
                                onNewConversation={() => setShowNewConversationModal(true)}
                                isBackendAvailable={isBackendAvailable}
                            />
                        ) : (
                            <>
                                {/* Chat Header */}
                                <ChatHeader
                                    selectedConversation={selectedConversation}
                                    onClose={() => setSelectedConversation(null)}
                                    getParticipantInfo={getParticipantInfoForConversation}
                                    showCloseButton={true}
                                />

                                {/* Messages */}
                                <MessagesList
                                    messages={messages}
                                    loading={messagesLoading}
                                    currentUserId={user?.userID}
                                    userRole={userRole}
                                />

                                {/* Message Input */}
                                <MessageInput
                                    messageInput={messageInput}
                                    onMessageChange={setMessageInput}
                                    onSendMessage={handleSendMessage}
                                    sendingMessage={sendingMessage}
                                    isBackendAvailable={isBackendAvailable}
                                    conversationStatus={selectedConversation?.status}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* New Conversation Modal */}
            <NewConversationModal
                isOpen={showNewConversationModal}
                onClose={() => setShowNewConversationModal(false)}
                onSubmit={handleCreateConversation}
                isCreating={creatingConversation}
                currentUserRole={userRole}
            />
        </div>
    );
};

export default NewChat;
