// Main chat components
export { default as NewChat } from './RefactoredNewChat';
export { default as ConversationsList } from './ConversationsList';
export { default as ConversationItem } from './ConversationItem';
export { default as ChatHeader } from './ChatHeader';
export { default as MessagesList } from './MessagesList';
export { default as MessageInput } from './MessageInput';
export { default as EmptyState } from './EmptyState';
export { default as NewConversationModal } from './NewConversationModal';

// Legacy component (for backwards compatibility)
export { default as OriginalNewChat } from './NewChat';

// Hooks
export { useChat } from '../hooks/useChat';

// Utils
export * from '../utils/chatUtils';
