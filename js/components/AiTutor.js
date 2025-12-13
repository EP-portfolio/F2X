let tutorState = {
  messages: [],
  input: '',
  isLoading: false
};

export function renderAiTutor(language) {
  if (tutorState.messages.length === 0) {
    tutorState.messages = [{
      role: 'model',
      text: language === 'fr' ? "Bonjour ! Je suis ton tuteur de maths. Dis-moi tout !" : "Hello! I am your math tutor. Ask me anything!"
    }];
  }

  const t = language === 'fr' ? {
    title: 'Ton Tuteur Perso',
    subtitle: 'Disponible 24h/24',
    placeholder: 'Pose ta question...',
    send: 'Envoyer'
  } : {
    title: 'Your AI Tutor',
    subtitle: 'Available 24/7',
    placeholder: 'Ask your question...',
    send: 'Send'
  };

  return `
    <div class="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4 animate-fade-in">
      <div class="bg-white rounded-[2rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-white">
        <div class="bg-gradient-to-r from-fuchsia-500 to-purple-600 p-6 flex items-center gap-4 text-white shadow-sm">
          <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <i data-lucide="sparkles" style="width: 24px; height: 24px;"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg">${t.title}</h3>
            <p class="text-fuchsia-100 text-sm font-medium">${t.subtitle}</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50" id="tutor-messages">
          ${tutorState.messages.map((msg, idx) => `
            <div class="flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
              ${msg.role === 'model' ? `
                <div class="w-10 h-10 rounded-2xl bg-fuchsia-100 flex items-center justify-center flex-shrink-0 text-fuchsia-600 shadow-sm border border-fuchsia-200">
                  <i data-lucide="bot" style="width: 20px; height: 20px;"></i>
                </div>
              ` : ''}
              
              <div class="max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-fuchsia-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
              }">
                ${formatMessageText(msg.text)}
              </div>

              ${msg.role === 'user' ? `
                <div class="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 shadow-sm">
                  <i data-lucide="user" style="width: 20px; height: 20px;"></i>
                </div>
              ` : ''}
            </div>
          `).join('')}
          
          ${tutorState.isLoading ? `
            <div class="flex justify-start gap-3">
              <div class="w-10 h-10 rounded-2xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600">
                <i data-lucide="bot" style="width: 20px; height: 20px;"></i>
              </div>
              <div class="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm w-24 flex items-center justify-center gap-1.5 border border-gray-100">
                <div class="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
                <div class="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
                <div class="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="p-4 bg-white border-t border-gray-100">
          <div class="relative flex items-center gap-2 bg-gray-100 rounded-full p-2 border border-gray-200 focus-within:border-fuchsia-300 focus-within:ring-4 focus-within:ring-fuchsia-50 transition-all">
            <input
              type="text"
              id="tutor-input"
              value="${tutorState.input}"
              onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); window.handleTutorSend(); }"
              oninput="window.updateTutorInput(this.value)"
              placeholder="${t.placeholder}"
              class="w-full bg-transparent text-gray-800 py-2 px-4 focus:outline-none placeholder-gray-400 font-medium"
              ${tutorState.isLoading ? 'disabled' : ''}
            />
            <button 
              onclick="window.handleTutorSend()"
              disabled="${tutorState.isLoading || !tutorState.input.trim()}"
              class="p-3 bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              <i data-lucide="send" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatMessageText(text) {
  return text.split('\n').map(line => {
    let content = line;
    let isListItem = false;
    if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) {
      isListItem = true;
      content = content.trim().substring(2);
    }
    
    // Handle bold text **text**
    const parts = content.split(/\*\*(.*?)\*\*/g);
    const formattedContent = parts.map((part, j) => {
      if (j % 2 === 1) return `<strong class="font-bold">${part}</strong>`;
      return part;
    }).join('');
    
    if (isListItem) {
      return `<div class="flex gap-2 mt-2 ml-1"><span class="text-current opacity-60">•</span><p class="flex-1">${formattedContent}</p></div>`;
    }
    if (line.trim() === '') return '<div class="h-2"></div>';
    return `<p class="${line !== text.split('\n')[0] ? 'mt-1' : ''} min-h-[1.2em]">${formattedContent}</p>`;
  }).join('');
}

window.updateTutorInput = (value) => {
  tutorState.input = value;
};

window.handleTutorSend = async () => {
  if (!tutorState.input.trim() || tutorState.isLoading) return;
  
  const userMessage = tutorState.input;
  tutorState.input = '';
  tutorState.messages.push({ role: 'user', text: userMessage });
  tutorState.isLoading = true;
  
  if (window.render) window.render();
  scrollToBottom();
  
  try {
    const apiKey = window.API_KEY;
    if (!apiKey) {
      throw new Error("API Key missing. Please set window.API_KEY in the console or config.js");
    }
    
    // Use Google Generative AI
    if (typeof google !== 'undefined' && google.generativeai) {
      const genAI = new google.generativeai.GenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const systemInstruction = language === 'fr' 
        ? `Tu es un professeur de mathématiques bienveillant pour des élèves de 3ème. Explique simplement.`
        : `You are a friendly Math teacher for Grade 9 students. Explain simply.`;
      
      const history = tutorState.messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const chat = model.startChat({
        systemInstruction: systemInstruction,
        history: history
      });
      
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      
      tutorState.messages.push({ role: 'model', text: text || "Error." });
    } else {
      throw new Error("Google Generative AI library not loaded");
    }
  } catch (error) {
    console.error('Tutor error:', error);
    tutorState.messages.push({ 
      role: 'model', 
      text: language === 'fr' 
        ? "Erreur : " + error.message + ". Vérifiez que window.API_KEY est défini et que la bibliothèque Google Generative AI est chargée."
        : "Error: " + error.message + ". Please check that window.API_KEY is set and Google Generative AI library is loaded.",
      isError: true 
    });
  } finally {
    tutorState.isLoading = false;
    if (window.render) window.render();
    scrollToBottom();
  }
};

function scrollToBottom() {
  setTimeout(() => {
    const messagesContainer = document.getElementById('tutor-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, 100);
}

// Initialize messages on language change
export function initTutor(language) {
  tutorState.messages = [{
    role: 'model',
    text: language === 'fr' ? "Bonjour ! Je suis ton tuteur de maths. Dis-moi tout !" : "Hello! I am your math tutor. Ask me anything!"
  }];
  tutorState.input = '';
  tutorState.isLoading = false;
}

