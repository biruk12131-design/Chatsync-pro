import React, { useState, FC } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Hash, MessageSquare, Menu, Settings as SettingsIcon, X, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserStatus } from '../types';
import { ActivityChart } from './ActivityChart';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableChannelItemProps {
  channel: any;
  isActive: boolean;
  onClick: () => void;
}

const SortableChannelItem: FC<SortableChannelItemProps> = ({ channel, isActive, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: channel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
          isActive 
            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        )}
      >
        <Hash className="w-4 h-4 opacity-70" />
        {channel.name}
      </button>
    </li>
  );
}

export function Sidebar() {
  const { state, dispatch } = useChat();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = state.currentUser;
  if (!currentUser) return null;

  const StatusDot = ({ status }: { status: UserStatus }) => {
    const color = {
      online: 'bg-green-500 animate-pulse',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    }[status];
    return <span className={cn('w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-900', color)} />;
  };

  const navClass = cn(
    'fixed inset-y-0 left-0 z-40 w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires minimum distance before dragging starts, allowing clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = state.channels.findIndex((c) => c.id === active.id);
      const newIndex = state.channels.findIndex((c) => c.id === over.id);
      
      dispatch({ type: 'REORDER_CHANNELS', payload: { startIndex: oldIndex, endIndex: newIndex } });
    }
  };

  return (
    <>
      <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center absolute w-full z-30">
        <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" aria-label="Open sidebar">
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-bold ml-2 text-gray-900 dark:text-white flex items-center gap-2">
           <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#gradient-sm)" />
              <path d="M12 14L20 20L28 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20L20 26L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient-sm" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            ChatSync Pro
        </div>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <nav className={navClass}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative">
                <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 object-cover" />
                <div className="absolute bottom-0 right-0">
                  <StatusDot status={currentUser.status} />
                </div>
             </div>
             <div>
               <h2 className="font-bold text-sm text-gray-900 dark:text-white">{currentUser.fullName}</h2>
               <p className="text-xs text-gray-500">{currentUser.role}</p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="relative mb-6">
             <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search messages..." 
               value={state.searchQuery}
               onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
               className="w-full bg-gray-200/50 dark:bg-gray-800/50 border-none rounded-lg py-1.5 pl-9 pr-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
             />
          </div>
          <div>
             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Channels</h3>
             <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
               <SortableContext items={state.channels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                 <ul className="space-y-1">
                   {state.channels.map((channel) => {
                     const isActive = state.activeChannelId === channel.id;
                     return (
                       <SortableChannelItem
                         key={channel.id}
                         channel={channel}
                         isActive={isActive}
                         onClick={() => {
                           dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: channel.id });
                           navigate('/');
                           setIsOpen(false);
                         }}
                       />
                     );
                   })}
                 </ul>
               </SortableContext>
             </DndContext>
          </div>

          <div>
             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Direct Messages</h3>
             <ul className="space-y-1">
               {state.users.filter(u => u.id !== currentUser.id).map(user => {
                 const isActive = state.activeDmUserId === user.id;
                 return (
                   <li key={user.id}>
                     <button
                       onClick={() => {
                         dispatch({ type: 'SET_ACTIVE_DM', payload: user.id });
                         navigate('/');
                         setIsOpen(false);
                       }}
                       className={cn(
                         "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                         isActive 
                           ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium" 
                           : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                       )}
                     >
                       <div className="relative w-5 h-5">
                          <img src={user.avatarUrl} alt={user.username} className="w-5 h-5 rounded-md object-cover" />
                          <div className="absolute -bottom-0.5 -right-0.5">
                             <StatusDot status={user.status} />
                          </div>
                       </div>
                       {user.fullName}
                     </button>
                   </li>
                 )
               })}
             </ul>
          </div>
          
          <ActivityChart />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
           <button
             onClick={() => { navigate('/settings'); setIsOpen(false); }}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
           >
             <SettingsIcon className="w-4 h-4" />
             Settings
           </button>
        </div>
      </nav>
    </>
  );
}
