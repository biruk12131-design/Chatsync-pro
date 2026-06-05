import React from 'react';
import { X, Hash, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';

interface ThreadPanelProps {
  onAvatarClick: (userId: string) => void;
}

export function ThreadPanel({ onAvatarClick }: ThreadPanelProps) {
  const { state, dispatch } = useChat();
  const threadId = state.activeThreadMessageId;
  const parentMessage = state.messages.find(m => m.id === threadId);

  if (!threadId || !parentMessage) return null;

  const replies = state.messages.filter(m => m.parentMessageId === threadId);

  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'TOGGLE_REACTION', payload: { messageId, emoji, userId: state.currentUser.id } });
  };

  return (
    <div className="w-80 md:w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0 flex flex-col h-full transform transition-transform duration-300 absolute right-0 z-50 md:static">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Thread</h2>
        </div>
        <button 
          onClick={() => dispatch({ type: 'SET_ACTIVE_THREAD', payload: null })} 
          className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Original Message */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            {(() => {
                const user = state.users.find(u => u.id === parentMessage.userId);
                if (!user || !state.currentUser) return null;
                return (
                   <MessageItem 
                     message={parentMessage} 
                     user={user} 
                     isOwnMessage={parentMessage.userId === state.currentUser.id}
                     onAvatarClick={onAvatarClick}
                     onToggleReaction={handleToggleReaction}
                     currentUserId={state.currentUser.id}
                   />
                );
            })()}
        </div>

        {/* Replies */}
        <div className="p-4 flex-1 space-y-4">
           {replies.length === 0 ? (
              <div className="mt-8 text-center text-sm text-gray-500">
                 No replies yet. Start the conversation!
              </div>
           ) : (
             <div className="relative">
                <div className="absolute left-6 top-0 bottom-8 border-l-2 border-gray-100 dark:border-gray-800 -z-10" />
                <div className="space-y-4">
                   {replies.map((reply) => {
                       const user = state.users.find(u => u.id === reply.userId);
                       if (!user || !state.currentUser) return null;
                       return (
                          <MessageItem 
                             key={reply.id} 
                             message={reply} 
                             user={user} 
                             isOwnMessage={reply.userId === state.currentUser.id}
                             onAvatarClick={onAvatarClick}
                             onToggleReaction={handleToggleReaction}
                             currentUserId={state.currentUser.id}
                          />
                       );
                   })}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Input */}
      <MessageInput isThreadReply />
    </div>
  );
}
