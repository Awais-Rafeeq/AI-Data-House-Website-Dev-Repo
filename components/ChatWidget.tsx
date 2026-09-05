import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { sendToN8n, ACTIONS } from '../lib/n8n';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m the AI Data House assistant. How can I help you optimize your business today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      sendToN8n(ACTIONS.CHAT_START, { initial_message: 'User opened widget' });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Cast API Key to string to satisfy TypeScript
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are the official AI Chatbot for AI Data House, a top-tier IT consultancy in Islamabad specializing in AI automation and data analytics for US/UK clients. Be professional, friendly, and helpful. Suggest services like AI voice agents, n8n automation, and custom chatbots. Keep responses concise.',
        }
      });

      const result = await chat.sendMessage({ message: userMsg });
      const aiResponse = result.text || 'I apologize, I am having trouble connecting. Please try again or email us directly.';
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);

      // If user looks like they're sharing contact info or asking for pricing, tag as complete/lead
      if (userMsg.includes('@') || userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        sendToN8n(ACTIONS.CHAT_COMPLETE, { 
          email_captured: userMsg.includes('@') ? userMsg.match(/\S+@\S+\.\S+/)?.[0] : null,
          interest_level: 'High',
          last_msg: userMsg
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please contact us via the form instead!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">AI Data House Assistant</p>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={handleToggle} className="hover:bg-white/10 p-2 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-xs text-slate-400">Typing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask us anything..." 
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleToggle}
          className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform hover:bg-emerald-700 group relative"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
          <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-lg text-slate-700 text-sm font-bold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with AI
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;