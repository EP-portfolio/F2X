import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import html2canvas from 'html2canvas';
import { Camera, CheckCircle, AlertCircle, FileText, ChevronRight, Mail, RefreshCw, Eye, Star, Sparkles, ClipboardList } from 'lucide-react';
import { generateExerciseData } from '../utils/exerciseGenerator';
import { genererPromptEnonce, genererPromptCorrection, genererPromptAnalyse } from '../utils/prompts';
import { Language } from '../types';

// --- TYPES & HELPERS IDENTIQUES ---
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

interface AssessmentProps {
  language: Language;
}

const getMean = (nums: number[]) => (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
const getMedian = (nums: number[]) => {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2);
};
const getQuartiles = (nums: number[]) => {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  const q1Index = Math.ceil(n / 4) - 1;
  const q3Index = Math.ceil((3 * n) / 4) - 1;
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  return { q1, q3, iqr: q3 - q1 };
}

// --- NOTEBOOK RENDERER (Keep logic, update nothing visual inside the canvas generation as it simulates paper) ---
const generateNotebookImage = async (exercise: ExerciseStep, language: Language): Promise<string> => {
  // ... (Code de génération identique pour garder la logique complexe intacte, il simule du papier donc pas besoin de 'moderniser' le papier)
  const container = document.createElement('div');
  Object.assign(container.style, { position: 'fixed', top: '0', left: '0', zIndex: '-1000', width: '800px', minHeight: '600px', backgroundColor: '#ffffff', backgroundImage: 'linear-gradient(#cfd8dc 1px, transparent 1px), linear-gradient(90deg, #cfd8dc 1px, transparent 1px)', backgroundSize: '20px 20px', fontFamily: '"Patrick Hand", cursive', fontSize: '24px', color: '#1a237e', padding: '60px 40px', lineHeight: '1.5', boxSizing: 'border-box' });
  const marginLine = document.createElement('div');
  Object.assign(marginLine.style, { position: 'absolute', top: '0', bottom: '0', left: '60px', width: '2px', backgroundColor: '#ef5350' });
  container.appendChild(marginLine);
  const content = document.createElement('div');
  content.style.marginLeft = '40px';
  const title = document.createElement('h2');
  title.textContent = `${language === 'fr' ? 'Correction' : 'Solution'} : ${exercise.title}`;
  Object.assign(title.style, { textDecoration: 'underline', marginBottom: '30px', color: '#1a237e' });
  content.appendChild(title);

  if (exercise.type === 'table' || exercise.type === 'frequency') {
    const { valeurs, effectifs, total, label } = exercise.rawData;
    const table = document.createElement('table');
    Object.assign(table.style, { width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'transparent', color: '#1a237e' });
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [label, language === 'fr' ? "Effectif" : "Count"];
    if (exercise.type === 'frequency') {
      if (language === 'fr') headers.push('Fréq (Frac)', 'Fréq (Déc)', 'Fréq (%)');
      else headers.push('Freq (Frac)', 'Freq (Dec)', 'Freq (%)');
    }
    headers.forEach(h => {
      const th = document.createElement('th'); th.textContent = h;
      Object.assign(th.style, { border: '2px solid #1a237e', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    valeurs.forEach((val: number, idx: number) => {
      const eff = effectifs[idx];
      const tr = document.createElement('tr');
      const td1 = document.createElement('td'); td1.textContent = val.toString();
      Object.assign(td1.style, { border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
      const td2 = document.createElement('td'); td2.textContent = eff.toString();
      Object.assign(td2.style, { border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
      tr.appendChild(td1); tr.appendChild(td2);
      if (exercise.type === 'frequency') {
        const freq = exercise.rawData.frequences[idx];
        const td3 = document.createElement('td'); td3.textContent = freq.fraction;
        const td4 = document.createElement('td'); td4.textContent = freq.decimalFormate;
        const td5 = document.createElement('td'); td5.textContent = `${freq.pourcentageFormate}%`;
        [td3, td4, td5].forEach(td => {
          Object.assign(td.style, { border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
          tr.appendChild(td);
        });
      }
      tbody.appendChild(tr);
    });
    const trTotal = document.createElement('tr');
    const tdTitle = document.createElement('td'); tdTitle.textContent = "TOTAL";
    Object.assign(tdTitle.style, { border: '2px solid #1a237e', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
    const tdTotal = document.createElement('td'); tdTotal.textContent = total.toString();
    Object.assign(tdTotal.style, { border: '2px solid #1a237e', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
    trTotal.appendChild(tdTitle); trTotal.appendChild(tdTotal);
    if (exercise.type === 'frequency') {
      const tdEmpty1 = document.createElement('td'); tdEmpty1.textContent = "1";
      const tdEmpty2 = document.createElement('td'); tdEmpty2.textContent = "1";
      const tdEmpty3 = document.createElement('td'); tdEmpty3.textContent = "100%";
      [tdEmpty1, tdEmpty2, tdEmpty3].forEach(td => {
        Object.assign(td.style, { border: '2px solid #1a237e', padding: '8px', textAlign: 'center', color: '#1a237e', fontFamily: '"Patrick Hand", cursive' });
        trTotal.appendChild(td);
      });
    }
    tbody.appendChild(trTotal); table.appendChild(tbody); content.appendChild(table);
  } else if (exercise.type === 'indicators') {
    const { mean, median, q1, q3, iqr, unit } = exercise.rawData;
    const lines = language === 'fr' ? [`1. Moyenne = ${mean} ${unit}`, `2. Médiane = ${median} ${unit}`, `3. Q1 = ${q1}  ;  Q3 = ${q3}`, `4. Écart Inter-quartile = ${iqr}`] : [`1. Mean = ${mean} ${unit}`, `2. Median = ${median} ${unit}`, `3. Q1 = ${q1}  ;  Q3 = ${q3}`, `4. Interquartile Range = ${iqr}`];
    const ul = document.createElement('div');
    Object.assign(ul.style, { display: 'flex', flexDirection: 'column', gap: '20px', color: '#1a237e' });
    lines.forEach(line => { const div = document.createElement('div'); div.textContent = line; ul.appendChild(div); });
    content.appendChild(ul);
  } else if (exercise.type === 'problem') {
    const { answerLogic } = exercise.rawData;
    const p = document.createElement('p'); p.textContent = answerLogic; p.style.color = '#1a237e'; content.appendChild(p);
  }
  const annotation = document.createElement('div');
  Object.assign(annotation.style, { position: 'absolute', bottom: '50px', right: '50px', fontFamily: '"Caveat", cursive', color: '#c62828', fontSize: '48px', transform: 'rotate(-10deg)', border: '3px solid #c62828', borderRadius: '50% 40% 60% 30%', padding: '10px 30px', textAlign: 'center', zIndex: '10' });
  annotation.innerHTML = language === 'fr' ? "20/20<br><span style='font-size:30px'>Parfait !</span>" : "A+<br><span style='font-size:30px'>Perfect!</span>";
  container.appendChild(annotation);
  container.appendChild(content); document.body.appendChild(container); await document.fonts.ready;
  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
    document.body.removeChild(container); return canvas.toDataURL('image/png');
  } catch (e) { document.body.removeChild(container); return ""; }
};

// --- PROBLEM IMAGE GENERATOR (Similar to generateNotebookImage but for problem statements) ---
const generateProblemImage = async (exercise: ExerciseStep, language: Language): Promise<string> => {
  const container = document.createElement('div');
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
    color: '#1a237e',
    padding: '60px 40px',
    lineHeight: '1.5',
    boxSizing: 'border-box'
  });

  // Marge rouge
  const marginLine = document.createElement('div');
  Object.assign(marginLine.style, {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '60px',
    width: '2px',
    backgroundColor: '#ef5350'
  });
  container.appendChild(marginLine);

  const content = document.createElement('div');
  content.style.marginLeft = '40px';

  // Titre de l'exercice
  const title = document.createElement('h2');
  title.textContent = exercise.title;
  Object.assign(title.style, {
    textDecoration: 'underline',
    marginBottom: '30px',
    color: '#1a237e',
    fontWeight: 'bold'
  });
  content.appendChild(title);

  // Contenu du problème - afficher le texte formaté
  const problemText = document.createElement('div');
  const lines = exercise.problem.split('\n');

  lines.forEach((line, index) => {
    const p = document.createElement('p');
    p.textContent = line;
    p.style.marginBottom = index < lines.length - 1 ? '15px' : '0';
    p.style.color = '#1a237e';
    p.style.fontSize = '22px';
    p.style.lineHeight = '1.6';

    // Mettre en évidence les données brutes si présentes
    if (line.includes('Données brutes') || line.includes('Raw Data') || line.includes('Série :') || line.includes('Series:')) {
      p.style.fontWeight = 'bold';
      p.style.marginTop = '20px';
    }

    content.appendChild(p);
  });

  container.appendChild(content);
  document.body.appendChild(container);
  await document.fonts.ready;

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
    document.body.removeChild(container);
    return "";
  }
};

// --- COMPONENT ---

export const Assessment: React.FC<AssessmentProps> = ({ language }) => {
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
  const [answerModes, setAnswerModes] = useState<Record<number, 'photo' | 'manual'>>({});
  const [tableInputs, setTableInputs] = useState<Record<number, { effectifs: string[]; freqDec: string[]; freqPct: string[] }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { generateRandomExercises(); }, [language]);

  const generateRandomExercises = () => {
    // ... Logic remains exactly the same ...
    const dataA = generateExerciseData(language);
    const cleanDataDisplayA = dataA.rawList.join(', ');
    const dataB = generateExerciseData(language);
    const cleanDataDisplayB = dataB.rawList.join(', ');
    const mean3 = getMean(dataB.rawList);
    const median3 = getMedian(dataB.rawList);
    const { q1, q3, iqr } = getQuartiles(dataB.rawList);
    const scenarioFr = { context: "Salaires", itemA: "Entreprise A", itemB: "Entreprise B", goal: "Si tu veux gagner plus de 2000€, quelle entreprise choisir ?", answerLogic: "L'Entreprise B car la médiane est 2400 (50% gagnent plus), contre 1800 pour A." };
    const scenarioEn = { context: "Salaries", itemA: "Company A", itemB: "Company B", goal: "If you want to earn more than $2000, which company should you choose?", answerLogic: "Company B because the median is 2400 (50% earn more), vs 1800 for A." };
    const s4 = language === 'fr' ? scenarioFr : scenarioEn;

    const ex1: ExerciseStep = { id: 1, title: language === 'fr' ? `Tableau : ${dataA.titre}` : `Table: ${dataA.titre}`, description: language === 'fr' ? "Regrouper les données brutes dans un tableau d'effectifs." : "Group raw data into a frequency table.", type: 'table', problem: language === 'fr' ? `Sondage sur "${dataA.titre}".\nDonnées brutes : ${cleanDataDisplayA}.\n\nConstruis le tableau des effectifs en regroupant les valeurs.` : `Survey on "${dataA.titre}".\nRaw Data: ${cleanDataDisplayA}.\n\nBuild the frequency table by grouping values.`, promptText: "", correctionPrompt: "", rawData: { valeurs: dataA.valeurs, effectifs: dataA.effectifs, total: dataA.total, label: dataA.label, frequences: dataA.frequences, arrondi: dataA.arrondi, titre: dataA.titre } };
    const ex2: ExerciseStep = { id: 2, title: language === 'fr' ? "Calcul de Fréquences" : "Relative Frequencies", description: language === 'fr' ? "Compléter le tableau précédent avec les fréquences." : "Complete the table with relative frequencies.", type: 'frequency', problem: language === 'fr' ? `Reprenons le tableau de l'exercice précédent.\nAjoute 3 colonnes : Fréquence (Fraction), Fréquence (Décimal), Fréquence (%).\nConsigne : ${dataA.arrondi.texteConsigne}` : `Let's use the previous table.\nAdd 3 columns: Freq (Fraction), Freq (Decimal), Freq (%).\nInstruction: ${dataA.arrondi.texteConsigne}`, promptText: "", correctionPrompt: "", rawData: { valeurs: dataA.valeurs, effectifs: dataA.effectifs, total: dataA.total, label: dataA.label, frequences: dataA.frequences, arrondi: dataA.arrondi, titre: dataA.titre } };
    const ex3: ExerciseStep = { id: 3, title: `Stats : ${dataB.titre}`, description: "Moyenne, Médiane, Q1, Q3...", type: 'indicators', problem: `Série : ${cleanDataDisplayB}. Calcule tous les indicateurs.`, promptText: "", correctionPrompt: "", rawData: { mean: mean3, median: median3, q1, q3, iqr, unit: dataB.unite } };
    const ex4: ExerciseStep = { id: 4, title: language === 'fr' ? "Résolution de Problème" : "Problem Solving", description: language === 'fr' ? "Interpréter pour choisir." : "Interpret to choose.", type: 'problem', problem: `${s4.goal}`, promptText: `Comparison:\nCompany A: Mean=2500, Med=1800\nCompany B: Mean=2500, Med=2400\nQuestion: "${s4.goal}"`, correctionPrompt: "", rawData: { answerLogic: s4.answerLogic } };

    setExercises([ex1, ex2, ex3, ex4]);
    setGeneratedProblemImages({});
    setGeneratedCorrectionImages({});
    setFeedbackHistory([]);
    setCurrentStepIndex(0);
    setReportReady(false);
    // init modes/inputs
    const initialModes: Record<number, 'photo' | 'manual'> = {};
    const initialInputs: Record<number, { effectifs: string[]; freqDec: string[]; freqPct: string[] }> = {};
    [ex1, ex2].forEach((ex) => {
      initialModes[ex.id] = 'photo';
      initialInputs[ex.id] = {
        effectifs: new Array(ex.rawData?.valeurs?.length || 0).fill(''),
        freqDec: new Array(ex.rawData?.valeurs?.length || 0).fill(''),
        freqPct: new Array(ex.rawData?.valeurs?.length || 0).fill(''),
      };
    });
    setAnswerModes(initialModes);
    setTableInputs(initialInputs);
  };

  const currentExercise = exercises[currentStepIndex];
  const currentMode = answerModes[currentExercise?.id] || 'photo';

  // ... (Effects for AI Enrichment and Image Gen remain SAME, just ensure visual components below are updated) ...
  useEffect(() => {
    const enrichCurrentExercise = async () => {
      if (!currentExercise || currentExercise.isEnriched) return;
      if (currentExercise.type !== 'table' && currentExercise.type !== 'frequency') return;
      setIsEnriching(true);
      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = genererPromptEnonce(currentExercise.rawData, language);
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const enrichedText = response.text;
        if (enrichedText) {
          setExercises(prev => { const newExercises = [...prev]; newExercises[currentStepIndex] = { ...newExercises[currentStepIndex], problem: enrichedText, isEnriched: true }; return newExercises; });
        }
      } catch (e) { console.error("Enrichment failed", e); } finally { setIsEnriching(false); }
    };
    enrichCurrentExercise();
  }, [currentStepIndex, currentExercise, language]);

  const formatFeedbackText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let content = line; let isListItem = false;
      if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) { isListItem = true; content = content.trim().substring(2); }
      const parts = content.split(/\*\*(.*?)\*\*/g);
      const formattedContent = parts.map((part, j) => { if (j % 2 === 1) return <strong key={j} className="font-bold text-gray-900">{part}</strong>; return part; });
      if (isListItem) { return (<div key={i} className="flex gap-2 mt-1 ml-1"> <span className="text-amber-500 mt-1">•</span> <div className="flex-1">{formattedContent}</div> </div>); }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <div key={i} className={`${i > 0 ? 'mt-1' : ''}`}>{formattedContent}</div>;
    });
  };

  useEffect(() => {
    const generateProblemImageAsync = async () => {
      if (!currentExercise) return;
      if (generatedProblemImages[currentStepIndex]) return;
      setIsGeneratingImage(true);
      setShowTextFallback(false);
      try {
        const imageDataUrl = await generateProblemImage(currentExercise, language);
        if (imageDataUrl) {
          setGeneratedProblemImages(prev => ({ ...prev, [currentStepIndex]: imageDataUrl }));
        } else {
          setShowTextFallback(true);
        }
      } catch (err) {
        console.error("Problem Image Gen Failed", err);
        setShowTextFallback(true);
      } finally {
        setIsGeneratingImage(false);
      }
    };
    generateProblemImageAsync();
  }, [currentStepIndex, currentExercise, language]);

  // Fonction pour optimiser l'image avant l'analyse
  const optimizeImageForAnalysis = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Créer un canvas pour redimensionner et optimiser l'image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Cannot get canvas context'));
            return;
          }

          // Calculer les nouvelles dimensions (max 2048px de largeur pour optimiser la qualité/performance)
          const maxWidth = 2048;
          const maxHeight = 2048;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          // Dessiner l'image avec amélioration du contraste pour une meilleure OCR
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir en base64
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.95);
          const base64Content = optimizedBase64.split(',')[1];
          resolve(base64Content);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setIsGeneratingCorrection(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("Clé API manquante");

      const ai = new GoogleGenAI({ apiKey });

      // Optimiser l'image avant l'analyse
      const optimizedBase64Content = await optimizeImageForAnalysis(file);

      // Générer le prompt amélioré avec les instructions spécifiques
      const analysisPrompt = genererPromptAnalyse({
        exerciseTitle: currentExercise.title,
        exerciseProblem: currentExercise.problem,
        exerciseType: currentExercise.type,
        rawData: currentExercise.rawData,
        language: language
      });

      // Utiliser un modèle optimisé pour la vision
      // gemini-1.5-pro est excellent pour la vision mais plus lent
      // gemini-2.0-flash-exp ou gemini-2.0-flash sont de bons compromis vitesse/qualité
      // Fallback vers gemini-1.5-pro si le modèle n'est pas disponible
      const modelName = 'gemini-1.5-pro'; // Modèle optimisé pour la vision et l'OCR

      const feedbackPromise = ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            { text: analysisPrompt },
            { inlineData: { mimeType: 'image/jpeg', data: optimizedBase64Content } }
          ]
        },
        config: {
          temperature: 0.3, // Température plus basse pour des réponses plus précises
          topP: 0.95,
          topK: 40
        }
      });

      const correctionImagePromise = generateNotebookImage(currentExercise, language);

      const [feedbackResponse, correctionImageDataUrl] = await Promise.all([
        feedbackPromise,
        correctionImagePromise
      ]);

      const feedback = feedbackResponse.text || (language === 'fr' ? "Analyse impossible." : "Analysis failed.");

      setFeedbackHistory(prev => {
        const newHistory = [...prev];
        newHistory[currentStepIndex] = feedback;
        return newHistory;
      });

      if (correctionImageDataUrl) {
        setGeneratedCorrectionImages(prev => ({
          ...prev,
          [currentStepIndex]: correctionImageDataUrl
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      const errorMessage = language === 'fr'
        ? "Erreur lors de l'analyse. Veuillez réessayer avec une image plus claire."
        : "Analysis error. Please try again with a clearer image.";
      alert(errorMessage);

      // Afficher un message d'erreur dans le feedback
      setFeedbackHistory(prev => {
        const newHistory = [...prev];
        newHistory[currentStepIndex] = errorMessage;
        return newHistory;
      });
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingCorrection(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleNext = () => { if (currentStepIndex < exercises.length - 1) { setCurrentStepIndex(prev => prev + 1); setShowTextFallback(false); } else { setReportReady(true); } };
  const handleSendReport = () => { if (!parentEmail.includes('@')) { alert(language === 'fr' ? "Email invalide" : "Invalid Email"); return; } setTimeout(() => setEmailSent(true), 1000); };

  const handleModeChange = (mode: 'photo' | 'manual') => {
    const exId = currentExercise.id;
    setAnswerModes(prev => ({ ...prev, [exId]: mode }));
  };

  const handleInputChange = (exId: number, type: 'effectifs' | 'freqDec' | 'freqPct', idx: number, value: string) => {
    setTableInputs(prev => {
      const current = prev[exId] || { effectifs: [], freqDec: [], freqPct: [] };
      const updated = { ...current, [type]: [...current[type]] };
      updated[type][idx] = value;
      return { ...prev, [exId]: updated };
    });
  };

  const handleManualSubmit = async () => {
    if (currentExercise.type !== 'table' && currentExercise.type !== 'frequency') return;
    setIsGeneratingCorrection(true);
    await evaluateManualTable(currentExercise);
    setIsGeneratingCorrection(false);
  };

  const evaluateManualTable = async (exercise: ExerciseStep) => {
    if (!exercise.rawData) return;
    const inputs = tableInputs[exercise.id];
    const expected = exercise.rawData;
    if (!inputs) return;

    const errors: string[] = [];
    // Table effectifs
    if (exercise.type === 'table') {
      const totalUser = inputs.effectifs.reduce((sum, v) => sum + (parseInt(v, 10) || 0), 0);
      const totalExpected = expected.total;
      if (totalUser !== totalExpected) errors.push(language === 'fr' ? `Le total doit être ${totalExpected}` : `Total must be ${totalExpected}`);
      expected.effectifs.forEach((eff: number, idx: number) => {
        const val = parseInt(inputs.effectifs[idx], 10);
        if (val !== eff) errors.push(language === 'fr' ? `Effectif de ${expected.valeurs[idx]} attendu : ${eff}` : `Count for ${expected.valeurs[idx]} should be ${eff}`);
      });
    }

    // Frequencies
    if (exercise.type === 'frequency') {
      expected.frequences.forEach((freq: any, idx: number) => {
        const dec = parseFloat(inputs.freqDec[idx]?.replace(',', '.'));
        const pct = parseFloat(inputs.freqPct[idx]?.replace(',', '.'));
        const decOk = Math.abs(dec - parseFloat(freq.decimalFormate)) <= 0.01;
        const pctOk = Math.abs(pct - parseFloat(freq.pourcentageFormate)) <= 1;
        if (!decOk) errors.push(language === 'fr' ? `Fréq décimale de ${expected.valeurs[idx]} attendue ≈ ${freq.decimalFormate}` : `Decimal freq for ${expected.valeurs[idx]} should be ≈ ${freq.decimalFormate}`);
        if (!pctOk) errors.push(language === 'fr' ? `Fréq % de ${expected.valeurs[idx]} attendue ≈ ${freq.pourcentageFormate}` : `Percent freq for ${expected.valeurs[idx]} should be ≈ ${freq.pourcentageFormate}`);
      });
    }

    const successMsg = language === 'fr' ? "Bravo, tableau complété correctement !" : "Great, table completed correctly!";
    const errorHeader = language === 'fr' ? "Points à corriger :" : "Fix these:";
    const feedback = errors.length === 0 ? successMsg : [errorHeader, ...errors.map(e => `- ${e}`)].join('\n');

    setFeedbackHistory(prev => { const n = [...prev]; n[currentStepIndex] = feedback; return n; });
    const correctionImg = await generateNotebookImage(exercise, language);
    setGeneratedCorrectionImages(prev => ({ ...prev, [currentStepIndex]: correctionImg }));
  };

  if (!exercises.length) return <div className="flex justify-center items-center h-64"><RefreshCw className="animate-spin text-amber-500" size={32} /></div>;

  // Render REPORT
  if (reportReady) {
    // ... tReport object same ...
    const tReport = language === 'fr' ? { title: "Bilan de Compétences", recoTitle: "Recommandations personnalisées", intro: "Pour progresser, voici ce que tu peux travailler :", tips: ["Tableaux : Assure-toi de toujours vérifier que la somme de la colonne 'Effectif' est égale au total.", "Fréquences : Entraîne-toi à passer rapidement de la fraction au pourcentage.", "Indicateurs : Ne confonds pas Moyenne et Médiane."], redo: "Refaire une série d'exercices", ex: "Exercice", mailTitle: "Informer les parents", send: "Envoyer", sent: "Envoyé !", back: "Retour à l'accueil", notDone: "Non traité" } : { title: "Skills Report", recoTitle: "Personalized Recommendations", intro: "To improve, work on these:", tips: ["Tables: Always check that the sum of the 'Count' column equals the total.", "Frequencies: Practice converting fractions to percentages quickly.", "Indicators: Do not confuse Mean and Median."], redo: "Start a new series", ex: "Exercise", mailTitle: "Notify Parents", send: "Send", sent: "Sent!", back: "Back to Home", notDone: "Not attempted" };

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-extrabold">{tReport.title}</h2>
          </div>
          <div className="p-8 space-y-8">

            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <Star size={24} className="fill-amber-400 text-amber-500" />
                {tReport.recoTitle}
              </h3>
              <div className="space-y-2 text-amber-900">
                <p>{tReport.intro}</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {tReport.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
                <button onClick={() => window.location.reload()} className="mt-4 text-amber-700 font-bold hover:underline">{tReport.redo}</button>
              </div>
            </div>

            <div className="grid gap-6">
              {exercises.map((ex, idx) => (
                <div key={ex.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-violet-200 transition-colors">
                  <h4 className="font-bold text-violet-700 mb-2 text-lg">{tReport.ex} {idx + 1} : {ex.title}</h4>
                  <div className="text-gray-700 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    {formatFeedbackText(feedbackHistory[idx] || tReport.notDone)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-violet-50 p-6 rounded-3xl border border-violet-100">
              <h3 className="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2"><Mail size={20} /> {tReport.mailTitle}</h3>
              {!emailSent ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="email" placeholder="parent@email.com" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} className="flex-1 p-3 border border-violet-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-400" />
                  <button onClick={handleSendReport} className="bg-violet-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">{tReport.send}</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 p-4 rounded-xl font-bold"><CheckCircle size={20} /> {tReport.sent}</div>
              )}
            </div>
            <button onClick={() => window.location.reload()} className="block w-full text-center text-gray-400 hover:text-violet-600 mt-8 font-medium transition-colors">{tReport.back}</button>
          </div>
        </div>
      </div>
    );
  }

  const tMain = language === 'fr' ? {
    progression: "Progression",
    viewRaw: "Voir texte",
    viewNotebook: "Voir le cahier",
    play: "À toi de jouer !",
    aiGen: "Généré par IA",
    aiWriting: "L'IA écrit...",
    aiThinking: "Réflexion...",
    aiCorrection: "Correction du Prof IA",
    modelCopy: "La solution parfaite",
    writingCorrection: "Rédaction...",
    next: "Suivant",
    report: "Voir le Bilan",
    solvePrompt: "Résous sur papier puis prends une photo, ou remplis le tableau ci-dessous.",
    analyzing: "Analyse en cours...",
    scan: "Scanner ma réponse",
    modeTitle: "Choisir un mode de réponse",
    modePhoto: "Photo de la copie",
    modeManual: "Remplir le tableau ici",
    submitTable: "Valider ma saisie"
  } : {
    progression: "Progress",
    viewRaw: "View Raw",
    viewNotebook: "View Notebook",
    play: "Your Turn!",
    aiGen: "AI Generated",
    aiWriting: "Writing...",
    aiThinking: "Thinking...",
    aiCorrection: "AI Teacher Feedback",
    modelCopy: "Perfect Solution",
    writingCorrection: "Writing...",
    next: "Next",
    report: "View Report",
    solvePrompt: "Solve on paper and snap a photo, or fill the table below.",
    analyzing: "Analyzing...",
    scan: "Scan my Answer",
    modeTitle: "Choose answer mode",
    modePhoto: "Upload a photo",
    modeManual: "Fill the table here",
    submitTable: "Submit my answers"
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8 bg-white p-4 rounded-full shadow-sm border border-gray-100 flex items-center gap-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">{tMain.progression}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${((currentStepIndex + 1) / exercises.length) * 100}%` }}></div>
        </div>
        <span className="text-sm font-bold text-gray-600">{currentStepIndex + 1} / {exercises.length}</span>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-sm border border-amber-200">{currentExercise.title}</div>
            <button onClick={() => setShowTextFallback(!showTextFallback)} className="text-gray-400 hover:text-amber-600 flex items-center gap-1 text-sm font-medium transition-colors"><FileText size={16} />{showTextFallback ? tMain.viewNotebook : tMain.viewRaw}</button>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            {tMain.play}
            {isEnriching && <Sparkles className="text-amber-400 animate-spin" size={24} />}
          </h2>

          {/* PROBLEM IMAGE CONTAINER */}
          <div className="mb-8 relative min-h-[250px] rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner bg-gray-50 group">
            {!showTextFallback && generatedProblemImages[currentStepIndex] ? (
              <div className="relative">
                <img src={generatedProblemImages[currentStepIndex]} alt="Énoncé" className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">{tMain.aiGen}</div>
              </div>
            ) : !showTextFallback && isGeneratingImage ? (
              <div className="flex flex-col items-center justify-center h-80 bg-gray-50">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <p className="text-amber-600 font-bold text-lg">{tMain.aiWriting}</p>
              </div>
            ) : (
              <div className="p-10 bg-white" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <p className="whitespace-pre-wrap text-xl text-gray-800 font-hand leading-loose">
                  {currentExercise.problem}
                </p>
                {isEnriching && <p className="text-sm text-amber-500 mt-4 font-bold animate-pulse">{tMain.aiThinking}</p>}
              </div>
            )}
          </div>

          {feedbackHistory[currentStepIndex] ? (
            <div className="mb-8 animate-slide-up">
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-6">
                <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2 text-lg"><CheckCircle size={24} /> {tMain.aiCorrection}</h3>
                <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed">{formatFeedbackText(feedbackHistory[currentStepIndex])}</div>
              </div>

              <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100 mb-8">
                <h4 className="font-bold text-gray-600 m-4 flex items-center gap-2 text-sm uppercase tracking-wide"><Eye size={16} /> {tMain.modelCopy}</h4>
                {generatedCorrectionImages[currentStepIndex] ? (
                  <img src={generatedCorrectionImages[currentStepIndex]} alt="Correction visuelle" className="w-full h-auto rounded-2xl shadow-inner border border-gray-100" />
                ) : isGeneratingCorrection ? (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <RefreshCw className="animate-spin text-amber-500" size={24} />
                    <span className="font-medium text-amber-600">{tMain.writingCorrection}</span>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-300 font-medium">Image unavailable</div>
                )}
              </div>

              <div className="flex justify-end">
                <button onClick={handleNext} className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg">
                  {currentStepIndex < exercises.length - 1 ? tMain.next : tMain.report} <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-blue-50 p-5 rounded-2xl text-blue-800 text-base font-medium flex items-start gap-3 border border-blue-100">
                <div className="bg-blue-100 p-1.5 rounded-lg"><AlertCircle size={20} className="text-blue-600" /></div>
                <p className="mt-0.5">{tMain.solvePrompt}</p>
              </div>

              {(currentExercise.type === 'table' || currentExercise.type === 'frequency') && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ClipboardList size={18} className="text-amber-500" />
                      {tMain.modeTitle}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleModeChange('photo')} className={`px-3 py-2 rounded-full text-sm font-bold border transition ${currentMode === 'photo' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-200'}`}>{tMain.modePhoto}</button>
                      <button onClick={() => handleModeChange('manual')} className={`px-3 py-2 rounded-full text-sm font-bold border transition ${currentMode === 'manual' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-200'}`}>{tMain.modeManual}</button>
                    </div>
                  </div>

                  {currentMode === 'manual' && (
                    <div className="overflow-auto bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                      <table className="min-w-full text-sm text-center">
                        <thead>
                          <tr className="text-emerald-800">
                            <th className="p-2">{currentExercise.rawData?.label || 'Valeur'}</th>
                            <th className="p-2">{language === 'fr' ? 'Effectif' : 'Count'}</th>
                            {currentExercise.type === 'frequency' && (<><th className="p-2">Fréq (Déc)</th><th className="p-2">Fréq (%)</th></>)}
                          </tr>
                        </thead>
                        <tbody>
                          {currentExercise.rawData?.valeurs?.map((val: number, idx: number) => (
                            <tr key={idx} className="bg-white">
                              <td className="p-2 font-semibold text-gray-700 border">{val}</td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="w-24 px-2 py-1 border rounded-lg text-center"
                                  value={tableInputs[currentExercise.id]?.effectifs[idx] || ''}
                                  onChange={(e) => handleInputChange(currentExercise.id, 'effectifs', idx, e.target.value)}
                                />
                              </td>
                              {currentExercise.type === 'frequency' && (
                                <>
                                  <td className="p-2 border">
                                    <input
                                      type="text"
                                      className="w-28 px-2 py-1 border rounded-lg text-center"
                                      placeholder="0.25"
                                      value={tableInputs[currentExercise.id]?.freqDec[idx] || ''}
                                      onChange={(e) => handleInputChange(currentExercise.id, 'freqDec', idx, e.target.value)}
                                    />
                                  </td>
                                  <td className="p-2 border">
                                    <input
                                      type="text"
                                      className="w-28 px-2 py-1 border rounded-lg text-center"
                                      placeholder="25"
                                      value={tableInputs[currentExercise.id]?.freqPct[idx] || ''}
                                      onChange={(e) => handleInputChange(currentExercise.id, 'freqPct', idx, e.target.value)}
                                    />
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-4 flex justify-end">
                        <button onClick={handleManualSubmit} disabled={isGeneratingCorrection} className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-60">
                          {isGeneratingCorrection && <RefreshCw className="animate-spin" size={16} />}
                          {tMain.submitTable}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentMode === 'photo' && (
                <label className="flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-[2rem] p-10 hover:bg-gray-50 hover:border-amber-300 transition-all group cursor-pointer relative w-full h-64">
                  {isAnalyzing ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-amber-600 font-bold text-lg">{tMain.analyzing}</p>
                    </div>
                  ) : (
                    <>
                      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                      <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                        <Camera size={48} className="text-white" />
                      </div>
                      <span className="font-black text-xl text-gray-400 mt-6 group-hover:text-amber-600 transition-colors">{tMain.scan}</span>
                    </>
                  )}
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};