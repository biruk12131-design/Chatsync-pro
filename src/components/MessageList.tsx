import React, { useEffect, useRef, useCallback } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  onAvatarClick: (userId: string) => void;
}

export function MessageList({ onAvatarClick }: MessageListProps) {
  const { state, dispatch } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredMessages = state.messages.filter(m => {
    if (m.parentMessageId) return false;

    if (state.activeChannelId) {
      if (m.channelId !== state.activeChannelId) return false;
    } else if (state.activeDmUserId) {
      const isRelevant = 
        (m.dmUserId === state.activeDmUserId && m.userId === state.currentUser?.id) ||
        (m.dmUserId === state.currentUser?.id && m.userId === state.activeDmUserId);
      if (!isRelevant) return false;
    }
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const user = state.users.find(u => u.id === m.userId);
      const userNameMatch = user?.fullName.toLowerCase().includes(query) ?? false;
      return m.text.toLowerCase().includes(query) || userNameMatch;
    }
    return true;
  });

  const handleToggleReaction = useCallback((messageId: string, emoji: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'TOGGLE_REACTION', payload: { messageId, emoji, userId: state.currentUser.id } });
  }, [dispatch, state.currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length]);

  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!listRef.current) return;
    const items = Array.from(listRef.current.querySelectorAll('[role="listitem"]')) as HTMLElement[];
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(activeElement);

    if (e.key === 'ArrowDown') {
      if (currentIndex >= 0 && currentIndex < items.length - 1) {
         e.preventDefault();
         items[currentIndex + 1]?.focus();
      } else if (currentIndex === -1 && items.length > 0) {
         e.preventDefault();
         items[0]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (currentIndex > 0) {
         e.preventDefault();
         items[currentIndex - 1]?.focus();
      } else if (currentIndex === -1 && items.length > 0) {
         e.preventDefault();
         items[items.length - 1]?.focus();
      }
    }
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={listRef} onKeyDown={handleKeyDown}>
       {filteredMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
             No messages here yet. Start the conversation!
          </div>
       ) : (
          filteredMessages.map(message => {
             const user = state.users.find(u => u.id === message.userId);
             if (!user || !state.currentUser) return null;
             
             return (
               <MessageItem 
                 key={message.id} 
                 message={message} 
                 user={user} 
                 isOwnMessage={message.userId === state.currentUser.id}
                 onAvatarClick={onAvatarClick}
                 onToggleReaction={handleToggleReaction}
                 currentUserId={state.currentUser.id}
               />
             );
          })
       )}
       <div ref={bottomRef} />
    </div>
  );
}
