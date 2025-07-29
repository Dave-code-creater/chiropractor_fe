import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle } from "lucide-react";

const MessageInput = ({
    messageInput,
    onMessageChange,
    onSendMessage,
    sendingMessage,
    isBackendAvailable,
    conversationStatus,
    disabled = false,
}) => {
    const isConversationClosed = conversationStatus === 'closed';
    const isDisabled = disabled || !messageInput.trim() || sendingMessage || !isBackendAvailable || isConversationClosed;

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage(e);
        }
    };

    const getPlaceholder = () => {
        if (!isBackendAvailable) return "Chat service unavailable...";
        if (isConversationClosed) return "This conversation is closed...";
        return "Type your message here...";
    };

    const getStatusMessage = () => {
        if (!isBackendAvailable) {
            return "⚠️ Chat service currently unavailable";
        }
        if (isConversationClosed) {
            return "🔒 This conversation has been closed";
        }
        return "💡 Press Enter to send, Shift + Enter for new line";
    };

    return (
        <div className="p-3 sm:p-4 lg:p-8 border-t bg-background/80 backdrop-blur-sm">
            <form onSubmit={onSendMessage} className="flex items-end gap-3 sm:gap-4 lg:gap-6">
                <div className="flex-1">
                    <Textarea
                        placeholder={getPlaceholder()}
                        value={messageInput}
                        onChange={(e) => onMessageChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="min-h-[40px] sm:min-h-[48px] lg:min-h-[56px] max-h-32 sm:max-h-36 lg:max-h-40 resize-none text-sm sm:text-base bg-muted/20 border-muted-foreground/20 focus:border-primary"
                        disabled={disabled || !isBackendAvailable || isConversationClosed}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isDisabled}
                    className="h-10 sm:h-12 lg:h-14 px-3 sm:px-4 lg:px-8 shadow-sm text-sm sm:text-base"
                >
                    {sendingMessage ? (
                        <>
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-0 sm:mr-2" />
                            <span className="hidden sm:inline">Send</span>
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-2 sm:mt-3 lg:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                    {getStatusMessage()}
                </p>
                {isBackendAvailable && !isConversationClosed && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {messageInput.length}/2000 characters
                    </p>
                )}
            </div>
        </div>
    );
};

export default MessageInput;
