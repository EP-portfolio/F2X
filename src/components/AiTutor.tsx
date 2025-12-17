import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface AiTutorProps {
  language: Language;
}

export const AiTutor: React.FC<AiTutorProps> = ({ language }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'model', text: language === 'fr' ? "Bonjour ! Je suis ton tuteur de maths. Dis-moi tout !" : "Hello! I am your math tutor. Ask me anything!" }]);
  }, [language]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content = line; let isListItem = false;
      if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) { isListItem = true; content = content.trim().substring(2); }
      const parts = content.split(/\*\*(.*?)\*\*/g);
      const formattedContent = parts.map((part, j) => { if (j % 2 === 1) return <strong key={j} className="font-bold">{part}</strong>; return part; });
      if (isListItem) { return ( <div key={i} className="flex gap-2 mt-2 ml-1"> <span className="text-current opacity-60">•</span> <p className="flex-1">{formattedContent}</p> </div> ); }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className={`${i > 0 ? 'mt-1' : ''} min-h-[1.2em]`}>{formattedContent}</p>;
    });
  };

  const normalizeApiBase = (base: string) => {
    if (!base) return '';
    return base.endsWith('/api') || base.endsWith('/api/') ? base.replace(/\/$/, '') : `${base.replace(/\/$/, '')}/api`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    try {
      const defaultBackend = 'https://f2x-o81l.onrender.com/api';
      const apiBaseUrl =
        (window as any).API_BASE_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        defaultBackend ||
        `${window.location.origin}/api` ||
        'http://localhost:3000/api';
      const apiBase = normalizeApiBase(apiBaseUrl) || defaultBackend;
      const historyPayload = messages.map(m => ({ role: m.role, text: m.text }));
      const resp = await fetch(`${apiBase}/tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload,
          language
        })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const reply = data.reply || (language === 'fr' ? "Erreur de réponse." : "Response error.");
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error: any) {
      console.error('AI Tutor error', error);
      const errMsg = language === 'fr'
        ? `Erreur (tuteur) : ${error?.message || 'requête échouée'}`
        : `Tutor error: ${error?.message || 'request failed'}`;
      setMessages(prev => [...prev, { role: 'model', text: errMsg, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 p-6 flex items-center gap-4 text-white shadow-sm">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{language === 'fr' ? 'Ton Tuteur Perso' : 'Your AI Tutor'}</h3>
            <p className="text-fuchsia-100 text-sm font-medium">{language === 'fr' ? 'Disponible 24h/24' : 'Available 24/7'}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && ( <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 flex items-center justify-center flex-shrink-0 text-fuchsia-600 shadow-sm border border-fuchsia-200"> <Bot size={20} /> </div> )}
              
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${ msg.role === 'user' ? 'bg-fuchsia-600 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100' }`}>
                {formatMessageText(msg.text)}
              </div>

              {msg.role === 'user' && ( <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 shadow-sm"> <User size={20} /> </div> )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start gap-3">
               <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600"> <Bot size={20} /> </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm w-24 flex items-center justify-center gap-1.5 border border-gray-100">
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-2 bg-gray-100 rounded-full p-2 border border-gray-200 focus-within:border-fuchsia-300 focus-within:ring-4 focus-within:ring-fuchsia-50 transition-all">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={language === 'fr' ? "Pose ta question..." : "Ask your question..."}
              className="w-full bg-transparent text-gray-800 py-2 px-4 focus:outline-none placeholder-gray-400 font-medium"
            />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};