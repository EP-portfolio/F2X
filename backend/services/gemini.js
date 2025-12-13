import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Get AI tutor response
 */
export async function getTutorResponse(message, history = [], language = 'fr') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemInstruction = language === 'fr'
      ? `Tu es un professeur de mathématiques bienveillant pour des élèves de 3ème. Explique simplement et de manière encourageante.`
      : `You are a friendly Math teacher for Grade 9 students. Explain simply and encouragingly.`;

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      systemInstruction: systemInstruction,
      history: chatHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`AI Tutor error: ${error.message}`);
  }
}

/**
 * Analyze student work from image (Computer Vision)
 */
export async function analyzeStudentWork(imageBase64, exerciseData, language = 'fr') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const analysisPrompt = generateAnalysisPrompt(exerciseData, language);

    const result = await model.generateContent([
      { text: analysisPrompt },
      { 
        inlineData: { 
          mimeType: 'image/jpeg', 
          data: imageBase64 
        } 
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Vision API error:', error);
    throw new Error(`Image analysis error: ${error.message}`);
  }
}

/**
 * Generate personalized recommendations
 */
export async function generateRecommendations(assessmentData, performanceHistory, language = 'fr') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = generateRecommendationsPrompt(assessmentData, performanceHistory, language);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse recommendations from text
    return parseRecommendations(text, language);
  } catch (error) {
    console.error('Recommendations generation error:', error);
    throw new Error(`Recommendations error: ${error.message}`);
  }
}

function generateAnalysisPrompt(exerciseData, language) {
  const { title, problem, type, rawData } = exerciseData;
  
  if (language === 'fr') {
    return `
Tu es un professeur de mathématiques qui corrige le travail d'un élève de 3ème.

Exercice : ${title}
Type : ${type}
Énoncé : ${problem}
Données : ${JSON.stringify(rawData)}

Analyse la photo du travail de l'élève et fournis :
1. Une évaluation de la réponse (correcte, partielle, incorrecte)
2. Les points positifs
3. Les erreurs éventuelles
4. Des conseils pour améliorer

Sois bienveillant et pédagogique. Format ta réponse en paragraphes clairs.
`;
  } else {
    return `
You are a math teacher correcting a Grade 9 student's work.

Exercise: ${title}
Type: ${type}
Problem: ${problem}
Data: ${JSON.stringify(rawData)}

Analyze the photo of the student's work and provide:
1. An assessment of the answer (correct, partial, incorrect)
2. Positive points
3. Any errors
4. Tips for improvement

Be encouraging and pedagogical. Format your response in clear paragraphs.
`;
  }
}

function generateRecommendationsPrompt(assessmentData, performanceHistory, language) {
  const { overallScore, strengths, weaknesses, exercises } = assessmentData;
  const { averageScore, masteredChapters, totalTimeSpent } = performanceHistory;
  
  if (language === 'fr') {
    return `
Analyse cette session d'évaluation et l'historique de performance d'un élève de 3ème.

SESSION ACTUELLE :
- Score global : ${overallScore}%
- Points forts : ${strengths.join(', ')}
- Points faibles : ${weaknesses.join(', ')}
- Exercices complétés : ${exercises.length}

HISTORIQUE :
- Score moyen : ${averageScore}%
- Temps total d'entraînement : ${Math.round(totalTimeSpent / 60)} minutes
- Chapitres maîtrisés : ${masteredChapters.join(', ') || 'Aucun pour le moment'}

Génère 3-5 recommandations personnalisées d'entraînement au format JSON :
{
  "recommendations": [
    {
      "type": "practice" | "review" | "methodology",
      "title": "Titre de la recommandation",
      "description": "Description détaillée",
      "priority": "high" | "medium" | "low",
      "estimatedTime": "temps en minutes",
      "chapter": "nom du chapitre concerné"
    }
  ]
}

Sois précis et actionnable. Focus sur les points faibles identifiés.
`;
  } else {
    return `
Analyze this assessment session and performance history of a Grade 9 student.

CURRENT SESSION:
- Overall score: ${overallScore}%
- Strengths: ${strengths.join(', ')}
- Weaknesses: ${weaknesses.join(', ')}
- Exercises completed: ${exercises.length}

HISTORY:
- Average score: ${averageScore}%
- Total practice time: ${Math.round(totalTimeSpent / 60)} minutes
- Mastered chapters: ${masteredChapters.join(', ') || 'None yet'}

Generate 3-5 personalized training recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "practice" | "review" | "methodology",
      "title": "Recommendation title",
      "description": "Detailed description",
      "priority": "high" | "medium" | "low",
      "estimatedTime": "time in minutes",
      "chapter": "chapter name"
    }
  ]
}

Be precise and actionable. Focus on identified weaknesses.
`;
  }
}

function parseRecommendations(text, language) {
  try {
    // Try to extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: create structure from text
    const lines = text.split('\n').filter(line => line.trim());
    const recommendations = [];
    
    for (let i = 0; i < lines.length && recommendations.length < 5; i++) {
      const line = lines[i].trim();
      if (line.match(/^\d+[\.\)]/) || line.startsWith('-') || line.startsWith('*')) {
        recommendations.push({
          type: 'practice',
          title: line.replace(/^\d+[\.\)]\s*[-*]\s*/, '').split(':')[0],
          description: line.split(':').slice(1).join(':').trim() || line,
          priority: i < 2 ? 'high' : 'medium',
          estimatedTime: '15',
          chapter: 'Statistics'
        });
      }
    }
    
    return { recommendations: recommendations.length > 0 ? recommendations : [
      {
        type: 'practice',
        title: language === 'fr' ? 'Continuer la pratique' : 'Continue practicing',
        description: language === 'fr' 
          ? 'Pratique régulièrement les exercices pour améliorer tes compétences.'
          : 'Practice regularly to improve your skills.',
        priority: 'medium',
        estimatedTime: '20',
        chapter: 'Statistics'
      }
    ]};
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    return {
      recommendations: [{
        type: 'practice',
        title: language === 'fr' ? 'Continuer la pratique' : 'Continue practicing',
        description: language === 'fr' 
          ? 'Pratique régulièrement les exercices.'
          : 'Practice regularly.',
        priority: 'medium',
        estimatedTime: '20',
        chapter: 'Statistics'
      }]
    };
  }
}

