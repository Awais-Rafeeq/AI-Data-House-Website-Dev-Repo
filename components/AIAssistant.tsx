import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Grounded, constrained instruction so the assistant stops rambling / inventing.
// NOTE (see cto/tickets/chatbot-n8n-migration.md): the LLM call still runs in
// the browser, which exposes the API key. The full fix moves this whole flow to
// an n8n webhook (key + model + this prompt live server-side). Until then, this
// prompt at least keeps answers short, factual, and pointed at booking.
const CHAT_SYSTEM_PROMPT = `You are Abbas, an AI assistant for AI Data House (ADH), an AI automation studio in Islamabad, Pakistan serving US and UK businesses.

What ADH builds:
- Lead Rescue: capture, qualify, and book every lead in under 2 minutes (from $1,500)
- Ops Autopilot: n8n / Make workflows that sync your tools end to end (from $1,000)
- Decision Dashboard: live Power BI / Microsoft Fabric dashboards (from $1,000)
- Always-On Agent: AI voice and chat agents on web, phone, Instagram, Facebook (from $1,500)
- Business OS: everything wired into one system (from $8,000)
Entry points: a free 30-minute AI Audit, a Discovery Blueprint ($150), or a Mini Pilot ($300).
Proof: 5.0 on Clutch, Top Rated on Upwork, PSEB registered, US timezone coverage.

Rules:
- Keep every reply short: 2 to 3 sentences, under 60 words. No long lists unless asked.
- Use only the facts above. Never invent prices, timelines, client names, or features. If you do not know, say so briefly and offer to connect them to the team.
- Your goal is to get them to book the free audit. End most replies by inviting them, for example: "Want me to help you book a free 30-minute audit?"
- Be warm, direct, and human. No hype, no emojis.`;

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model', text: string }>>([
    { role: 'model', text: "Hi, I'm Abbas from AI Data House. Tell me what's eating up your team's time and I'll point you to the right fix. Or I can book you a free 30-minute audit." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: CHAT_SYSTEM_PROMPT },
      });
      const result = await chat.sendMessage({ message: msg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || "Let me connect you with the team, want me to book you a free audit?" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'I had trouble connecting just now. You can book a free audit any time on our Contact page.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white/80 backdrop-blur-3xl w-[320px] md:w-[400px] h-[650px] rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] flex flex-col border border-white/50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden">
                <Bot className="w-7 h-7 z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <p className="font-black text-base tracking-tight">Abbas</p>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-5 rounded-[2rem] text-sm font-semibold leading-relaxed ${
                    m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t bg-white/50 backdrop-blur-xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Abbas anything..."
                className="flex-1 bg-white border border-slate-100 rounded-3xl px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all"
              />
              <button onClick={handleSend} disabled={isLoading} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"><Send size={24} /></button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all group relative"
          aria-label="Open Abbas AI assistant"
        >
          <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
          <div className="absolute right-full mr-5 bg-white px-6 py-3 rounded-2xl text-slate-900 text-xs font-black shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest border border-slate-100 translate-x-4 group-hover:translate-x-0">
            Abbas AI Assistant
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
