import React from 'react';
import { X, Mail, Shield, Clock } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { format } from 'date-fns';

interface ProfilePanelProps {
  userId: string;
  onClose: () => void;
}

export function ProfilePanel({ userId, onClose }: ProfilePanelProps) {
  const { state } = useChat();
  const user = state.users.find(u => u.id === userId) || (state.currentUser?.id === userId ? state.currentUser : null);

  if (!user) return null;

  const recentMessages = state.messages
    .filter(m => (m.userId === user.id && m.dmUserId === state.currentUser?.id) || (m.userId === state.currentUser?.id && m.dmUserId === user.id))
    .slice(-3);

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0 flex flex-col h-full transform transition-transform duration-300 absolute right-0 z-50 md:static">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-gray-900 dark:text-white">Profile</h2>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex flex-col items-center border-b border-gray-200 dark:border-gray-800">
        <img src={user.avatarUrl} alt={user.fullName} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-indigo-50 dark:ring-indigo-500/20" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
        <p className="text-gray-500 mb-2">@{user.username}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          user.status === 'online' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
          user.status === 'away' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
          user.status === 'busy' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
          'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
        }`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div>
           <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
             <Shield className="w-4 h-4" />
             <span>{user.role}</span>
           </div>
           <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
             <Mail className="w-4 h-4" />
             <a href={`mailto:${user.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{user.email}</a>
           </div>
        </div>

        <div>
           <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Recent Messages with you</h3>
           <div className="space-y-3">
              {recentMessages.length > 0 ? recentMessages.map(m => (
                 <div key={m.id} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex justify-between items-baseline mb-1">
                       <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {m.userId === state.currentUser?.id ? 'You' : user.fullName}
                       </span>
                       <span className="text-[10px] text-gray-500">{format(new Date(m.timestamp), 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{m.text}</p>
                 </div>
              )) : (
                 <p className="text-sm text-gray-500 italic">No recent direct messages.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
