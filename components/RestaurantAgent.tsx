
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Chat } from '@google/genai';
import { Mic, Send, MessageSquare, Phone, ShoppingBag, Clock, CheckCircle2, Utensils, X, ChevronRight, User, Bot, AlertCircle, ChefHat, Timer, Settings, Plus, Trash2, Edit3, Save, Minus, Truck, PackageCheck, Archive } from 'lucide-react';
import { RESTAURANT_MENU } from '../constants';
import { sendToN8n, ACTIONS } from '../lib/n8n';

interface LogEntry {
  id: string;
  time: string;
  source: 'VOICE' | 'CHAT' | 'SYSTEM';
  role: 'USER' | 'AI' | 'TOOL';
  content: string;
  intent?: string;
  status?: 'Processing' | 'Confirmed' | 'Draft' | 'Cancelled';
}

interface OrderItem {
  itemName: string;
  quantity: number;
  notes?: string;
}

interface ActiveOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Open' | 'Ready' | 'Delivered' | 'Cancelled';
  timePlaced: Date;
  estimatedTime: number; // minutes
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

const RestaurantAgent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'chat'>('voice');
  const [activeRightTab, setActiveRightTab] = useState<'transcript' | 'orders' | 'menu'>('transcript');
  const [kdsStage, setKdsStage] = useState<'Open' | 'Ready' | 'Delivered'>('Open');
  
  // Dynamic Restaurant State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(RESTAURANT_MENU.items);
  const [deliveryTime, setDeliveryTime] = useState(45); // Default minutes
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState<ActiveOrder | null>(null);

  // Cart for Quick Select
  const [cart, setCart] = useState<Record<string, number>>({});

  // Refs for Voice & Chat
  const sessionRef = useRef<any>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to format markdown text (e.g. **bold**)
  const formatMessage = (content: string) => {
    // Basic formatting for bold text and newlines
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return (
        <div className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-black text-emerald-600">{part.slice(2, -2)}</strong>;
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
  };

  // Function Declarations
  const orderFunction: FunctionDeclaration = {
    name: 'placeOrder',
    description: 'Place a final order after collecting items and customer email.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemName: { type: Type.STRING, description: 'Exact name from menu' },
              quantity: { type: Type.NUMBER, description: 'Quantity' },
              notes: { type: Type.STRING, description: 'Modifications (no onions, etc)' }
            }
          }
        },
        customerName: { type: Type.STRING, description: 'Name of customer' },
        customerEmail: { type: Type.STRING, description: 'Email for receipt' }
      },
      required: ['items', 'customerEmail']
    }
  };

  const cancelFunction: FunctionDeclaration = {
    name: 'cancelOrder',
    description: 'Cancel the most recently placed order or the current order being discussed.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: { type: Type.STRING, description: 'Reason for cancellation' }
      }
    }
  };

  const addLog = (entry: Omit<LogEntry, 'id' | 'time'>) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...entry
    }, ...prev]);
  };

  const updateTranscriptLog = (text: string, role: 'USER' | 'AI') => {
      setLogs(prev => {
          const latest = prev[0];
          // Check if the latest log matches the current speaker turn and is in draft (streaming) mode
          if (latest && latest.role === role && latest.source === 'VOICE' && latest.status === 'Draft') {
              const updated = { ...latest, content: latest.content + " " + text };
              return [updated, ...prev.slice(1)];
          }
          
          return [{
              id: Math.random().toString(36).substring(7),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              source: 'VOICE',
              role: role,
              content: text,
              status: 'Draft'
          }, ...prev];
      });
  };

  const handleOrderPlaced = (args: any) => {
    try {
        let total = 0;
        // Safety check for items array
        const items = Array.isArray(args.items) ? args.items : [];
        
        items.forEach((i: any) => {
            const menuItem = menuItems.find(m => m.name.toLowerCase().includes(String(i.itemName).toLowerCase()));
            if(menuItem) total += menuItem.price * (Number(i.quantity) || 1);
        });

        const newOrder: ActiveOrder = {
            id: '#' + Math.floor(1000 + Math.random() * 9000),
            customerName: args.customerName || 'Guest',
            customerEmail: args.customerEmail || 'N/A',
            items: items,
            totalPrice: total,
            status: 'Open',
            timePlaced: new Date(),
            estimatedTime: deliveryTime
        };

        setOrders(prev => [newOrder, ...prev]);
        setShowOrderPopup(newOrder);
        setActiveRightTab('orders');
        setKdsStage('Open');
        
        setTimeout(() => setShowOrderPopup(null), 5000);
        return true;
    } catch (err) {
        console.error("Error processing order:", err);
        return false;
    }
  };

  const handleOrderCancelled = () => {
      try {
          // Logic: Cancel the most recent "Open" order
          setOrders(prev => {
              const newOrders = [...prev];
              const latestOpenIndex = newOrders.findIndex(o => o.status === 'Open');
              if (latestOpenIndex > -1) {
                  newOrders[latestOpenIndex].status = 'Cancelled';
                  return newOrders;
              }
              return prev;
          });
          setActiveRightTab('orders'); // Switch view so user sees the change
          return true;
      } catch (err) {
          console.error("Error cancelling order:", err);
          return false;
      }
  };

  const updateOrderStatus = (id: string, newStatus: ActiveOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // --- MENU MANAGEMENT ---
  const handleUpdateItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddItem = () => {
    const newId = Math.random().toString(36).substr(2, 5);
    setMenuItems(prev => [{ id: newId, name: 'New Item', price: 10, category: 'Main' }, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // --- CART MANAGEMENT ---
  const toggleCartItem = (itemName: string) => {
    setCart(prev => {
        const current = prev[itemName] || 0;
        const next = current + 1;
        return { ...prev, [itemName]: next };
    });
  };

  const removeCartItem = (itemName: string) => {
    setCart(prev => {
        const current = prev[itemName] || 0;
        if (current <= 1) {
            const { [itemName]: _, ...rest } = prev;
            return rest;
        }
        return { ...prev, [itemName]: current - 1 };
    });
  };

  // --- VOICE LOGIC ---
  const stopVoice = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsConnected(false);
    setIsSpeaking(false);
    addLog({ source: 'SYSTEM', role: 'TOOL', content: 'Voice Session Ended', status: 'Draft' });
  }, []);

  const startVoice = async () => {
    setIsConnected(true);
    addLog({ source: 'SYSTEM', role: 'TOOL', content: 'Initializing Voice Agent...', status: 'Processing' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [orderFunction, cancelFunction] }],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } },
          systemInstruction: `You are a friendly, casual waiter at 'Bistro AI'.
          
          CURRENT MENU:
          ${JSON.stringify(menuItems)}

          CURRENT DELIVERY TIME: ${deliveryTime} minutes.
          
          Rules:
          1. Be casual and friendly (use "Hey there", "Got it", "No problem").
          2. Answer menu questions briefly.
          3. If asked about delivery time, quote ${deliveryTime} minutes.
          4. IMPORTANT: Before placing the order, you MUST ask for their email address for the receipt.
          5. Once you have items and email, use the 'placeOrder' tool immediately.
          6. If the user wants to cancel, use the 'cancelOrder' tool immediately.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            addLog({ source: 'VOICE', role: 'AI', content: 'Connected. Listening...', status: 'Processing' });
            if (!inputAudioContextRef.current || !micStreamRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(micStreamRef.current);
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const b64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: b64 } }));
            };
            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
             if (m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
                 setIsSpeaking(true);
                 const audioData = m.serverContent.modelTurn.parts[0].inlineData.data;
                 const bin = atob(audioData);
                 const bytes = new Uint8Array(bin.length);
                 for (let i=0; i<bin.length; i++) bytes[i] = bin.charCodeAt(i);
                 const int16 = new Int16Array(bytes.buffer);
                 const buffer = audioContextRef.current!.createBuffer(1, int16.length, 24000);
                 const channel = buffer.getChannelData(0);
                 for (let i=0; i<int16.length; i++) channel[i] = int16[i] / 32768;
                 
                 const source = audioContextRef.current!.createBufferSource();
                 source.buffer = buffer;
                 source.connect(audioContextRef.current!.destination);
                 const now = audioContextRef.current!.currentTime;
                 const start = Math.max(now, nextStartTimeRef.current);
                 source.start(start);
                 nextStartTimeRef.current = start + buffer.duration;
                 sourcesRef.current.add(source);
                 source.onended = () => {
                    sourcesRef.current.delete(source);
                    if(sourcesRef.current.size === 0) setIsSpeaking(false);
                 };
             }

             if (m.serverContent?.outputTranscription?.text) {
                 updateTranscriptLog(m.serverContent.outputTranscription.text, 'AI');
             }
             if (m.serverContent?.inputTranscription?.text) {
                 updateTranscriptLog(m.serverContent.inputTranscription.text, 'USER');
             }
             
             if (m.serverContent?.turnComplete) {
                setLogs(prev => {
                    const latest = prev[0];
                    if (latest && latest.status === 'Draft') {
                        return [{ ...latest, status: 'Confirmed' }, ...prev.slice(1)];
                    }
                    return prev;
                });
             }

             if (m.toolCall?.functionCalls) {
                for (const fc of m.toolCall.functionCalls) {
                    try {
                        const args = fc.args || {};
                        if (fc.name === 'placeOrder') {
                            addLog({ source: 'VOICE', role: 'TOOL', content: `ORDER RECEIVED: ${JSON.stringify(args)}`, status: 'Confirmed', intent: 'New Order' });
                            handleOrderPlaced(args);
                            sessionPromise.then(s => s.sendToolResponse({
                                functionResponses: [{
                                    id: fc.id,
                                    name: fc.name,
                                    response: { result: 'Order placed successfully' }
                                }]
                            }));
                        } else if (fc.name === 'cancelOrder') {
                            addLog({ source: 'VOICE', role: 'TOOL', content: 'Cancelling current order...', status: 'Cancelled' });
                            handleOrderCancelled();
                            sessionPromise.then(s => s.sendToolResponse({
                                functionResponses: [{
                                    id: fc.id,
                                    name: fc.name,
                                    response: { result: 'Order cancelled' }
                                }]
                            }));
                        }
                    } catch (toolError) {
                        console.error("Error executing tool or sending response:", toolError);
                        // Attempt to keep session alive by sending error response
                        try {
                            sessionPromise.then(s => s.sendToolResponse({
                                functionResponses: [{
                                    id: fc.id,
                                    name: fc.name,
                                    response: { error: 'Failed to process order' }
                                }]
                            }));
                        } catch (e) { console.error("Critical session failure", e); }
                    }
                }
             }
          },
          onclose: stopVoice,
          onerror: (e) => { console.error(e); stopVoice(); }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      stopVoice();
    }
  };

  // --- CHAT LOGIC ---
  const handleChatSend = async () => {
      let msg = chatInput.trim();
      
      const cartItems = Object.entries(cart);
      if (cartItems.length > 0) {
        const orderText = cartItems.map(([name, count]) => `${count}x ${name}`).join(', ');
        if (msg) {
             msg += `\nI would also like to order: ${orderText}`;
        } else {
             msg = `I'd like to order: ${orderText}`;
        }
        setCart({}); 
      }

      if (!msg) return;

      setChatInput('');
      setChatLoading(true);
      addLog({ source: 'CHAT', role: 'USER', content: msg, status: 'Draft' });

      try {
          if (!chatSessionRef.current) {
              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
              chatSessionRef.current = ai.chats.create({
                  model: 'gemini-3-flash-preview',
                  config: {
                      tools: [{ functionDeclarations: [orderFunction, cancelFunction] }],
                      systemInstruction: `You are a chatbot for 'Bistro AI'.
                      
                      CURRENT MENU:
                      ${JSON.stringify(menuItems)}

                      CURRENT DELIVERY TIME: ${deliveryTime} minutes.

                      Rules:
                      1. Be friendly and casual.
                      2. You MUST ask for an email address before placing an order.
                      3. Use placeOrder only when you have items and email.
                      4. If asked to cancel, use cancelOrder immediately.`
                  }
              });
          }

          const result = await chatSessionRef.current.sendMessage({ message: msg });
          const text = result.text;
          
          const calls = result.functionCalls;
          if (calls && calls.length > 0) {
             const fc = calls[0];
             const args = fc.args || {};
             
             if (fc.name === 'placeOrder') {
                 addLog({ source: 'CHAT', role: 'TOOL', content: `ORDER RECEIVED: ${JSON.stringify(args)}`, status: 'Confirmed', intent: 'New Order' });
                 handleOrderPlaced(args);
                 const email = (args as any).customerEmail || 'the customer';
                 addLog({ source: 'CHAT', role: 'AI', content: `You got it! Order confirmed. Sending receipt to ${email}.`, status: 'Processing' });
             } else if (fc.name === 'cancelOrder') {
                 addLog({ source: 'CHAT', role: 'TOOL', content: `ORDER CANCELLED`, status: 'Cancelled' });
                 handleOrderCancelled();
                 addLog({ source: 'CHAT', role: 'AI', content: `No problem, I've cancelled that order for you.`, status: 'Processing' });
             }
             
             // In a real app, send tool response back to history
          } else if (text) {
             addLog({ source: 'CHAT', role: 'AI', content: text, status: 'Processing' });
          }

      } catch (e) {
          console.error(e);
          addLog({ source: 'SYSTEM', role: 'TOOL', content: 'Error connecting to chat.', status: 'Draft' });
      } finally {
          setChatLoading(false);
      }
  };

  useEffect(() => {
    if (activeTab === 'chat' && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 font-plus-jakarta relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* HERO SECTION */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-100 rounded-full text-emerald-600 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
                <Utensils size={14} /> Restaurant AI Solution
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Never Miss a <span className="text-emerald-600">Takeout Order.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Watch our AI handle orders in real-time. Try the voice agent or the chatbot below and see the KDS update instantly.
            </p>
        </div>

        {/* DEMO INTERFACE */}
        <div className="grid lg:grid-cols-12 gap-8 lg:min-h-[700px] h-auto">
            
            {/* LEFT COL: CUSTOMER INTERFACE */}
            <div className="lg:col-span-5 flex flex-col min-h-[600px] lg:h-auto">
                <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative">
                    <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                            <span className="font-bold tracking-tight">Bistro AI</span>
                        </div>
                        <div className="flex bg-slate-800 p-1 rounded-xl">
                            <button 
                                onClick={() => { setActiveTab('voice'); stopVoice(); }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'voice' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Phone size={14} className="inline mr-2" /> Voice
                            </button>
                            <button 
                                onClick={() => { setActiveTab('chat'); stopVoice(); }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'chat' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <MessageSquare size={14} className="inline mr-2" /> Chat
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                        {activeTab === 'voice' ? (
                            <div className="text-center w-full my-auto">
                                <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center transition-all duration-500 mb-8 ${isConnected ? 'bg-emerald-50 scale-110 border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-white border-4 border-slate-100 shadow-xl'}`}>
                                    {isSpeaking ? (
                                        <div className="flex gap-1.5 items-center h-12">
                                            {[1,2,3,4,5].map(i => (
                                                <div key={i} className="w-2.5 bg-emerald-500 rounded-full animate-[bounce_1s_infinite]" style={{animationDelay: `${i*0.1}s`, height: `${30 + Math.random()*70}%`}}></div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Phone size={56} className={`transition-colors duration-300 ${isConnected ? 'text-emerald-600' : 'text-slate-300'}`} />
                                    )}
                                </div>
                                
                                <h3 className="text-2xl font-black mb-3 text-slate-900">{isConnected ? 'Agent Listening...' : 'Start Call'}</h3>
                                <p className="text-slate-500 text-sm mb-8 font-medium max-w-xs mx-auto">
                                    {isConnected 
                                        ? 'Try: "I want a pepperoni pizza and a cola. My email is demo@test.com"' 
                                        : 'Click below to simulate an incoming call to the bistro.'}
                                </p>

                                <button 
                                    onClick={isConnected ? stopVoice : startVoice}
                                    className={`px-10 py-4 rounded-2xl font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto ${isConnected ? 'bg-red-500 shadow-red-200' : 'bg-emerald-600 shadow-emerald-200'}`}
                                >
                                    {isConnected ? <X size={20} /> : <Phone size={20} />}
                                    {isConnected ? 'End Call' : 'Call Restaurant'}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col">
                                <div ref={scrollRef} className="flex-1 overflow-y-auto mb-2 space-y-4 pr-2 max-h-[400px]">
                                    {logs.filter(l => l.source === 'CHAT').length === 0 && (
                                        <div className="text-center text-slate-400 mt-20">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MessageSquare size={24} className="opacity-30" />
                                            </div>
                                            <p className="font-medium">Start chatting to place an order.</p>
                                        </div>
                                    )}
                                    {/* Reverse the logs for display so newer messages are at bottom */}
                                    {logs
                                        .filter(l => l.source === 'CHAT' && l.role !== 'TOOL')
                                        .slice()
                                        .reverse()
                                        .map(l => (
                                        <div key={l.id} className={`flex ${l.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                                                l.role === 'USER' 
                                                ? 'bg-emerald-600 text-white rounded-tr-none' 
                                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                            }`}>
                                                {formatMessage(l.content)}
                                            </div>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-slate-500 font-bold flex items-center gap-2">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                                Typing...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* QUICK MENU SELECTOR */}
                                <div className="mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-2">Quick Menu Select</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2 pl-1 pr-1 scrollbar-hide">
                                        {menuItems.map(item => {
                                            const count = cart[item.name] || 0;
                                            return (
                                                <button 
                                                    key={item.id}
                                                    onClick={() => toggleCartItem(item.name)}
                                                    className={`flex-shrink-0 px-3 py-2 rounded-xl border transition-all text-left min-w-[120px] ${
                                                        count > 0 
                                                        ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                                                        : 'bg-white border-slate-200 hover:border-emerald-300'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-xs font-bold ${count > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                                            {item.name}
                                                        </span>
                                                        {count > 0 && (
                                                            <span className="bg-emerald-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                                                {count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500">${item.price}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Items Chips */}
                                {Object.keys(cart).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2 px-2">
                                        {Object.entries(cart).map(([name, count]) => (
                                            <div key={name} className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                                                <span>{count}x {name}</span>
                                                <button onClick={() => removeCartItem(name)} className="hover:text-red-500"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 mt-auto">
                                    <input 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                                        placeholder={Object.keys(cart).length > 0 ? "Add any notes (optional)..." : "Type your order..."}
                                        className="flex-1 p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm text-slate-700 placeholder:font-normal"
                                    />
                                    <button onClick={handleChatSend} className="p-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2">
                                        <Send size={20}/>
                                        {Object.keys(cart).length > 0 && <span className="font-bold text-xs">Order</span>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CALL TO ACTION */}
                <div className="mt-6 bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-2xl">
                    <div>
                        <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">Restaurant Owners</p>
                        <p className="font-bold text-lg leading-tight">Want this for your venue?</p>
                    </div>
                    <button 
                        onClick={() => {
                            sendToN8n(ACTIONS.CTA_CLICK, { location: 'RestaurantDemo', label: 'Deploy This' });
                            window.location.hash = '#/contact';
                        }}
                        className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-emerald-400 transition-colors text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                        Deploy This <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* RIGHT COL: KITCHEN DISPLAY SYSTEM */}
            <div className="lg:col-span-7 flex flex-col min-h-[700px] lg:h-auto bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 relative">
                
                {/* KDS Header */}
                <div className="bg-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-emerald-400">
                            <ChefHat size={20} />
                        </div>
                        <div>
                            <span className="font-black text-white tracking-tight block text-lg">KDS View</span>
                            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Kitchen Display System</span>
                        </div>
                    </div>
                    
                    <div className="flex bg-slate-900 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveRightTab('transcript')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeRightTab === 'transcript' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Transcript
                        </button>
                        <button 
                            onClick={() => setActiveRightTab('orders')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeRightTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Orders ({orders.filter(o => o.status !== 'Cancelled').length})
                        </button>
                        <button 
                            onClick={() => setActiveRightTab('menu')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeRightTab === 'menu' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Dashboard Metrics (Summary) */}
                <div className="grid grid-cols-3 border-b border-slate-700 bg-slate-800/50">
                    <div className="p-4 border-r border-slate-700 text-center">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Total Orders</p>
                        <p className="text-2xl font-black text-white">{orders.filter(o => o.status !== 'Cancelled').length}</p>
                    </div>
                    <div className="p-4 border-r border-slate-700 text-center">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Revenue</p>
                        <p className="text-2xl font-black text-emerald-400">${orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalPrice, 0)}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Avg Wait</p>
                        <p className="text-2xl font-black text-white">{deliveryTime}<span className="text-sm text-slate-500 ml-1">min</span></p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative bg-slate-900">
                    {/* VIEW: TRANSCRIPT */}
                    {activeRightTab === 'transcript' && (
                        <div className="absolute inset-0 overflow-y-auto">
                             <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10 shadow-lg">
                                    <tr>
                                        <th className="p-4 font-bold w-24">Time</th>
                                        <th className="p-4 font-bold w-20">Role</th>
                                        <th className="p-4 font-bold">Content</th>
                                        <th className="p-4 font-bold text-right w-24">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300 font-mono text-xs divide-y divide-slate-800/50">
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-slate-600 italic">
                                                Waiting for incoming data stream...
                                            </td>
                                        </tr>
                                    )}
                                    {logs.map((log) => (
                                        <tr key={log.id} className={`hover:bg-slate-800/30 transition-colors ${log.role === 'TOOL' ? 'bg-emerald-900/10' : ''}`}>
                                            <td className="p-4 text-slate-500">{log.time}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                                    log.role === 'AI' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                                                    log.role === 'USER' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                                    'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                                }`}>
                                                    {log.role}
                                                </span>
                                            </td>
                                            <td className="p-4 leading-relaxed">
                                                {log.role === 'TOOL' ? (
                                                    <span className="font-mono text-emerald-300">{log.content}</span>
                                                ) : log.content}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`inline-flex items-center gap-1 ${
                                                    log.status === 'Confirmed' ? 'text-emerald-400' : 
                                                    log.status === 'Cancelled' ? 'text-red-400' : 'text-slate-500'
                                                }`}>
                                                    {log.status === 'Confirmed' && <CheckCircle2 size={12} />}
                                                    {log.status === 'Cancelled' && <X size={12} />}
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* VIEW: ORDERS */}
                    {activeRightTab === 'orders' && (
                        <div className="absolute inset-0 flex flex-col">
                            {/* KDS Pipeline Tabs */}
                            <div className="flex border-b border-slate-700">
                                {[
                                    { id: 'Open', label: 'Open', icon: <ShoppingBag size={14} /> },
                                    { id: 'Ready', label: 'Ready for Shipment', icon: <PackageCheck size={14} /> },
                                    { id: 'Delivered', label: 'Delivered', icon: <Truck size={14} /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setKdsStage(tab.id as any)}
                                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${
                                            kdsStage === tab.id 
                                            ? 'bg-emerald-600/10 text-emerald-400 border-b-2 border-emerald-500' 
                                            : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                    >
                                        {tab.icon} {tab.label}
                                        <span className="ml-1 px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">
                                            {orders.filter(o => o.status === tab.id).length}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {orders.filter(o => o.status === kdsStage).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                                        <Archive size={48} className="mb-4" />
                                        <p className="font-bold">No orders in {kdsStage}</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {orders.filter(o => o.status === kdsStage).map((order) => (
                                            <div key={order.id} className="bg-slate-800 rounded-2xl p-5 border-l-4 border-emerald-500 animate-in slide-in-from-right duration-300 relative group">
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                                    className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Cancel Order"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="flex justify-between items-start mb-4 pr-8">
                                                    <div>
                                                        <h4 className="text-xl font-black text-white flex items-center gap-2">
                                                            {order.id} 
                                                            <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                                                                {order.customerName}
                                                            </span>
                                                        </h4>
                                                        <p className="text-xs text-slate-400 mt-1">{order.customerEmail}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-900/30 px-3 py-1 rounded-full text-xs">
                                                            <Timer size={12} /> {order.estimatedTime}m
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                                                            <span className="text-slate-200">
                                                                <span className="font-bold text-emerald-400 mr-2">{item.quantity}x</span> 
                                                                {item.itemName}
                                                            </span>
                                                            {item.notes && <span className="text-xs text-yellow-500 italic">({item.notes})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                                                    <span className="text-2xl font-black text-white">${order.totalPrice}</span>
                                                    
                                                    {order.status === 'Open' && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2"
                                                        >
                                                            Mark Ready <PackageCheck size={14} />
                                                        </button>
                                                    )}
                                                    
                                                    {order.status === 'Ready' && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
                                                        >
                                                            Ship Order <Truck size={14} />
                                                        </button>
                                                    )}
                                                    
                                                    {order.status === 'Delivered' && (
                                                        <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                                            <CheckCircle2 size={14} /> Completed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: MENU MANAGER */}
                    {activeRightTab === 'menu' && (
                        <div className="absolute inset-0 overflow-y-auto p-6">
                            <div className="mb-8">
                                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Current Delivery Time (Minutes)</label>
                                <div className="flex gap-4 items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <Clock className="text-emerald-400" />
                                    <input 
                                        type="number" 
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(Number(e.target.value))}
                                        className="bg-transparent text-white font-black text-2xl w-20 outline-none border-b border-emerald-500/50 focus:border-emerald-500"
                                    />
                                    <span className="text-slate-500 font-bold">Minutes</span>
                                    <p className="ml-auto text-xs text-slate-400 italic">AI will quote this time to customers.</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white font-bold flex items-center gap-2"><Settings size={16} className="text-emerald-500"/> Menu Items</h3>
                                <button 
                                    onClick={handleAddItem}
                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 flex items-center gap-2"
                                >
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {menuItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold">
                                            {item.category.substring(0,2).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                value={item.name}
                                                onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                                className="bg-transparent text-white font-bold text-sm w-full outline-none mb-1 focus:text-emerald-400"
                                            />
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                $ <input 
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                                                    className="bg-transparent text-slate-400 font-medium w-16 outline-none focus:text-white"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Pop-up Notification for New Order */}
                {showOrderPopup && (
                    <div className="absolute bottom-6 left-6 right-6 bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in z-50 flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-lg">Order Confirmed!</h4>
                            <p className="text-emerald-100 text-sm">New ticket {showOrderPopup.id} sent to KDS.</p>
                        </div>
                        <button onClick={() => setShowOrderPopup(null)} className="ml-auto p-2 hover:bg-white/10 rounded-full"><X size={18} /></button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAgent;
