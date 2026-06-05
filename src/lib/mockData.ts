import { User, Channel, Message } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', username: 'alice.w', fullName: 'Alice Walker', avatarUrl: 'https://i.pravatar.cc/150?u=u1', status: 'online', role: 'Product Manager', email: 'alice@chatsync.pro' },
  { id: 'u2', username: 'bob.dev', fullName: 'Bob Builder', avatarUrl: 'https://i.pravatar.cc/150?u=u2', status: 'away', role: 'Senior Developer', email: 'bob@chatsync.pro' },
  { id: 'u3', username: 'charlie.d', fullName: 'Charlie Day', avatarUrl: 'https://i.pravatar.cc/150?u=u3', status: 'busy', role: 'UX Designer', email: 'charlie@chatsync.pro' },
  { id: 'u4', username: 'diana.p', fullName: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=u4', status: 'offline', role: 'Marketing Head', email: 'diana@chatsync.pro' },
  { id: 'u5', username: 'evan.s', fullName: 'Evan Smith', avatarUrl: 'https://i.pravatar.cc/150?u=u5', status: 'online', role: 'DevOps Engineer', email: 'evan@chatsync.pro' },
  { id: 'u6', username: 'fiona.g', fullName: 'Fiona Gallagher', avatarUrl: 'https://i.pravatar.cc/150?u=u6', status: 'online', role: 'Sales Lead', email: 'fiona@chatsync.pro' },
];

export const mockChannels: Channel[] = [
  { id: 'c1', name: 'general', description: 'Company-wide announcements and general chatter.' },
  { id: 'c2', name: 'random', description: 'Non-work banter and water cooler conversation.' },
  { id: 'c3', name: 'design', description: 'Design critiques, assets, and inspiration.' },
  { id: 'c4', name: 'dev', description: 'Engineering discussions and deployments.' },
];

export const initialMessages: Message[] = [
  { id: 'm1', channelId: 'c1', dmUserId: null, userId: 'u1', text: 'Hey everyone, welcome to ChatSync Pro!', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: 'read' },
  { id: 'm2', channelId: 'c1', dmUserId: null, userId: 'u2', text: 'Thanks Alice, the new UI looks slick.', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), status: 'read' },
  { id: 'm3', channelId: 'c4', dmUserId: null, userId: 'u5', text: 'Prod deployment is scheduled for 2 PM.', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), status: 'read' },
  { id: 'm4', channelId: 'c3', dmUserId: null, userId: 'u3', text: 'Can someone review the latest mockups in Figma?', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'read' },
  { id: 'm5', channelId: null, dmUserId: 'u2', userId: 'u2', text: 'Hey, did you check the PR I sent over?', timestamp: new Date(Date.now() - 900000).toISOString(), status: 'read' },
];

export const mockReplies = [
  "That sounds good to me.",
  "Let me check on that and get back to you.",
  "I'm not sure, maybe ask Bob?",
  "Awesome! 🎉",
  "Can we jump on a quick call?",
  "Deploying now 🚀",
  "LGTM 👍",
  "Could you provide more details?",
  "I'll take a look after my current task.",
  "Yes exactly."
];
