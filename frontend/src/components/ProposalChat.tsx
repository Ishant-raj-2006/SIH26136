import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import type { Message } from '@/types';
import { format } from 'date-fns';

interface ProposalChatProps {
  proposalId: number;
  onClose: () => void;
  title?: string;
}

export const ProposalChat: React.FC<ProposalChatProps> = ({ proposalId, onClose, title = "Proposal Chat" }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await apiClient.getProposalMessages(proposalId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [proposalId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const newMsg = await apiClient.sendProposalMessage(proposalId, input);
      setMessages([...messages, newMsg]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 left-4 z-[100] w-[calc(100vw-2rem)] sm:w-[350px]">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[450px] sm:h-[500px]"
        >
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold text-sm truncate">{title}</h3>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {loading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading chat...</div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-slate-500 text-center px-4">
                No messages yet. Send a message to start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'}`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] mt-1 block ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent focus:border-primary-500/20"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
