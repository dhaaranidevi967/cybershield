import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, Loader2, Shield, Heart, Info } from 'lucide-react';
import { victimSupportChat } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { auth } from '../firebase';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function SupportBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hello. I'm here to support you. If you've experienced a scam, please know that you're not alone. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || loading) return;

    if (!auth.currentUser) {
      alert('Please login to chat with the support bot.');
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const response = await victimSupportChat(userMsg, history);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting. Please try again or call 1930 for immediate help." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Victim Support Bot</h1>
            <p className="text-sm text-gray-500">Empathetic AI guidance for scam victims</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold">
          <Shield className="w-3 h-3" />
          Safe & Confidential
        </div>
      </div>

      <div className="flex-1 bg-[#0f0f2d] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-pink-500/20 text-pink-400'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'
              }`}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                <span className="text-xs text-gray-500">Typing...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/5 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what happened..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-all text-sm"
          />
          <button
            disabled={loading || !input}
            className="p-3 bg-pink-600 hover:bg-pink-700 rounded-xl transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 p-4 rounded-2xl">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        This AI is for support and guidance. For legal reporting, always use official government channels like 1930.
      </div>
    </div>
  );
}
