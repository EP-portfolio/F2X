import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import html2canvas from 'html2canvas';
import { Camera, CheckCircle, AlertCircle, FileText, ChevronRight, Mail, RefreshCw, Eye, BookOpen, Star, Sparkles } from 'lucide-react';
import { generateExerciseData, ExerciseData } from '../utils/exerciseGenerator';
import { genererPromptEnonce } from '../utils/prompts';

// --- TYPES ---

interface ExerciseStep {
  id: number;
  title: string;
  description: string;
  problem: string;
  promptText: string;      
  correctionPrompt: string; 
  type: 'table' | 'frequency' | 'indicators' | 'problem';
  rawData?: any; 
  isEnriched?: boolean;
}

const SCENARIOS_PROBLEMS = [
  {
    context: "Salaires",
    itemA: "Entreprise A", meanA: 2500, medianA: 1800,
    itemB: "Entreprise B", meanB: 2500, medianB: 2400,
    goal: "Si tu veux gagner plus de 2000€, quelle entreprise choisir ?",
    answerLogic: "L'Entreprise B car la médiane est 2400 (50% gagnent plus), contre 1800 pour A."
  }
];

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper for math local to Assessment to ensure consistency with generator data
const getMean = (nums: number[]) => (nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(1);
const getMedian = (nums: number[]) => {
    const sorted = [...nums].sort((a,b)=>a-b);
    const mid = Math.floor(sorted.length/2);
    return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid-1] + sorted[mid])/2);
};
const getQuartiles = (nums: number[]) => {
    const sorted = [...nums].sort((a,b)=>a-b);
    const n = sorted.length;
    const q1Index = Math.ceil(n / 4) - 1;
    const q3Index = Math.ceil((3 * n) / 4) - 1;
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    return { q1, q3, iqr: q3 - q1 };
}

// --- NOTEBOOK IMAGE GENERATOR (DOM based) ---

