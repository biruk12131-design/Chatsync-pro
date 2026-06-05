import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, Smile, Mic, MicOff } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { cn } from '../lib/utils';

interface MessageInputProps {
  isThreadReply?: boolean;
}

export function MessageInput({ isThreadReply = false }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { state, sendMessage } = useChat();
  const recognitionRef = useRef<any>(null);

  const activeTargetId = isThreadReply ? state.activeThreadMessageId : (state.activeChannelId || state.activeDmUserId);
  const typingUserId = activeTargetId ? state.typingUsers[activeTargetId] : null;
  const isTargetTyping = Boolean(typingUserId && !isThreadReply);
  const typingUser = typingUserId ? state.users.find(u => u.id === typingUserId) : null;

  // Load draft
  useEffect(() => {
     if (activeTargetId) {
        try {
           const draft = localStorage.getItem(`draft_${activeTargetId}`);
           if (draft !== null) {
              setText(draft);
           } else {
              setText('');
           }
        } catch(e) {}
     }
  }, [activeTargetId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const newText = e.target.value;
     setText(newText);
     if (activeTargetId) {
        try {
           localStorage.setItem(`draft_${activeTargetId}`, newText);
        } catch(e) {}
     }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          
          recognitionRef.current.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
               currentTranscript += event.results[i][0].transcript;
            }
            setText(prev => {
               const baseText = prev.replace(/ \.$/, ''); // basic cleanup
               const newText = baseText ? baseText + " " + currentTranscript.trim() : currentTranscript.trim();
               if (activeTargetId) {
                  try {
                     localStorage.setItem(`draft_${activeTargetId}`, newText);
                  } catch(e) {}
               }
               return newText;
            });
          };
          
          recognitionRef.current.onerror = () => {
            setIsRecording(false);
          };
        } catch (e) {
          console.warn('SpeechRecognition initialization failed', e);
        }
      }
    }
    
    return () => {
      if (recognitionRef.current) {
         recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        setText('');
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
          alert('Speech recognition failed to start.');
          setIsRecording(false);
        }
      } else {
        alert('Speech recognition is not supported in this browser.');
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setAttachmentPreview(reader.result as string);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !attachmentPreview) return;
    
    if (isThreadReply && state.activeThreadMessageId) {
       sendMessage(text.trim(), state.activeThreadMessageId, attachmentPreview || undefined);
    } else {
       sendMessage(text.trim(), undefined, attachmentPreview || undefined);
    }
    
    setText('');
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (activeTargetId) {
       try {
          localStorage.removeItem(`draft_${activeTargetId}`);
       } catch(e) {}
    }
    if (isRecording) toggleRecording();
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div className="h-6 mb-2 flex items-end">
        {isTargetTyping && typingUser && (
           <span className="text-xs text-indigo-500 font-medium italic animate-pulse">
              {typingUser.fullName} is typing...
           </span>
        )}
      </div>
      {attachmentPreview && (
         <div className="mb-2 relative inline-block">
            <img src={attachmentPreview} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
            <button 
              type="button" 
              onClick={() => { setAttachmentPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="absolute -top-2 -right-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full p-1 hover:scale-110 transition-transform shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
         </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className={cn("flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center px-3 py-1 focus-within:ring-2 transition-shadow", isRecording ? "ring-2 ring-red-500/50" : "focus-within:ring-indigo-500")}>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageAttachment} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-indigo-500 transition-colors" aria-label="Add attachment">
             <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder={isRecording ? "Listening..." : "Type a message..."}
            className="flex-1 bg-transparent border-none py-3 px-2 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 min-w-0"
          />
          <button 
             type="button" 
             onClick={toggleRecording}
             className={cn("p-2 transition-colors", isRecording ? "text-red-500 animate-pulse" : "text-gray-500 hover:text-indigo-500")}
             aria-label="Toggle voice input"
          >
             {isRecording ? <Mic className="w-5 h-5 drop-shadow-sm" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-indigo-500 transition-colors" aria-label="Add emoji">
             <Smile className="w-5 h-5" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!text.trim() && !isRecording}
          className="p-4 rounded-xl bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
