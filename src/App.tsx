import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useChat } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Settings } from './components/Settings';
import { ProfilePanel } from './components/ProfilePanel';
import { ThreadPanel } from './components/ThreadPanel';
import { Login } from './components/Login';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const { state, dispatch } = useChat();
  const [profilePanelUserId, setProfilePanelUserId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      
      // Close Modals/Panels on Escape
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
           setIsCommandPaletteOpen(false);
        } else if (state.activeThreadMessageId) {
           dispatch({ type: 'SET_ACTIVE_THREAD', payload: null });
        } else if (profilePanelUserId) {
           setProfilePanelUserId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, profilePanelUserId, state.activeThreadMessageId, dispatch]);

  if (!state.currentUser) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-200">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-indigo-600 focus:text-white">
        Skip to main content
      </a>
      <Sidebar />
      <main id="main-content" className="flex-1 flex flex-col min-w-0 outline-none" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ChatArea onAvatarClick={setProfilePanelUserId} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {profilePanelUserId && !state.activeThreadMessageId && (
        <ProfilePanel userId={profilePanelUserId} onClose={() => setProfilePanelUserId(null)} />
      )}
      {state.activeThreadMessageId && (
        <ThreadPanel onAvatarClick={setProfilePanelUserId} />
      )}
      {isCommandPaletteOpen && (
        <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />
      )}
    </div>
  );
}