const generateNotebookImage = async (exercise: ExerciseStep): Promise<string> => {
    // 1. Create a container that looks like a notebook page
    const container = document.createElement('div');
    // Position fixed at 0,0 but with negative z-index to be rendered by browser but hidden
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '-1000',
        width: '800px',
        minHeight: '600px', 
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(#cfd8dc 1px, transparent 1px), linear-gradient(90deg, #cfd8dc 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        fontFamily: '"Patrick Hand", cursive',
        fontSize: '24px',
        color: '#1a237e', // Blue ink
        padding: '60px 40px',
        lineHeight: '1.5',
        boxSizing: 'border-box'
    });

    // Add margin line
    const marginLine = document.createElement('div');
    Object.assign(marginLine.style, {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '60px',
        width: '2px',
        backgroundColor: '#ef5350' // Red margin
    });
    container.appendChild(marginLine);

    // Content Wrapper
    const content = document.createElement('div');
    content.style.marginLeft = '40px'; // Offset for margin
    
    // Title
    const title = document.createElement('h2');
    title.textContent = `Correction : ${exercise.title}`;
    Object.assign(title.style, {
        textDecoration: 'underline',
        marginBottom: '30px',
        color: '#1a237e'
    });
    content.appendChild(title);

    // --- RENDER LOGIC BASED ON EXERCISE TYPE ---
    
    if (exercise.type === 'table' || exercise.type === 'frequency') {
        const { valeurs, effectifs, total, label } = exercise.rawData;

        // Create Table
        const table = document.createElement('table');
        Object.assign(table.style, {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            backgroundColor: 'transparent',
            color: '#1a237e'
        });

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = [label, "Effectif"];
        if (exercise.type === 'frequency') headers.push('Fréq (Frac)', 'Fréq (Déc)', 'Fréq (%)');

        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            Object.assign(th.style, {
                border: '2px solid #1a237e',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#1a237e',
                fontFamily: '"Patrick Hand", cursive'
            });
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        
        valeurs.forEach((val: number, idx: number) => {
            const eff = effectifs[idx];
            const tr = document.createElement('tr');
            
            // Col 1 & 2
            const td1 = document.createElement('td');
            td1.textContent = val.toString();
            Object.assign(td1.style, { 
                border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive'
            });
            
            const td2 = document.createElement('td');
            td2.textContent = eff.toString();
            Object.assign(td2.style, { 
                border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive'
            });
            
            tr.appendChild(td1);
            tr.appendChild(td2);

            if (exercise.type === 'frequency') {
                const freq = exercise.rawData.frequences[idx];
                const td3 = document.createElement('td'); td3.textContent = freq.fraction;
                const td4 = document.createElement('td'); td4.textContent = freq.decimalFormate;
                const td5 = document.createElement('td'); td5.textContent = `${freq.pourcentageFormate}%`;
                
                [td3, td4, td5].forEach(td => {
                    Object.assign(td.style, { 
                        border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive'
                    });
                    tr.appendChild(td);
                });
            }
            tbody.appendChild(tr);
        });

        // Total Row
        const trTotal = document.createElement('tr');
        const tdTitle = document.createElement('td'); tdTitle.textContent = "TOTAL";
        Object.assign(tdTitle.style, { 
            border: '2px solid #1a237e', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontFamily: '"Patrick Hand", cursive'
        });
        
        const tdTotal = document.createElement('td'); tdTotal.textContent = total.toString();
        Object.assign(tdTotal.style, { 
            border: '2px solid #1a237e', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontFamily: '"Patrick Hand", cursive'
        });
        
        trTotal.appendChild(tdTitle);
        trTotal.appendChild(tdTotal);
        
        if (exercise.type === 'frequency') {
             const tdEmpty1 = document.createElement('td'); tdEmpty1.textContent = "1";
             const tdEmpty2 = document.createElement('td'); tdEmpty2.textContent = "1";
             const tdEmpty3 = document.createElement('td'); tdEmpty3.textContent = "100%";
             [tdEmpty1, tdEmpty2, tdEmpty3].forEach(td => {
                 Object.assign(td.style, { 
                    border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive'
                });
                 trTotal.appendChild(td);
             });
        }
        
        tbody.appendChild(trTotal);
        table.appendChild(tbody);
        content.appendChild(table);

    } else if (exercise.type === 'indicators') {
         const { mean, median, q1, q3, iqr, unit } = exercise.rawData;
         const lines = [
             `1. Moyenne = ${mean} ${unit}`,
             `2. Médiane = ${median} ${unit}`,
             `3. Q1 = ${q1}  ;  Q3 = ${q3}`,
             `4. Écart Inter-quartile = ${iqr}`
         ];
         const ul = document.createElement('div');
         Object.assign(ul.style, {
             display: 'flex', flexDirection: 'column', gap: '20px', color: '#1a237e'
         });

         lines.forEach(line => {
             const div = document.createElement('div');
             div.textContent = line;
             ul.appendChild(div);
         });
         content.appendChild(ul);

    } else if (exercise.type === 'problem') {
        const { answerLogic } = exercise.rawData;
        const p = document.createElement('p');
        p.textContent = answerLogic;
        p.style.color = '#1a237e';
        content.appendChild(p);
    }

    // Teacher Annotation
    const annotation = document.createElement('div');
    Object.assign(annotation.style, {
        position: 'absolute',
        bottom: '50px',
        right: '50px',
        fontFamily: '"Caveat", cursive',
        color: '#c62828', // Red teacher ink
        fontSize: '48px',
        transform: 'rotate(-10deg)',
        border: '3px solid #c62828',
        borderRadius: '50% 40% 60% 30%',
        padding: '10px 30px',
        textAlign: 'center',
        zIndex: '10'
    });
    annotation.innerHTML = "20/20<br><span style='font-size:30px'>Parfait !</span>";
    container.appendChild(annotation);

    container.appendChild(content);
    document.body.appendChild(container);

    // Wait for fonts
    await document.fonts.ready;

    // Capture
    try {
        const canvas = await html2canvas(container, {
            scale: 2, 
            useCORS: true,
            backgroundColor: null,
            logging: false
        });
        document.body.removeChild(container);
        return canvas.toDataURL('image/png');
    } catch (e) {
        console.error("Erreur génération image notebook", e);
        document.body.removeChild(container);
        return "";
    }
};

