export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  status: UserStatus;
  role: string;
  email: string;
}

export interface Message {
  id: string;
  channelId: string | null; // null if DM
  dmUserId: string | null; // null if Channel
  userId: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'read';
  reactions?: Record<string, string[]>;
  parentMessageId?: string; // Add support for threads
}

export interface Channel {
  id: string;
  name: string;
  description: string;
}

export interface ChatState {
  currentUser: User | null;
  users: User[];
  channels: Channel[];
  messages: Message[];
  activeChannelId: string | null;
  activeDmUserId: string | null;
  searchQuery: string;
  typingUsers: Record<string, string>; // targetId -> userId of who's typing
  theme: 'light' | 'dark';
  activeThreadMessageId: string | null;
}
