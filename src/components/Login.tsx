import React from 'react';
import { useChat } from '../context/ChatContext';
import { LogIn } from 'lucide-react';

export function Login() {
  const { state, dispatch } = useChat();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get('userId') as string;
    const user = state.users.find(u => u.id === userId);
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#gradient)" />
              <path d="M12 14L20 20L28 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20L20 26L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 tracking-tight">Welcome to ChatSync Pro</h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Select a mock profile to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Continue as User
              </label>
              <select
                id="userId"
                name="userId"
                required
                defaultValue=""
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
              >
                <option value="" disabled>Select a user...</option>
                {state.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} (@{user.username})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition-colors duration-200"
            >
              <LogIn className="w-5 h-5" />
              Sign in to Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
