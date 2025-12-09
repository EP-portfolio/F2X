import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export const AiTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Bonjour ! Je suis ton tuteur de maths. Je suis là pour t'aider avec les statistiques. Tu ne comprends pas la médiane ? Tu veux un exemple ? Dis-moi tout !" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // POINT 2: Helper function to format text with Markdown-like syntax
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content = line;
      let isListItem = false;

      // Detect list items starting with "* " or "- "
      if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) {
          isListItem = true;
          // Remove the marker
          content = content.trim().substring(2);
      }

      // Parse bold text: **text**
      // The split regex captures the text inside the asterisks in odd indices
      const parts = content.split(/\*\*(.*?)\*\*/g);
      
      const formattedContent = parts.map((part, j) => {
        // Odd indices are the captured bold text
        if (j % 2 === 1) {
          return <strong key={j} className="font-bold">{part}</strong>;
        }
        // Return normal text
        return part;
      });

      if (isListItem) {
          return (
              <div key={i} className="flex gap-2 mt-2 ml-1">
                  <span className="text-current opacity-60">•</span>
                  <p className="flex-1">{formattedContent}</p>
              </div>
          );
      }

      // Handle empty lines for spacing
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className={`${i > 0 ? 'mt-1' : ''} min-h-[1.2em]`}>
          {formattedContent}
        </p>
      );
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("Clé API manquante");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // POINT 3: System instructions asking for Markdown (**bold**)
      const systemInstruction = `
        Tu es un professeur de mathématiques bienveillant pour des élèves de 3ème en France (collège).
        Tu dois expliquer les concepts du chapitre 'Statistiques' : moyenne, médiane, étendue, effectifs, fréquences.
        Tes explications doivent être simples, claires et imagées.
        Si l'élève pose une question, réponds pédagogiquement sans donner la réponse directe s'il s'agit d'un exercice, mais guide-le.
        Utilise le vouvoiement ou le tutoiement selon ce qui semble naturel mais reste respectueux et encourageant.
        Utilise le gras (**texte**) pour mettre en valeur les mots importants.
        Sois concis.
      `;

      // We maintain a simple history context for the chat session
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
         model: "gemini-2.5-flash",
         config: { systemInstruction },
         history: history
      });

      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text;

      setMessages(prev => [...prev, { role: 'model', text: text || "Désolé, je n'ai pas compris." }]);

    } catch (error) {
      console.error("Erreur Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Oups, j'ai eu un petit problème de connexion. Réessaie !", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4">
      <div className="bg-white rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3 text-white">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold">Professeur IA</h3>
            <p className="text-xs text-indigo-100">Expert en statistiques niveau 3ème</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-indigo-600" />
                </div>
              )}
              
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : msg.isError 
                      ? 'bg-red-100 text-red-800 rounded-bl-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                }`}
              >
                {/* POINT 2: Render with Markdown formatter */}
                {formatMessageText(msg.text)}
              </div>

              {msg.role === 'user' && (
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot size={16} className="text-indigo-600" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm w-24 flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pose ta question sur les stats..."
              className="w-full bg-gray-100 text-gray-800 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-transparent border transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-xs text-gray-400">L'IA peut faire des erreurs. Vérifie toujours tes calculs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};