// --- COMPONENT ---

export const Assessment: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<string[]>([]);
  
  const [generatedProblemImages, setGeneratedProblemImages] = useState<Record<number, string>>({});
  const [generatedCorrectionImages, setGeneratedCorrectionImages] = useState<Record<number, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingCorrection, setIsGeneratingCorrection] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [showTextFallback, setShowTextFallback] = useState(false);

  const [reportReady, setReportReady] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateRandomExercises();
  }, []);

  const generateRandomExercises = () => {
    // -------------------------------------------------------------------------
    // GENERATION DYNAMIQUE DES DONNÉES
    // -------------------------------------------------------------------------
    
    // Scénario A : Pour Exercice 1 (Tableau) et 2 (Fréquences)
    const dataA = generateExerciseData();
    const cleanDataDisplayA = dataA.rawList.join(', ');

    // Scénario B : Pour Exercice 3 (Indicateurs) - Nouvelle série pour varier
    const dataB = generateExerciseData();
    const cleanDataDisplayB = dataB.rawList.join(', ');
    
    // Calculs pour Ex 3
    const mean3 = getMean(dataB.rawList);
    const median3 = getMedian(dataB.rawList);
    const { q1, q3, iqr } = getQuartiles(dataB.rawList);

    // Scénario Problème (Ex 4) - Statique pour l'instant (Logique de comparaison)
    const s4 = getRandom(SCENARIOS_PROBLEMS);

    // -------------------------------------------------------------------------
    // EXERCICE 1 : Construction Tableau
    // -------------------------------------------------------------------------
    const ex1: ExerciseStep = {
      id: 1,
      title: `Tableau : ${dataA.titre}`,
      description: "Regrouper les données brutes dans un tableau d'effectifs.",
      type: 'table',
      problem: `Sondage sur "${dataA.titre}".\nDonnées brutes : ${cleanDataDisplayA}.\n\nConstruis le tableau des effectifs en regroupant les valeurs.`,
      promptText: `Sur une feuille quadrillée :
      1. Écris le titre en haut : "${dataA.titre}".
      2. Recopie lisiblement la liste suivante :
         "${cleanDataDisplayA}"
      3. Trace un tableau VIDE à 2 colonnes en dessous.
         Entêtes : "${dataA.label}" et "Effectif".`,
      correctionPrompt: "", 
      // Include 'arrondi' and 'titre' in rawData for prompt generation
      rawData: { valeurs: dataA.valeurs, effectifs: dataA.effectifs, total: dataA.total, label: dataA.label, frequences: dataA.frequences, arrondi: dataA.arrondi, titre: dataA.titre }
    };

    // -------------------------------------------------------------------------
    // EXERCICE 2 : Fréquences
    // -------------------------------------------------------------------------
    const ex2: ExerciseStep = {
      id: 2,
      title: "Calcul de Fréquences",
      description: "Compléter le tableau précédent avec les fréquences (Fraction, Décimal, %).",
      type: 'frequency',
      problem: `Reprenons le tableau de l'exercice précédent ("${dataA.titre}").\nAjoute 3 colonnes : Fréquence (Fraction), Fréquence (Décimal), Fréquence (%).\nConsigne : ${dataA.arrondi.texteConsigne}`,
      promptText: `Sur papier quadrillé, dessine un tableau à 5 colonnes.
      LAISSE LES 3 COLONNES DE DROITE (Fréquences) VIDES.`,
      correctionPrompt: "",
      rawData: { valeurs: dataA.valeurs, effectifs: dataA.effectifs, total: dataA.total, label: dataA.label, frequences: dataA.frequences, arrondi: dataA.arrondi, titre: dataA.titre }
    };

    // -------------------------------------------------------------------------
    // EXERCICE 3 : Indicateurs
    // -------------------------------------------------------------------------
    const ex3: ExerciseStep = {
      id: 3,
      title: `Stats : ${dataB.titre}`,
      description: "Moyenne, Médiane, Q1, Q3, Écart Inter-quartile.",
      type: 'indicators',
      problem: `Série : ${cleanDataDisplayB}. Calcule tous les indicateurs.`,
      promptText: `Écris le titre : "${dataB.titre}".
      Écris la liste : "${cleanDataDisplayB}".
      Écris les questions : Moyenne, Médiane, Q1, Q3, Écart Inter-quartile ?`,
      correctionPrompt: "",
      rawData: { mean: mean3, median: median3, q1, q3, iqr, unit: dataB.unite }
    };

    // -------------------------------------------------------------------------
    // EXERCICE 4 : Problème
    // -------------------------------------------------------------------------
    const ex4: ExerciseStep = {
      id: 4,
      title: "Résolution de Problème",
      description: "Interpréter pour choisir.",
      type: 'problem',
      problem: `${s4.goal}`,
      promptText: `Comparaison :
      ${s4.itemA} : Moy=${s4.meanA}, Med=${s4.medianA}
      ${s4.itemB} : Moy=${s4.meanB}, Med=${s4.medianB}
      Question : "${s4.goal}"`,
      correctionPrompt: "",
      rawData: { answerLogic: s4.answerLogic }
    };

    setExercises([ex1, ex2, ex3, ex4]);
    setGeneratedProblemImages({});
    setGeneratedCorrectionImages({});
    setFeedbackHistory([]);
    setCurrentStepIndex(0);
    setReportReady(false);
  };

  const currentExercise = exercises[currentStepIndex];

  // Enrich text with AI (Few-Shot)
  useEffect(() => {
    const enrichCurrentExercise = async () => {
      if (!currentExercise || currentExercise.isEnriched) return;
      if (currentExercise.type !== 'table' && currentExercise.type !== 'frequency') return;

      setIsEnriching(true);
      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");
        
        const ai = new GoogleGenAI({ apiKey });
        const prompt = genererPromptEnonce(currentExercise.rawData);
        
        const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: prompt
        });

        const enrichedText = response.text;
        
        if (enrichedText) {
          setExercises(prev => {
             const newExercises = [...prev];
             // Update the current exercise problem text with the enriched version
             newExercises[currentStepIndex] = {
                 ...newExercises[currentStepIndex],
                 problem: enrichedText,
                 isEnriched: true
             };
             return newExercises;
          });
        }
      } catch (e) {
         console.error("Enrichment failed", e);
      } finally {
         setIsEnriching(false);
      }
    };

    enrichCurrentExercise();
  }, [currentStepIndex, currentExercise]);

  const formatFeedbackText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let content = line;
      let isListItem = false;
      if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) {
          isListItem = true;
          content = content.trim().substring(2);
      }
      const parts = content.split(/\*\*(.*?)\*\*/g);
      const formattedContent = parts.map((part, j) => {
        if (j % 2 === 1) return <strong key={j} className="font-bold text-gray-900">{part}</strong>;
        return part;
      });
      if (isListItem) {
          return (
              <div key={i} className="flex gap-2 mt-1 ml-1">
                  <span className="text-indigo-500 mt-1">•</span>
                  <div className="flex-1">{formattedContent}</div>
              </div>
          );
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <div key={i} className={`${i > 0 ? 'mt-1' : ''}`}>{formattedContent}</div>;
    });
  };

  useEffect(() => {
    const generateProblemImage = async () => {
      if (!currentExercise) return;
      if (generatedProblemImages[currentStepIndex]) return;

      setIsGeneratingImage(true);
      setShowTextFallback(false);

      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{
              text: `Génère une image réaliste d'une feuille de papier à grands carreaux (type école française).
              Vue de dessus, éclairage naturel.
              Écriture manuscrite à l'encre bleue.
              Contenu :
              ${currentExercise.promptText}`
            }]
          },
          config: { imageConfig: { aspectRatio: "16:9" } }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setGeneratedProblemImages(prev => ({...prev, [currentStepIndex]: `data:image/png;base64,${part.inlineData.data}`}));
                    break;
                }
            }
        }
      } catch (err) {
        console.error("Problem Image Gen Failed", err);
        setShowTextFallback(true);
      } finally {
        setIsGeneratingImage(false);
      }
    };

    generateProblemImage();
  }, [currentStepIndex, currentExercise]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setIsGeneratingCorrection(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("Clé API manquante");
      const ai = new GoogleGenAI({ apiKey });

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
      const base64Content = base64Data.split(',')[1];

      // 1. Text Feedback Analysis (GEMINI)
      const feedbackPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { text: `Tu es un prof de maths de 3ème. Analyse cette copie pour l'exercice : "${currentExercise.title}". 
            Consigne : ${currentExercise.problem}.
            Vérifie si l'élève a bon. Si c'est faux, explique pourquoi simplement. 
            Sois encourageant.` },
            { inlineData: { mimeType: file.type, data: base64Content } }
          ]
        }
      });

      // 2. Correction Image Generation (HTML -> CANVAS)
      // We generate it locally to ensure 100% accuracy of the table structure
      const correctionImagePromise = generateNotebookImage(currentExercise);

      const [feedbackResponse, correctionImageDataUrl] = await Promise.all([feedbackPromise, correctionImagePromise]);

      const feedback = feedbackResponse.text || "Analyse impossible.";
      setFeedbackHistory(prev => {
        const newHistory = [...prev];
        newHistory[currentStepIndex] = feedback;
        return newHistory;
      });

      if (correctionImageDataUrl) {
          setGeneratedCorrectionImages(prev => ({...prev, [currentStepIndex]: correctionImageDataUrl}));
      }

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingCorrection(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (currentStepIndex < exercises.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowTextFallback(false);
    } else {
      setReportReady(true);
    }
  };

  const handleSendReport = () => {
    if (!parentEmail.includes('@')) { alert("Email invalide"); return; }
    setTimeout(() => setEmailSent(true), 1000);
  };

  if (!exercises.length) return <div className="flex justify-center items-center h-64"><RefreshCw className="animate-spin text-indigo-600" size={32} /></div>;

  if (reportReady) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-green-600 p-6 text-white text-center">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Bilan de Compétences</h2>
          </div>
          <div className="p-8 space-y-8">
            
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                    <Star size={20} className="fill-yellow-500 text-yellow-600"/> 
                    Recommandations personnalisées
                </h3>
                <div className="space-y-2 text-sm text-yellow-800">
                    <p>Pour progresser, voici ce que tu peux travailler :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Tableaux :</strong> Assure-toi de toujours vérifier que la somme de la colonne "Effectif" est égale au total de la liste.</li>
                        <li><strong>Fréquences :</strong> Entraîne-toi à passer rapidement de la fraction au pourcentage (ex: 1/4 = 0.25 = 25%). Va dans la section "S'entraîner" pour en faire d'autres.</li>
                        <li><strong>Indicateurs :</strong> Ne confonds pas Moyenne et Médiane. La médiane partage la série en deux, la moyenne est un équilibre.</li>
                    </ul>
                    <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 font-bold hover:underline">Refaire une série d'exercices</button>
                </div>
            </div>

            <div className="space-y-6">
              {exercises.map((ex, idx) => (
                <div key={ex.id} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-700 mb-1">Exercice {idx + 1} : {ex.title}</h4>
                  <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">
                     {formatFeedbackText(feedbackHistory[idx] || "Non traité")}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2"><Mail size={20} /> Informer les parents</h3>
              {!emailSent ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="email" placeholder="email.parent@exemple.com" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-lg outline-none" />
                  <button onClick={handleSendReport} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg">Envoyer</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-700 bg-green-100 p-4 rounded-lg"><CheckCircle size={20} /> Envoyé !</div>
              )}
            </div>
            <button onClick={() => window.location.reload()} className="block w-full text-center text-gray-500 hover:text-indigo-600 mt-8">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Progression</span><span>{currentStepIndex + 1} / {exercises.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentStepIndex + 1) / exercises.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">Compétence : {currentExercise.title}</div>
            <button onClick={() => setShowTextFallback(!showTextFallback)} className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-sm"><FileText size={16} />{showTextFallback ? "Voir le cahier" : "Voir texte brut"}</button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             À toi de jouer !
             {isEnriching && <Sparkles className="text-yellow-500 animate-pulse" size={20} />}
          </h2>
          
          <div className="mb-8 relative min-h-[200px] rounded-xl overflow-hidden border border-indigo-100 shadow-sm bg-gray-50">
             {!showTextFallback && generatedProblemImages[currentStepIndex] ? (
               <div className="relative">
                 <img src={generatedProblemImages[currentStepIndex]} alt="Énoncé" className="w-full h-auto object-cover" />
                 <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Généré par IA</div>
               </div>
             ) : !showTextFallback && isGeneratingImage ? (
                <div className="flex flex-col items-center justify-center h-64 bg-indigo-50/50">
                   <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                   <p className="text-indigo-600 font-hand text-xl">L'IA écrit l'énoncé dans le cahier...</p>
                </div>
             ) : (
                <div className="p-8 bg-white" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {/* Using 'problem' text which is dynamically enriched by AI */}
                  <p className="whitespace-pre-wrap text-xl text-indigo-900 font-hand leading-loose">
                    {currentExercise.problem}
                  </p>
                  {isEnriching && <p className="text-xs text-indigo-400 mt-2 italic animate-pulse">L'IA rédige un énoncé de type Brevet...</p>}
                </div>
             )}
          </div>

          {feedbackHistory[currentStepIndex] ? (
            <div className="mb-8 animate-fade-in">
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 mb-6">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2"><CheckCircle size={20} /> Correction de l'IA</h3>
                <div className="prose prose-sm max-w-none text-gray-800">{formatFeedbackText(feedbackHistory[currentStepIndex])}</div>
              </div>

              {/* Correction Image Display */}
              <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-6">
                 <h4 className="font-bold text-gray-700 m-4 flex items-center gap-2"><Eye size={18}/> Copie modèle (Correction)</h4>
                 {generatedCorrectionImages[currentStepIndex] ? (
                    <img src={generatedCorrectionImages[currentStepIndex]} alt="Correction visuelle" className="w-full h-auto rounded-lg shadow-inner" />
                 ) : isGeneratingCorrection ? (
                    <div className="h-40 flex items-center justify-center text-gray-400 gap-2">
                       <RefreshCw className="animate-spin" size={20}/> Rédaction du corrigé manuscrit...
                    </div>
                 ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400">Image non disponible</div>
                 )}
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleNext} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">
                  {currentStepIndex < exercises.length - 1 ? 'Page Suivante' : 'Voir le Bilan'} <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4 flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>Résous l'exercice sur papier libre, puis prends une photo de ta réponse pour que je puisse la corriger.</p>
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors group cursor-pointer relative w-full">
                 {isAnalyzing ? (
                   <div className="text-center py-4">
                      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-indigo-600 font-medium">Je corrige et je rédige le modèle...</p>
                   </div>
                 ) : (
                   <>
                      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                      <div className="bg-indigo-100 p-4 rounded-full group-hover:scale-110 transition-transform duration-200">
                        <Camera size={40} className="text-indigo-600" />
                      </div>
                      <span className="font-bold text-lg text-gray-700 mt-3 group-hover:text-indigo-700">Scanner ma réponse</span>
                   </>
                 )}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};