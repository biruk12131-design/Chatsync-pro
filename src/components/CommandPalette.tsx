import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Hash, Search, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const { state, dispatch } = useChat();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredChannels = state.channels.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const filteredUsers = state.users.filter(u => u.id !== state.currentUser?.id && u.fullName.toLowerCase().includes(query.toLowerCase()));
  
  const quickActions = [
    { type: 'action' as const, id: 'create-channel', label: 'Create new channel', description: 'Create a new chat channel' },
    { type: 'action' as const, id: 'recent-activity', label: 'Jump to recent activity', description: 'Go to most recently active channel' },
    { type: 'action' as const, id: 'toggle-theme', label: 'Toggle theme', description: `Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode` },
  ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()));

  const options = [
    ...quickActions,
    ...filteredChannels.map(c => ({ type: 'channel' as const, id: c.id, label: c.name, description: c.description })),
    ...filteredUsers.map(u => ({ type: 'user' as const, id: u.id, label: u.fullName, description: `@${u.username}`, avatarUrl: u.avatarUrl }))
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (index: number) => {
    const selected = options[index];
    if (!selected) return;
    
    if (selected.type === 'action') {
      if (selected.id === 'create-channel') {
         const name = window.prompt('Enter channel name:');
         if (name && name.trim()) {
            const newChannel = { id: Math.random().toString(36).substr(2, 9), name: name.trim(), description: 'New channel' };
            dispatch({ type: 'ADD_CHANNEL', payload: newChannel });
            dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: newChannel.id });
            navigate('/');
         }
      } else if (selected.id === 'recent-activity') {
         const mostRecent = [...state.messages].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).find(m => m.channelId);
         if (mostRecent && mostRecent.channelId) {
            dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: mostRecent.channelId });
            navigate('/');
         }
      } else if (selected.id === 'toggle-theme') {
         dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
      }
    } else if (selected.type === 'channel') {
      dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: selected.id });
      navigate('/');
    } else {
      dispatch({ type: 'SET_ACTIVE_DM', payload: selected.id });
      navigate('/');
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 pb-4 px-4 sm:px-6 lg:px-8 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-800">
           <Search className="w-5 h-5 text-gray-400 mr-3" />
           <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-lg"
              placeholder="Search channels or people..."
           />
           <button onClick={onClose} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">ESC</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
           {options.length === 0 ? (
             <div className="p-8 text-center text-gray-500">No results found.</div>
           ) : (
             <ul className="space-y-1">
               {options.map((option, index) => {
                 const isSelected = index === selectedIndex;
                 return (
                    <li key={`${option.type}-${option.id}`}>
                      <button
                        onClick={() => handleSelect(index)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                           "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left",
                           isSelected 
                             ? "bg-indigo-600 text-white" 
                             : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                         {option.type === 'action' ? (
                           <Zap className={cn("w-5 h-5", isSelected ? "text-indigo-200" : "text-gray-400")} />
                         ) : option.type === 'channel' ? (
                           <Hash className={cn("w-5 h-5", isSelected ? "text-indigo-200" : "text-gray-400")} />
                         ) : (
                           <img src={option.avatarUrl} alt="" className="w-6 h-6 rounded-md object-cover" />
                         )}
                         <div className="flex flex-col min-w-0">
                           <span className="font-medium truncate">{option.label}</span>
                           <span className={cn("text-xs truncate", isSelected ? "text-indigo-200" : "text-gray-400")}>{option.description}</span>
                         </div>
                      </button>
                    </li>
                 )
               })}
             </ul>
           )}
        </div>
      </div>
    </div>
  );
}
