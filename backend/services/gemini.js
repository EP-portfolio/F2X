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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
  // Exemples variés du Brevet pour inspiration (basés sur les vrais exercices)
  const examples = [
    {
      context: "Un professeur de SVT demande aux 25 élèves d'une classe de 3ème de faire germer des graines de blé chez eux. Le tableau donne les tailles des plantules à 10 jours : 8cm(2), 9cm(3), 10cm(5), 11cm(6), 12cm(4), 13cm(3), 14cm(2)",
      questions: ["Combien de plantules ont une taille qui mesure au plus 11 cm ?", "Calculer l'étendue de cette série.", "Calculer la moyenne. Arrondir au dixième.", "Déterminer la médiane. Justifier. Interpréter le résultat.", "Quel pourcentage des élèves a bien respecté le protocole ?"]
    },
    {
      context: "Afin de surveiller la bonne santé des tortues vertes à Madagascar, elles sont régulièrement pesées. Voici les données relevées par un scientifique en mai 2021. Tableau : 7 tortues marquées avec leur masse en kg (113, 96, 125, 87, 117, 104, 101)",
      questions: ["Calculer l'étendue de cette série statistique.", "Calculer la masse moyenne. Arrondir à l'unité.", "Déterminer la médiane. Interpréter le résultat.", "Est-il vrai que les mâles représentent moins de 20% de cet échantillon ?"]
    },
    {
      context: "En météorologie, l'insolation est le nombre d'heures d'ensoleillement. Données d'insolation pour le mois de juillet sur plusieurs années à une station météo : 324, 325, 257, 234, 285, 261, 213, 226, 308, 259, 206 heures",
      questions: ["Calculer la moyenne d'insolation sur cette période. Arrondir à l'heure près.", "Peut-on dire que la valeur 259 est la médiane de cette série ? Justifier."]
    },
    {
      context: "A la sortie d'une agglomération, on a relevé la répartition par tranches horaires des 6400 véhicules quittant la ville entre 16 heures et 22 heures. 16h-17h(1100), 17h-18h(2000), 18h-19h(1600), 19h-20h(900), 20h-21h(450), 21h-22h(350)",
      questions: ["Représenter l'histogramme des effectifs.", "Calculer la fréquence de la tranche horaire 19h-20h. Arrondir à 0,01 près, puis donner le pourcentage.", "Calculer le pourcentage de véhicules quittant la ville entre 16h et 20h."]
    },
    {
      context: "Le tableau ci-dessous donne la répartition des notes obtenues à un contrôle de mathématiques par les 27 élèves d'une classe de troisième. Notes : 6(3), 8(5), 10(6), 13(7), 14(5), 17(1)",
      questions: ["Calculer la note moyenne de la classe. Arrondir à l'unité.", "Calculer le pourcentage d'élèves ayant eu une note supérieure ou égale à 10. Arrondir au dixième."]
    },
    {
      context: "Le groupe des onze latinistes de la 3ème B du collège a obtenu les notes suivantes à un devoir : 7, 9, 9.5, 9.5, 10, 10, 12, 14, 16, 16, 19",
      questions: ["Calculer la moyenne du groupe.", "Déterminer la médiane de cette série."]
    }
  ];

  const randomExamples = examples.sort(() => Math.random() - 0.5).slice(0, 3);
  const examplesText = randomExamples.map((ex, i) => 
    `EXEMPLE ${i + 1} :
Contexte : ${ex.context}
Questions typiques : ${ex.questions.join(', ')}`
  ).join('\n\n');

  if (language === 'fr') {
    return `Tu es un créateur d'exercices de statistiques pour le Brevet des Collèges (niveau 3ème).

TON OBJECTIF : Créer un NOUVEL exercice inspiré des exemples du Brevet ci-dessous, MAIS SANS LES RÉPÉTER.

EXEMPLES D'INSPIRATION (observe leur style, leur structure et leurs types de questions) :
${examplesText}

DONNÉES STATISTIQUES DISPONIBLES (tu peux les utiliser ou créer tes propres données adaptées à ton contexte) :
Série de données : ${rawData.join(', ')}
→ Moyenne = ${mean}, Médiane = ${median}

INSTRUCTIONS CRITIQUES :
1. CRÉE UN NOUVEL EXERCICE : Ne répète AUCUN des exemples ci-dessus. Inspire-toi de leur style, mais invente un contexte, des données et des questions complètement différents.

2. OBSERVE LES EXEMPLES : Ils sont variés :
   - Certains demandent de calculer des indicateurs (moyenne, médiane, étendue)
   - D'autres demandent des interprétations
   - Certains calculent des pourcentages
   - D'autres analysent l'impact d'une nouvelle donnée
   - Certains comparent deux situations (mais pas toujours)

3. LIBERTÉ CRÉATIVE : Tu peux :
   - Utiliser les données fournies ou créer tes propres données adaptées à ton contexte
   - Choisir le type de question qui correspond à ton exercice (calcul, interprétation, pourcentage, etc.)
   - Varier les contextes (notes, tailles, temps, quantités, sciences, sport, vie quotidienne, etc.)

4. STYLE BREVET :
   - Contexte réaliste et clair
   - Présentation des données (liste, tableau, ou description)
   - Questions adaptées au niveau 3ème
   - Vocabulaire scolaire et précis

FORMAT DE RÉPONSE :
Retourne UNIQUEMENT l'énoncé complet de l'exercice, sans titre ni numérotation. L'énoncé doit inclure :
- Le contexte de l'exercice (situation réaliste)
- La présentation des données (sous forme de liste, tableau, ou description claire)
- Une ou plusieurs questions adaptées au contexte

GÉNÈRE MAINTENANT LE NOUVEL EXERCICE :`;
  } else {
    return `You are a statistics exercise creator for 9th Grade students.

YOUR OBJECTIVE: Create a NEW exercise inspired by Brevet examples, BUT WITHOUT REPEATING THEM.

INSPIRATION EXAMPLES (observe their style, structure, and types of questions):
${examplesText}

AVAILABLE STATISTICAL DATA (you can use them or create your own data adapted to your context):
Data series: ${rawData.join(', ')}
→ Mean = ${mean}, Median = ${median}

CRITICAL INSTRUCTIONS:
1. CREATE A NEW EXERCISE: Do NOT repeat ANY of the examples above. Be inspired by their style, but invent a completely different context, data, and questions.

2. OBSERVE THE EXAMPLES: They are varied:
   - Some ask to calculate indicators (mean, median, range)
   - Others ask for interpretations
   - Some calculate percentages
   - Others analyze the impact of a new data point
   - Some compare two situations (but not always)

3. CREATIVE FREEDOM: You can:
   - Use the provided data or create your own data adapted to your context
   - Choose the type of question that fits your exercise (calculation, interpretation, percentage, etc.)
   - Vary the contexts (grades, sizes, time, quantities, science, sports, daily life, etc.)

4. EXAM STYLE:
   - Realistic and clear context
   - Data presentation (list, table, or description)
   - Questions appropriate for 9th grade
   - Formal and precise vocabulary

RESPONSE FORMAT:
Return ONLY the complete exercise statement, without title or numbering. The statement must include:
- The exercise context (realistic situation)
- Data presentation (as a list, table, or clear description)
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

