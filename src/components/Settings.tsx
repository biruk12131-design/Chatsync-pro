import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Moon, Sun, Bell, Volume2, Shield, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function Settings() {
  const { state, dispatch } = useChat();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!state.currentUser) return null;

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 md:p-10 hide-scrollbar pt-20 md:pt-10">
       <div className="max-w-3xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
            <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
          </div>

          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                   <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
                   <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                </div>
             </div>

             <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                   <img src={state.currentUser.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-50 dark:ring-gray-800" />
                   <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Change Photo</button>
                </div>
                <div className="flex-1 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                         <input type="text" defaultValue={state.currentUser.fullName} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                         <input type="text" defaultValue={state.currentUser.username} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" disabled />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input type="email" defaultValue={state.currentUser.email} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <input type="text" defaultValue={state.currentUser.role} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                </div>
             </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                   <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
                   <p className="text-sm text-gray-500">Manage your notifications and theme.</p>
                </div>
             </div>

             <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                         {state.theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </div>
                      <div>
                         <p className="font-medium text-gray-900 dark:text-white">Appearance</p>
                         <p className="text-sm text-gray-500">Toggle between light and dark mode.</p>
                      </div>
                   </div>
                   <button 
                     onClick={toggleTheme}
                     className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", state.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200')}
                     aria-label="Toggle Theme"
                   >
                     <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", state.theme === 'dark' ? 'translate-x-6' : 'translate-x-1')} />
                   </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                         <Bell className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-medium text-gray-900 dark:text-white">Desktop Notifications</p>
                         <p className="text-sm text-gray-500">Receive an alert for new messages.</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                     className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200')}
                     aria-label="Toggle Notifications"
                   >
                     <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", notificationsEnabled ? 'translate-x-6' : 'translate-x-1')} />
                   </button>
                </div>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                         <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-medium text-gray-900 dark:text-white">Notification Sounds</p>
                         <p className="text-sm text-gray-500">Play a sound on new messages.</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSoundEnabled(!soundEnabled)}
                     className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", soundEnabled ? 'bg-indigo-600' : 'bg-gray-200')}
                     aria-label="Toggle Sound"
                   >
                     <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", soundEnabled ? 'translate-x-6' : 'translate-x-1')} />
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
