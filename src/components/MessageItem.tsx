import React, { memo, useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, MessageSquare, Smile, FileText } from 'lucide-react';
import { Message, User } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useChat } from '../context/ChatContext';

interface MessageItemProps {
  message: Message;
  user: User;
  onAvatarClick: (userId: string) => void;
  isOwnMessage: boolean;
  onToggleReaction: (messageId: string, emoji: string) => void;
  currentUserId: string;
}

export const MessageItem = memo(function MessageItem({ message, user, onAvatarClick, isOwnMessage, onToggleReaction, currentUserId }: MessageItemProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedUrls, setExpandedUrls] = useState<string[]>([]);
  const { state, dispatch } = useChat();
  const quickEmojis = ['👍', '❤️', '😂', '🎉'];

  const replyCount = state.messages.filter(m => m.parentMessageId === message.id).length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !message.parentMessageId) {
       dispatch({ type: 'SET_ACTIVE_THREAD', payload: message.id });
    }
  };

  const renderMessageContent = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.text.split(urlRegex);
    const imageRegex = /\.(jpeg|jpg|gif|png|webp)($|\?)/i;
    const docRegex = /\.(pdf|doc|docx|txt|csv)($|\?)/i;

    const hasRichLinks = parts.some(p => p.match(urlRegex) && (p.match(imageRegex) || p.match(docRegex)));

    const highlightText = (textStr: string) => {
       if (!state.searchQuery) return textStr;
       const splitParts = textStr.split(new RegExp(`(${state.searchQuery})`, 'gi'));
       return splitParts.map((part, i) => 
          part.toLowerCase() === state.searchQuery.toLowerCase() ? (
             <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/50 text-gray-900 rounded-sm font-medium">{part}</mark>
          ) : part
       );
    };

    if (!hasRichLinks && parts.length === 1 && !message.attachment) {
       return <div>{highlightText(message.text)}</div>;
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="whitespace-pre-wrap">
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" onClick={e => e.stopPropagation()}>
                  {part}
                </a>
              );
            }
            return <span key={i}>{highlightText(part)}</span>;
          })}
        </div>
        
        {/* Thumbnails wrapper */}
        {parts.filter(p => p.match(urlRegex) && p.match(imageRegex)).length > 0 && (
           <div className="flex flex-wrap gap-2 mt-1">
              {parts.filter(p => p.match(urlRegex) && p.match(imageRegex)).map((url, i) => {
                  const isExpanded = expandedUrls.includes(url);
                  return (
                     <div key={i} className="relative cursor-pointer" onClick={(e) => {
                         e.stopPropagation();
                         setExpandedUrls(prev => isExpanded ? prev.filter(u => u !== url) : [...prev, url]);
                     }}>
                        <img 
                          src={url} 
                          alt="Attachment" 
                          referrerPolicy="no-referrer"
                          className={cn(
                             "rounded-lg object-cover border border-black/10 dark:border-white/10 transition-all duration-300",
                             isExpanded ? "w-full max-h-[400px]" : "max-w-[200px] max-h-[150px]"
                          )} 
                        />
                     </div>
                  );
              })}
           </div>
        )}

        {/* Doc previews wrapper */}
        {parts.filter(p => p.match(urlRegex) && p.match(docRegex)).length > 0 && (
           <div className="flex flex-wrap gap-2 mt-1">
              {parts.filter(p => p.match(urlRegex) && p.match(docRegex)).map((url, i) => (
                 <a key={i} href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-2 p-2 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    <FileText className="w-5 h-5 opacity-70" />
                    <span className="text-xs font-medium truncate max-w-[150px]">{url.split('/').pop()?.split('?')[0] || 'Document'}</span>
                 </a>
              ))}
           </div>
        )}
        
        {/* Attached image preview */}
        {message.attachment && (
           <div className="mt-2 relative cursor-pointer" onClick={(e) => {
               e.stopPropagation();
               setExpandedUrls(prev => prev.includes('attachment') ? prev.filter(u => u !== 'attachment') : [...prev, 'attachment']);
           }}>
              <img 
                src={message.attachment} 
                alt="Upload Attachment" 
                className={cn(
                   "rounded-lg object-cover border border-black/10 dark:border-white/10 transition-all duration-300",
                   expandedUrls.includes('attachment') ? "w-full max-h-[400px]" : "max-w-[200px] max-h-[150px]"
                )} 
              />
           </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
       role="listitem"
       tabIndex={0}
       onKeyDown={handleKeyDown}
       initial={{ opacity: 0, y: 10, scale: 0.98 }}
       animate={{ opacity: 1, y: 0, scale: 1 }}
       transition={{ duration: 0.2 }}
       className={cn("group flex gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500", isOwnMessage && "flex-row-reverse")}
       onMouseLeave={() => setShowEmojiPicker(false)}
    >
       <button onClick={() => onAvatarClick(user.id)} className="flex-shrink-0 focus:outline-none">
          <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity" />
       </button>
       <div className={cn("flex flex-col min-w-0 flex-1", isOwnMessage && "items-end")}>
          <div className={cn("flex items-baseline gap-2", isOwnMessage && "flex-row-reverse")}>
             <button onClick={() => onAvatarClick(user.id)} className="font-bold text-sm text-gray-900 dark:text-white hover:underline focus:outline-none">
                {user.fullName}
             </button>
             <span className="text-xs text-gray-500">
                {format(new Date(message.timestamp), 'h:mm a')}
             </span>
          </div>
          <div className="relative group/bubble flex items-center">
             <div className={cn("mt-1 text-sm text-gray-800 dark:text-gray-200 break-words max-w-xl", isOwnMessage ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3" : "bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3")}>
                {renderMessageContent()}
             </div>
             
             {/* Reaction & Reply trigger */}
             <div className={cn("mx-2 opacity-0 group-hover/bubble:opacity-100 transition-opacity relative flex gap-1", isOwnMessage ? "order-first" : "")}>
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Add reaction"
                >
                  <Smile className="w-4 h-4" />
                </button>
                
                {/* Reply button */}
                {!message.parentMessageId && (
                  <button 
                    onClick={() => dispatch({ type: 'SET_ACTIVE_THREAD', payload: message.id })}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Reply in Thread"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                
                {/* Mini Emoji Picker */}
                {showEmojiPicker && (
                  <div className={cn("absolute top-8 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex gap-1 z-10", isOwnMessage ? "right-0" : "left-0")}>
                    {quickEmojis.map(emoji => (
                       <button
                         key={emoji}
                         onClick={() => {
                           onToggleReaction(message.id, emoji);
                           setShowEmojiPicker(false);
                         }}
                         className="hover:scale-110 transition-transform text-lg px-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                       >
                         {emoji}
                       </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
          
          {/* Reaction display */}
          <div className={cn("mt-1 flex flex-wrap items-center gap-2", isOwnMessage && "justify-end")}>
            {message.reactions && Object.keys(message.reactions).length > 0 && (
               <div className={cn("flex flex-wrap gap-1", isOwnMessage && "justify-end")}>
                  {Object.entries(message.reactions).map(([emoji, users]) => {
                    const hasReacted = users.includes(currentUserId);
                    return (
                       <button
                          key={emoji}
                          onClick={() => onToggleReaction(message.id, emoji)}
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors",
                            hasReacted 
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400" 
                              : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
                          )}
                          title={users.length > 0 ? `${users.length} reaction${users.length > 1 ? 's' : ''}` : undefined}
                       >
                          <span>{emoji}</span>
                          <span>{users.length}</span>
                       </button>
                    );
                  })}
               </div>
            )}
            
            {/* Thread Reply Count */}
            {replyCount > 0 && !message.parentMessageId && (
              <button 
                onClick={() => dispatch({ type: 'SET_ACTIVE_THREAD', payload: message.id })}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {replyCount} reply{replyCount !== 1 ? 's' : ''}
              </button>
            )}
          </div>
          
          {isOwnMessage && (
             <div className="mt-1 flex items-center h-4 text-xs">
                {message.status === 'sending' && <span className="text-gray-400">Sending...</span>}
                {message.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
                {message.status === 'read' && <CheckCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
             </div>
          )}
       </div>
    </motion.div>
  );
});
