import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Search, Hash, Users } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatAreaProps {
  onAvatarClick: (userId: string) => void;
}

export function ChatArea({ onAvatarClick }: ChatAreaProps) {
  const { state, dispatch } = useChat();

  const currentChannel = state.channels.find(c => c.id === state.activeChannelId);
  const currentDmUser = state.users.find(u => u.id === state.activeDmUserId);

  useEffect(() => {
    // When viewing a channel/DM, mark its messages as read (simulating others have seen your messages)
    if (state.activeChannelId || state.activeDmUserId) {
        dispatch({ 
           type: 'MARK_CHANNEL_READ', 
           payload: { channelId: state.activeChannelId, dmUserId: state.activeDmUserId } 
        });
    }
  }, [state.activeChannelId, state.activeDmUserId, state.messages.length, dispatch]);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full relative pt-16 md:pt-0">
       {/* Header */}
       <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
             {currentChannel ? (
               <>
                 <Hash className="w-5 h-5 text-gray-500" />
                 <h2 className="font-bold text-gray-900 dark:text-white truncate">{currentChannel.name}</h2>
                 <span className="hidden sm:inline text-sm text-gray-500 truncate ml-2">
                    {currentChannel.description}
                 </span>
               </>
             ) : currentDmUser ? (
               <>
                 <img src={currentDmUser.avatarUrl} alt={currentDmUser.fullName} className="w-8 h-8 rounded-full object-cover" />
                 <h2 className="font-bold text-gray-900 dark:text-white truncate ml-2">
                   {currentDmUser.fullName}
                 </h2>
                 <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ml-2 border border-gray-200 dark:border-gray-700">
                   {currentDmUser.role}
                 </span>
               </>
             ) : null}
          </div>
          
          <div className="flex items-center gap-4">
             {currentChannel && (
               <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" title="Members">
                 <Users className="w-4 h-4" />
                 <span>{state.users.length}</span>
               </div>
             )}
             <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={state.searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                  className="w-32 sm:w-48 bg-gray-100 dark:bg-gray-800 border-none rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:w-48 sm:focus:w-64 placeholder-gray-500"
                />
             </div>
          </div>
       </header>

       {/* Chat List */}
       <MessageList onAvatarClick={onAvatarClick} />

       {/* Input Area */}
       <MessageInput />
    </div>
  );
}
