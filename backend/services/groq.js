import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Modèles Groq récents (voir https://console.groq.com/docs/deprecations)
// Exemples : 'llama-3.1-8b-instant', 'llama-3.1-70b-versatile'
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
    console.warn('[GROQ] GROQ_API_KEY not set. Groq provider will fail until it is configured.');
}

/**
 * Build OpenAI-compatible messages array from history + current user message.
 * Gemini history roles: user/model → map to user/assistant.
 */
function buildMessages(systemText, history = [], userMessage) {
    const messages = [];
    messages.push({ role: 'system', content: systemText });
    for (const msg of history) {
        if (!msg?.text) continue;
        const role = msg.role === 'user' ? 'user' : 'assistant';
        messages.push({ role, content: msg.text });
    }
    messages.push({ role: 'user', content: userMessage });
    return messages;
}

export async function getTutorResponseGroq(message, history = [], language = 'fr') {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    const systemText = language === 'fr'
        ? 'Tu es un professeur de mathématiques bienveillant pour des élèves de 3ème. Explique simplement et de manière encourageante.'
        : 'You are a friendly Math teacher for Grade 9 students. Explain simply and encouragingly.';

    const messages = buildMessages(systemText, history, message);

    const body = {
        model: GROQ_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 512
    };

    const resp = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(body)
    });

    if (!resp.ok) {
        let detail = '';
        try {
            const errJson = await resp.json();
            detail = JSON.stringify(errJson);
        } catch (e) {
            detail = await resp.text();
        }
        throw new Error(`Groq API error ${resp.status}: ${detail}`);
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    return reply || (language === 'fr' ? "Désolé, je n'ai pas pu générer de réponse." : "Sorry, I could not generate a response.");
}

