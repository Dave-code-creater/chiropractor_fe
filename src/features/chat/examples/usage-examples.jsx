import React from 'react';
import { NewChat } from './components';

// Example 1: Using the main refactored component (recommended)
const ChatPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Healthcare Chat</h1>
            <NewChat />
        </div>
    );
};

// Example 2: Custom layout using individual components
import {
    ConversationsList,
    ChatHeader,
    MessagesList,
    MessageInput,
    useChat
} from './components';

const CustomChatLayout = () => {
    const chatState = useChat();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-screen">
            {/* Conversations in a separate column */}
            <div className="lg:col-span-1">
                <ConversationsList {...chatState} />
            </div>

            {/* Chat area taking more space */}
            <div className="lg:col-span-2 flex flex-col">
                {chatState.selectedConversation ? (
                    <>
                        <ChatHeader {...chatState} />
                        <MessagesList {...chatState} />
                        <MessageInput {...chatState} />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Example 3: Testing individual components
import { render, screen } from '@testing-library/react';
import { MessageInput } from './components';

const TestMessageInput = () => {
    const [message, setMessage] = React.useState('');

    const handleSend = (e) => {
        e.preventDefault();
        console.log('Sending:', message);
        setMessage('');
    };

    return (
        <MessageInput
            messageInput={message}
            onMessageChange={setMessage}
            onSendMessage={handleSend}
            sendingMessage={false}
            isBackendAvailable={true}
            conversationStatus="active"
        />
    );
};

export { ChatPage, CustomChatLayout, TestMessageInput };
