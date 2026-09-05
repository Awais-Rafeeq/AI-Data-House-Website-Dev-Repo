import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, X, Volume2, Loader2, Phone } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { sendToN8n, ACTIONS } from '../lib/n8n';

const VoiceWidget: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): any => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    // We return a simple object matching the expected interface
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    }; 
  };

  const stopConversation = useCallback(async () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
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
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    
    // Log the end of session with metadata
    if (isActive) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await sendToN8n(ACTIONS.VOICE_SESSION, {
        call_duration: duration,
        user_intent: transcript.substring(0, 100),
        did_book_call: transcript.toLowerCase().includes('book') || transcript.toLowerCase().includes('calendar')
      });
    }

    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setTranscript('');
  }, [isActive, transcript]);

  const startConversation = async () => {
    setIsConnecting(true);
    startTimeRef.current = Date.now();
    try {
      // Cast API Key to string to satisfy TypeScript
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are a professional voice AI assistant for AI Data House. Your name is Zara. You help US and UK business owners understand how AI automation (voice agents, chatbots, n8n) can transform their business. Be energetic, professional, and invite them to book a discovery call. Keep your answers brief for a natural conversation.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Safe checks for transcription text to satisfy TypeScript strict mode
            if (message.serverContent?.outputTranscription?.text) {
              setTranscript(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.inputTranscription?.text) {
              setTranscript(prev => prev + ' ' + message.serverContent?.inputTranscription?.text);
            }
            
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setIsSpeaking(true);
              const buffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              
              // Ensure we schedule seamlessly
              const currentTime = audioContextRef.current.currentTime;
              if (nextStartTimeRef.current < currentTime) {
                  nextStartTimeRef.current = currentTime;
              }

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Voice error:', e);
            stopConversation();
          },
          onclose: () => stopConversation()
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start voice session:', err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-24 md:right-32 z-[60]">
      {isActive ? (
        <div className="bg-slate-900 w-72 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-white animate-in zoom-in-95 duration-200">
          <div className="flex justify-between w-full mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Voice Agent</span>
            <button onClick={stopConversation} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'bg-emerald-500 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`}>
              <Phone className={`w-10 h-10 ${isSpeaking ? 'animate-pulse' : 'text-slate-600'}`} />
            </div>
            {isSpeaking && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-emerald-500/30 rounded-full animate-ping"></div>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="font-bold text-lg mb-1">{isSpeaking ? 'Zara is speaking...' : 'Listening to you...'}</p>
            <p className="text-xs text-slate-400 max-h-12 overflow-hidden text-ellipsis px-2 italic">
              "Ask about our AI services"
            </p>
          </div>

          <button 
            onClick={stopConversation}
            className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
          >
            End Call
          </button>
        </div>
      ) : (
        <button 
          onClick={startConversation}
          disabled={isConnecting}
          className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform group relative disabled:opacity-50"
        >
          {isConnecting ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> : <Mic className="w-6 h-6" />}
          <div className="absolute right-full mr-4 bg-slate-900 px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Talk to Zara (Voice AI)
          </div>
        </button>
      )}
    </div>
  );
};

export default VoiceWidget;