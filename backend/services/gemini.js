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

/**
 * Generate new exercise inspired by Brevet examples
 */
export async function generateBrevetExercise(rawData, mean, median, language = 'fr') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Import the prompt generator (we'll need to adapt it for backend)
    const prompt = generateBrevetExercisePrompt(rawData, mean, median, language);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Brevet exercise generation error:', error);
    throw new Error(`Exercise generation error: ${error.message}`);
  }
}

/**
 * Generate answer logic for Brevet exercise
 */
export async function generateBrevetAnswer(exerciseProblem, rawData, mean, median, language = 'fr') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const answerPrompt = language === 'fr'
      ? `Basé sur cet exercice de statistiques : "${exerciseProblem}"
      
      Série de données : ${rawData.join(', ')}
      Moyenne = ${mean}, Médiane = ${median}
      
      Donne une réponse correcte et complète à cet exercice. Si l'exercice demande des calculs, fournis-les. Si l'exercice demande une interprétation, explique-la clairement.`
      : `Based on this statistics exercise: "${exerciseProblem}"
      
      Data series: ${rawData.join(', ')}
      Mean = ${mean}, Median = ${median}
      
      Give a correct and complete answer to this exercise. If the exercise asks for calculations, provide them. If the exercise asks for an interpretation, explain it clearly.`;
    
    const result = await model.generateContent(answerPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Brevet answer generation error:', error);
    throw new Error(`Answer generation error: ${error.message}`);
  }
}

function generateBrevetExercisePrompt(rawData, mean, median, language) {
  // Simplified version - in production, import from prompts.ts or duplicate the logic
  const examplesContext = `EXEMPLES D'INSPIRATION (observe leur style, leur structure et leurs types de questions) :
- Exercices variés du Brevet des Collèges (notes, tailles, temps, etc.)
- Questions sur moyenne, médiane, étendue, pourcentages, fréquences
- Contextes réalistes adaptés au niveau 3ème`;

  if (language === 'fr') {
    return `Tu es un créateur d'exercices de statistiques pour le Brevet des Collèges (niveau 3ème).

TON OBJECTIF : Créer un NOUVEL exercice inspiré des exemples du Brevet, MAIS SANS LES RÉPÉTER.

${examplesContext}

DONNÉES STATISTIQUES DISPONIBLES (tu peux les utiliser ou créer tes propres données) :
Série de données : ${rawData.join(', ')}
→ Moyenne = ${mean}, Médiane = ${median}

INSTRUCTIONS :
1. CRÉE UN NOUVEL EXERCICE : Ne répète AUCUN des exemples. Inspire-toi de leur style, mais invente un contexte et des questions différents.
2. OBSERVE LES EXEMPLES : Ils sont variés (calculs d'indicateurs, interprétations, pourcentages, impact d'une nouvelle donnée, etc.)
3. LIBERTÉ CRÉATIVE : Tu peux utiliser les données fournies ou créer tes propres données adaptées à ton contexte
4. STYLE BREVET : Contexte réaliste, présentation claire des données, questions adaptées au niveau 3ème

FORMAT DE RÉPONSE :
Retourne UNIQUEMENT l'énoncé complet de l'exercice, sans titre ni numérotation. L'énoncé doit inclure :
- Le contexte de l'exercice
- La présentation des données (sous forme de liste, tableau, ou description)
- Une ou plusieurs questions adaptées au contexte

GÉNÈRE MAINTENANT LE NOUVEL EXERCICE :`;
  } else {
    return `You are a statistics exercise creator for 9th Grade students.

YOUR OBJECTIVE: Create a NEW exercise inspired by Brevet examples, BUT WITHOUT REPEATING THEM.

${examplesContext}

AVAILABLE STATISTICAL DATA (you can use them or create your own data):
Data series: ${rawData.join(', ')}
→ Mean = ${mean}, Median = ${median}

INSTRUCTIONS:
1. CREATE A NEW EXERCISE: Do NOT repeat ANY examples. Be inspired by their style, but invent a different context and questions.
2. OBSERVE THE EXAMPLES: They are varied (indicator calculations, interpretations, percentages, impact of new data, etc.)
3. CREATIVE FREEDOM: You can use the provided data or create your own data adapted to your context
4. EXAM STYLE: Realistic context, clear data presentation, questions appropriate for 9th grade

RESPONSE FORMAT:
Return ONLY the complete exercise statement, without title or numbering. The statement must include:
- The exercise context
- Data presentation (as a list, table, or description)
- One or more questions adapted to the context

GENERATE THE NEW EXERCISE NOW:`;
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

