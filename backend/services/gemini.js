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
  // TOUS les exemples du Brevet pour inspiration maximale
  const allExamples = [
    {
      source: 'Brevet Guyane Antilles - Septembre 2003',
      context: "Lors d'un contrôle, un élève de 3ème a obtenu les notes suivantes : 6 7 8 11 11 11 10 8 17 16 4 11 11 9 9 7 11 18 6 9 7 10 12 17 6 19",
      questions: ["Compléter le tableau suivant en rangeant les notes par ordre croissant", "Quel est l'effectif total de ce groupe ?", "Calculer la moyenne de cette classe ? Arrondir à 0,1 près.", "Déterminer la médiane de ces notes. Justifier."]
    },
    {
      source: 'Brevet Guadeloupe Sud - 2005',
      context: "Voici l'histogramme des notes d'un contrôle (sur 20 points) dans une classe. Les notes sont regroupées par intervalles : [0,2[ (effectif 2), [2,4[ (3), [4,6[ (5), [6,8[ (7), [8,10[ (9), [10,12[ (10), [12,14[ (8), [14,16[ (6), [16,18[ (4), [18,20[ (1)",
      questions: ["Compléter le tableau suivant", "Quel est l'effectif total de cette classe ?", "Combien d'élèves ont eu 10 ou moins ?", "Calculer la fréquence (en pourcentage) correspondant à la note 2 ? Donner la signification de cette fréquence.", "Déterminer la médiane de cette série de notes, en justifiant. Puis donner sa signification."]
    },
    {
      source: 'Brevet Polynésie 2007',
      context: "Le tableau ci-dessous montre la répartition des notes lors d'un contrôle pour 26 élèves d'une classe de 3ème. Notes : 7(1), 8(2), 9(3), 10(4), 11(3), 12(4), 13(3), 14(2), 15(2), 16(1), 17(1)",
      questions: ["Calculer M, la note moyenne. Arrondir à l'unité.", "Déterminer m, la médiane de cette série. Justifier. Que signifie cette médiane ?", "Calculer le pourcentage d'élèves ayant eu une note inférieure ou égale à 11 ? Arrondir au dixième."]
    },
    {
      source: 'Brevet Pondichéry 2013',
      context: "Un professeur de SVT demande aux 25 élèves d'une classe de 3ème de faire germer des graines de blé chez eux. Le tableau donne les tailles des plantules à 10 jours : 8cm(2), 9cm(3), 10cm(5), 11cm(6), 12cm(4), 13cm(3), 14cm(2)",
      questions: ["Combien de plantules ont une taille qui mesure au plus 11 cm ?", "Calculer l'étendue de cette série.", "Calculer la moyenne de cette série. Arrondir au dixième près.", "Déterminer la médiane de cette série. Justifier. Interpréter le résultat.", "On considère qu'un élève a bien respecté le protocole si la taille de la plantule 10 jours est supérieure ou égale à 14 cm. Quel pourcentage des élèves de la classe a bien respecté le protocole ?", "Le professeur a fait lui-même la même expérience. Prouver que, si on ajoute la donnée du professeur à cette série, la médiane ne changera pas."]
    },
    {
      source: 'Brevet Amérique du Nord - 2012',
      context: "Deux classes du collège ont répondu à la question : « Combien de livres as-tu empruntés dans les 12 derniers mois ? » Classe 3ème A : Effectif total 25, Moyenne 4, Médiane 5, Étendue 8. Classe 3ème B : Effectif total 25, Moyenne 5, Médiane 5, Étendue 9.",
      questions: ["Comparer les nombres moyens de livres empruntés dans chaque classe.", "Un si grand lecteur est un élève qui a emprunté 6 livres ou plus. Quelle classe compte le plus de « grands lecteurs » ?", "Dans quelle classe se trouve l'élève qui a emprunté le plus de livres ?"]
    },
    {
      source: 'Brevet Amérique du Nord - 2015',
      context: "À l'heure de la 14ème étape du tour de France cycliste 2014, les coureurs ont parcouru 3 260,9 km depuis le départ. Le classement général des 10 premiers coureurs avec leurs temps : Nibali (59h16min07s), Bardet (59h19min41s), Pinot (59h19min49s), Valverde (59h20min01s), Péraud (59h20min02s), Van Garderen (59h20min10s), Mollema (59h20min11s), Konig (59h20min12s), Horner (59h20min13s), Talansky (59h20min14s)",
      questions: ["Calculer la différence entre le temps de course de Leopold Konig et celui de Vincenzo Nibali.", "Que représente la différence calculée pour la série statistique ?", "Quelle est la médiane de cette série statistique ? Justifier."]
    },
    {
      source: 'Exercice Brevet - Tortues vertes',
      context: "Afin de surveiller la bonne santé des tortues vertes à Madagascar, elles sont régulièrement pesées. Voici les données relevées par un scientifique en mai 2021. Tableau : 7 tortues marquées (A-001 à A-007) avec leur sexe (Mâle, Femelle) et leur masse en kg (113, 96, 125, 87, 117, 104, 101)",
      questions: ["Calculer l'étendue de cette série statistique.", "Calculer la masse moyenne de ces 7 tortues. Arrondir le résultat à l'unité.", "Déterminer la médiane de cette série statistique. Interpréter le résultat.", "Est-il vrai que les mâles représentent moins de 20% de cet échantillon ?"]
    },
    {
      source: 'Brevet - Bordeaux, Caen, Clermont-Ferrand, Limoges, Nantes, Orléans-Tours, Poitiers, Rennes - 2006',
      context: "Le tableau ci-dessous donne la répartition des notes obtenues à un contrôle de mathématiques par les 27 élèves d'une classe de troisième. Notes : 6(3), 8(5), 10(6), 13(7), 14(5), 17(1)",
      questions: ["Calculer la note moyenne de la classe à ce contrôle. Arrondir le résultat à l'unité.", "Calculer le pourcentage d'élèves ayant eu une note supérieure ou égale à 10. Arrondir le résultat au dixième."]
    },
    {
      source: 'Brevet - Aix-Marseille, Corse, Montpellier, Nice, Toulouse - 2005',
      context: "Voici l'histogramme des notes d'un contrôle noté sur 5 pour une classe de 25 élèves. Notes : 0/5(1), 1/5(2), 2/5(4), 3/5(4), 4/5(7), 5/5(7)",
      questions: ["Reproduire et remplir le tableau des notes suivants (avec effectifs et effectifs cumulés croissants).", "Calculer la moyenne des notes de la classe.", "Quelle est la médiane des notes de la classe ?", "Calculer la fréquence des notes inférieures ou égales à 3 points sur 5."]
    },
    {
      source: 'Brevet - Amiens, Créteil, Lille, Paris, Rouen, Versailles - 2004',
      context: "Après un contrôle, les notes de 25 élèves ont été regroupées dans le tableau ci-dessous. Classes : 0≤n<4(1), 4≤n<8(6), 8≤n<12(7), 12≤n<16(?), 16≤n≤20(3)",
      questions: ["Compléter le tableau en indiquant le nombre d'élèves ayant obtenu une note comprise entre 12 et 16 (16 exclu).", "Combien d'élèves ont obtenu moins de 12?", "Combien d'élèves ont obtenu au moins 8?", "Quel est le pourcentage des élèves qui ont obtenu une note comprise entre 8 et 12 (12 exclu)?"]
    },
    {
      source: 'Brevet - Aix-Marseille, Corse, Montpellier, Nice, Toulouse - 2004',
      context: "Une station de ski réalise une enquête auprès de 300 skieurs. Répartition par classes d'âge : [0;10[(27), [10;20[(46), [20;30[(48), [30;40[(39), [40;50[(42), [50;60[(36), [60;70[(33), [70;80[(24), [80;90[(6)",
      questions: ["Compléter ce tableau en indiquant le centre de chaque classe d'âge.", "Calculer l'âge moyen des skieurs fréquentant cette station.", "Quelle est la fréquence, en pourcentage, de skieurs ayant un âge strictement inférieur à 20 ans ?"]
    },
    {
      source: 'Brevet - Besançon, Dijon, Grenoble, Lyon, Nancy-Metz, Reims, Strasbourg - 2004',
      context: "Le diagramme en barres ci-dessous donne la répartition des notes obtenues à un contrôle de mathématiques par les élèves d'une classe de 3ème. Notes : 8(2), 9(5), 10(2), 11(2), 12(3), 13(2), 14(7), 15(2)",
      questions: ["Combien d'élèves y a-t-il dans cette classe ?", "Quelle est la note moyenne de la classe à ce contrôle ?", "Quelle est la note médiane ?", "Quelle est l'étendue de cette série de notes ?"]
    },
    {
      source: 'Brevet - Besançon, Dijon, Grenoble, Lyon, Nancy-Metz, Reims, Strasbourg - 2003',
      context: "La course automobile des 24 heures du Mans consiste à effectuer en 24 heures le plus grand nombre de tours d'un circuit. Le diagramme en bâtons donne la répartition du nombre de tours effectués par les 28 premiers coureurs. Tours : 310(4), 320(4), 330(5), 340(7), 350(3), 360(2)",
      questions: ["Compléter le tableau des effectifs et des effectifs cumulés croissants de cette série statistique.", "Déterminer la médiane et l'étendue de cette série.", "Calculer la moyenne de cette série. (on donnera la valeur arrondie à l'unité)."]
    },
    {
      source: 'Brevet - Besançon, Dijon, Lyon, Nancy-Metz, Reims, Strasbourg - 2002',
      context: "Voici le diagramme représentant la répartition des notes obtenues par les élèves d'une classe de troisième lors d'un contrôle de français. Notes : 6(2), 7(3), 8(5), 9(1), 10(4), 12(1), 13(6), 15(3)",
      questions: ["Quel est l'effectif de cette classe de troisième?", "Calculer la moyenne des notes obtenues en donnant le résultat sous sa forme décimale exacte."]
    },
    {
      source: 'Brevet - Grenoble - 2002',
      context: "Une usine teste des ampoules pour déterminer leur durée de vie en heures. Résultats : 1000≤d<1200(550), 1200≤d<1400(1460), 1400≤d<1600(1920), 1600≤d<1800(1640), 1800≤d<2000(430)",
      questions: ["Quel est le pourcentage d'ampoules qui ont une durée de vie de moins de 1400 h ?", "Calculer la durée de vie moyenne d'une ampoule."]
    },
    {
      source: 'Brevet - Grenoble - 2001',
      context: "En météorologie, l'insolation est le nombre d'heures d'ensoleillement. Données d'insolation pour le mois de juillet sur plusieurs années à Voglans, Savoie. Années 1990-2000 : 324, 325, 257, 234, 285, 261, 213, 226, 308, 259, 206 heures",
      questions: ["Calculer la moyenne d'insolation sur cette période (On donnera le résultat arrondi à l'heure près).", "Peut-on dire que la valeur 259 est la médiane de cette série ? Justifier."]
    },
    {
      source: 'Brevet - Bordeaux - 2000',
      context: "Tableau de fréquentation quotidienne d'une braderie. Vendredi(770), Samedi(1925), Dimanche(9009), Lundi(3080), Mardi(616)",
      questions: ["Sur le nombre total de personnes ayant fréquenté la braderie, quel est le pourcentage de celles qui sont venues le dimanche?", "Quel est le nombre moyen de visiteurs, par jour, pendant la durée de la braderie?"]
    },
    {
      source: 'Brevet - Grenoble - 2000',
      context: "A la sortie d'une agglomération, on a relevé la répartition par tranches horaires des 6400 véhicules quittant la ville entre 16 heures et 22 heures. 16h-17h(1100), 17h-18h(2000), 18h-19h(1600), 19h-20h(900), 20h-21h(450), 21h-22h(350)",
      questions: ["Représenter l'histogramme des effectifs de cette série statistique.", "Calculer la fréquence de la tranche horaire 19 h - 20 h (on donnera le résultat arrondi à 0,01 près, puis le pourcentage correspondant).", "Calculer le pourcentage de véhicules quittant la ville entre 16 h et 20 h."]
    },
    {
      source: 'Brevet - Orléans-Tours - 2000',
      context: "Le groupe des onze latinistes de la 3ème B du collège a obtenu les notes suivantes à un devoir : 7, 9, 9.5, 9.5, 10, 10, 12, 14, 16, 16, 19",
      questions: ["Calculer la moyenne du groupe.", "Déterminer la médiane de cette série."]
    }
  ];

  // Utiliser TOUS les exemples pour maximiser l'inspiration
  const examplesText = allExamples.map((ex, i) => 
    `EXEMPLE ${i + 1} (${ex.source}) :
Contexte : ${ex.context}
Questions : ${ex.questions.map((q, idx) => `${idx + 1}. ${q}`).join('\n   ')}`
  ).join('\n\n');

  if (language === 'fr') {
    return `Tu es un créateur d'exercices de statistiques pour le Brevet des Collèges (niveau 3ème).

TON OBJECTIF : Créer un NOUVEL exercice inspiré des ${allExamples.length} exemples du Brevet ci-dessous, MAIS SANS LES RÉPÉTER.

⚠️ IMPORTANT : Tu as ${allExamples.length} exemples variés ci-dessous. Observe leur DIVERSITÉ de contextes, de formats de données, et de types de questions. INVENTE quelque chose de COMPLÈTEMENT DIFFÉRENT.

TOUS LES EXEMPLES D'INSPIRATION (observe leur DIVERSITÉ) :
${examplesText}

DONNÉES STATISTIQUES DISPONIBLES (tu peux les utiliser ou créer tes propres données adaptées à ton contexte) :
Série de données : ${rawData.join(', ')}
→ Moyenne = ${mean}, Médiane = ${median}

INSTRUCTIONS CRITIQUES :
1. CRÉE UN NOUVEL EXERCICE : Ne répète AUCUN des ${allExamples.length} exemples ci-dessus. Inspire-toi de leur DIVERSITÉ de contextes, mais invente un contexte, des données et des questions complètement différents.

2. VARIÉTÉ DES CONTEXTES OBSERVÉE dans les exemples :
   - Sciences : plantules, tortues, ampoules, insolation
   - Transport : véhicules, tours de circuit, temps de course
   - Scolaire : notes de contrôle, devoirs, latinistes
   - Commerce/Vie quotidienne : braderie, skieurs, livres empruntés
   - Sport : Tour de France, 24h du Mans
   
   → INVENTE UN CONTEXTE DIFFÉRENT de tous ceux-ci ! (ex: animaux, météo, sport, consommation, environnement, etc.)

3. VARIÉTÉ DES QUESTIONS OBSERVÉE :
   - Calculs d'indicateurs : moyenne, médiane, étendue, Q1, Q3
   - Interprétations : "Que signifie cette médiane ?", "Interpréter le résultat"
   - Pourcentages : "Quel pourcentage...", "Calculer la fréquence en %"
   - Comparaisons : "Comparer...", "Quelle classe compte le plus..."
   - Justifications : "Justifier", "Prouver que..."
   - Impact de nouvelles données : "Si on ajoute... la médiane changera-t-elle ?"
   
   → CHOISIS UN TYPE DE QUESTION DIFFÉRENT ou une combinaison originale !

4. VARIÉTÉ DES PRÉSENTATIONS :
   - Liste brute de données
   - Tableau avec effectifs
   - Histogramme/diagramme en barres
   - Classes d'intervalles
   - Données groupées
   
   → CHOISIS UN FORMAT DE PRÉSENTATION ADAPTÉ À TON CONTEXTE !

5. LIBERTÉ CRÉATIVE MAXIMALE :
   - Tu peux utiliser les données fournies (${rawData.join(', ')}) ou créer tes propres données adaptées à ton contexte
   - Si tu utilises les données fournies, adapte-les à ton contexte (ex: si ce sont des nombres entre 80-130, ça peut être des masses en kg, des tailles en cm, des durées en minutes, etc.)
   - Si tu crées tes propres données, assure-toi qu'elles correspondent à la moyenne (${mean}) et médiane (${median}) fournies

6. STYLE BREVET :
   - Contexte réaliste et clair (comme dans les exemples)
   - Présentation des données adaptée au contexte
   - Questions adaptées au niveau 3ème
   - Vocabulaire scolaire et précis

FORMAT DE RÉPONSE :
Retourne UNIQUEMENT l'énoncé complet de l'exercice, sans titre ni numérotation. L'énoncé doit inclure :
- Le contexte de l'exercice (situation réaliste et ORIGINALE, différente des ${allExamples.length} exemples ci-dessus)
- La présentation des données (sous forme de liste, tableau, ou description claire)
- Une ou plusieurs questions adaptées au contexte

⚠️ RAPPEL FINAL CRITIQUE : 
- Ne répète AUCUN des ${allExamples.length} contextes ci-dessus (pas de plantules, pas de tortues, pas de notes, pas de véhicules, pas de skieurs, pas de braderie, pas de Tour de France, pas de 24h du Mans, pas de latinistes, pas d'ampoules, pas d'insolation, etc.)
- INVENTE un contexte NOUVEAU et ORIGINAL (ex: animaux sauvages différents, météo différente, consommation, environnement, sport différent, technologie, santé, agriculture, etc.)
- Varie le format de présentation des données (liste, tableau, histogramme, classes)
- Varie le type de questions (calculs, interprétations, pourcentages, justifications, comparaisons)

GÉNÈRE MAINTENANT UN EXERCICE COMPLÈTEMENT ORIGINAL ET DIFFÉRENT :`;
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

