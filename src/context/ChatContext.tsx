import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Channel, Message, ChatState, UserStatus } from '../types';
import { mockUsers, mockChannels, initialMessages, mockReplies } from '../lib/mockData';

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_ACTIVE_CHANNEL'; payload: string }
  | { type: 'SET_ACTIVE_DM'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { id: string; status: 'sending' | 'sent' | 'read' } }
  | { type: 'SET_TYPING'; payload: { targetId: string; userId: string | null } }
  | { type: 'TOGGLE_REACTION'; payload: { messageId: string; emoji: string; userId: string } }
  | { type: 'REORDER_CHANNELS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'SET_ACTIVE_THREAD'; payload: string | null }
  | { type: 'RANDOMIZE_STATUSES' }
  | { type: 'ADD_CHANNEL'; payload: Channel }
  | { type: 'MARK_CHANNEL_READ'; payload: { channelId: string | null; dmUserId: string | null } };

const getInitialState = (): ChatState => {
  let savedMessages = null;
  let savedChannels = null;
  let theme = 'dark';

  try {
    savedMessages = localStorage.getItem('chatSyncMessages');
    savedChannels = localStorage.getItem('chatSyncChannels');
    theme = localStorage.getItem('theme') || 'dark';
  } catch (error) {
    console.warn('localStorage access denied', error);
  }

  let parsedChannels = mockChannels;
  let parsedMessages = initialMessages;

  if (savedChannels) {
    try {
      parsedChannels = JSON.parse(savedChannels);
    } catch (e) {}
  }
  
  if (savedMessages) {
    try {
      parsedMessages = JSON.parse(savedMessages);
    } catch (e) {}
  }

  return {
    currentUser: null,
    users: mockUsers,
    channels: parsedChannels,
    messages: parsedMessages,
    activeChannelId: parsedChannels[0]?.id || mockChannels[0].id,
    activeDmUserId: null,
    searchQuery: '',
    typingUsers: {},
    theme: theme as 'light' | 'dark',
    activeThreadMessageId: null,
  };
};

const initialState: ChatState = getInitialState();

function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_THEME':
      try {
         localStorage.setItem('theme', action.payload);
      } catch (e) {
         console.warn('localStorage is disabled', e);
      }
      const root = window.document.documentElement;
      if (action.payload === 'dark') {
         root.classList.add('dark');
      } else {
         root.classList.remove('dark');
      }
      return { ...state, theme: action.payload };
    case 'SET_ACTIVE_CHANNEL':
      return { ...state, activeChannelId: action.payload, activeDmUserId: null };
    case 'SET_ACTIVE_DM':
      return { ...state, activeChannelId: null, activeDmUserId: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, status: action.payload.status } : m
        ),
      };
    case 'SET_TYPING':
      const newTypingUsers = { ...state.typingUsers };
      if (action.payload.userId) {
         newTypingUsers[action.payload.targetId] = action.payload.userId;
      } else {
         delete newTypingUsers[action.payload.targetId];
      }
      return {
        ...state,
        typingUsers: newTypingUsers,
      };
    case 'TOGGLE_REACTION':
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id !== action.payload.messageId) return m;
          const reactions = { ...(m.reactions || {}) };
          const userList = reactions[action.payload.emoji] || [];
          if (userList.includes(action.payload.userId)) {
             reactions[action.payload.emoji] = userList.filter((id) => id !== action.payload.userId);
             if (reactions[action.payload.emoji].length === 0) {
               delete reactions[action.payload.emoji];
             }
          } else {
             reactions[action.payload.emoji] = [...userList, action.payload.userId];
          }
          return { ...m, reactions };
        }),
      };
    case 'REORDER_CHANNELS': {
       const result = Array.from(state.channels);
       const [removed] = result.splice(action.payload.startIndex, 1);
       result.splice(action.payload.endIndex, 0, removed);
       return { ...state, channels: result };
    }
    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThreadMessageId: action.payload };
    case 'RANDOMIZE_STATUSES': {
      const statuses: UserStatus[] = ['online', 'away', 'busy', 'offline'];
      return {
        ...state,
        users: state.users.map(u => {
          if (u.id === state.currentUser?.id) return u;
          if (Math.random() < 0.1) {
            return { ...u, status: statuses[Math.floor(Math.random() * statuses.length)] };
          }
          return u;
        })
      };
    }
    case 'ADD_CHANNEL':
      return { ...state, channels: [...state.channels, action.payload] };
    case 'MARK_CHANNEL_READ':
      return {
        ...state,
        messages: state.messages.map(m => {
          if (m.channelId === action.payload.channelId && m.dmUserId === action.payload.dmUserId && m.status !== 'read') {
            return { ...m, status: 'read' };
          }
          return m;
        })
      };
    default:
      return state;
  }
}

interface ChatContextProps {
  state: ChatState;
  dispatch: React.Dispatch<Action>;
  sendMessage: (text: string, parentMessageId?: string, attachment?: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
     // Apply initial theme
     const root = window.document.documentElement;
     if (state.theme === 'dark') {
       root.classList.add('dark');
     } else {
       root.classList.remove('dark');
     }
  }, [state.theme]);

  useEffect(() => {
     try {
       localStorage.setItem('chatSyncMessages', JSON.stringify(state.messages));
       localStorage.setItem('chatSyncChannels', JSON.stringify(state.channels));
     } catch (e) {
       console.warn('localStorage is disabled', e);
     }
  }, [state.messages, state.channels]);

  useEffect(() => {
     const interval = setInterval(() => {
        dispatch({ type: 'RANDOMIZE_STATUSES' });
     }, 10000);
     return () => clearInterval(interval);
  }, []);

  const sendMessage = (text: string, parentMessageId?: string, attachment?: string) => {
    if (!state.currentUser) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      channelId: state.activeChannelId,
      dmUserId: state.activeDmUserId,
      userId: state.currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sending',
      parentMessageId,
      attachment,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

    // Simulate sending -> sent -> read
    setTimeout(() => {
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { id: newMessage.id, status: 'sent' } });
    }, 500);

    setTimeout(() => {
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { id: newMessage.id, status: 'read' } });
    }, 3000);

    // Simulate a random reply if in a channel or DM
    const targetId = state.activeChannelId || state.activeDmUserId;
    if (targetId) {
      setTimeout(() => {
         const randomUser = state.activeDmUserId 
           ? state.users.find(u => u.id === state.activeDmUserId) 
           : state.users.filter(u => u.id !== state.currentUser?.id)[Math.floor(Math.random() * (state.users.length - 1))];
           
         if (randomUser) {
           // Mock typing indicator
           dispatch({ type: 'SET_TYPING', payload: { targetId, userId: randomUser.id } });
           
           setTimeout(() => {
              dispatch({ type: 'SET_TYPING', payload: { targetId, userId: null } });
              
              // Generate random reply message
              const replyMessage: Message = {
                id: Math.random().toString(36).substr(2, 9),
                channelId: state.activeChannelId,
                dmUserId: state.activeDmUserId ? state.currentUser?.id || null : null, // If it's a DM, reply from that user to current user
                userId: randomUser.id,
                text: mockReplies[Math.floor(Math.random() * mockReplies.length)],
                timestamp: new Date().toISOString(),
                status: 'read',
                parentMessageId,
              };
              dispatch({ type: 'ADD_MESSAGE', payload: replyMessage });
              
              try {
                // Play a simple notification sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.warn('Audio play failed', e));
              } catch(e) {}
           }, 2000); // typing for 2 seconds
         }
      }, Math.random() * 4000 + 4000); // reply after 4-8 seconds
    }
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
