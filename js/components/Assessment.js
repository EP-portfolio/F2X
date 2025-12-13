import { generateExerciseData } from '../utils/exerciseGenerator.js';
import { genererPromptAnalyse } from '../utils/prompts.js';

let assessmentState = {
  exercises: [],
  currentStepIndex: 0,
  isAnalyzing: false,
  feedbackHistory: [],
  reportReady: false,
  parentEmail: '',
  emailSent: false,
  generatedProblemImages: {},
  isGeneratingImage: false,
  showTextFallback: false
};

function getMean(nums) {
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
}

function getMedian(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2);
}

function getQuartiles(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  const q1Index = Math.ceil(n / 4) - 1;
  const q3Index = Math.ceil((3 * n) / 4) - 1;
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  return { q1, q3, iqr: q3 - q1 };
}

function generateRandomExercises(language) {
  const dataA = generateExerciseData(language);
  const cleanDataDisplayA = dataA.rawList.join(', ');
  const dataB = generateExerciseData(language);
  const cleanDataDisplayB = dataB.rawList.join(', ');
  const mean3 = getMean(dataB.rawList);
  const median3 = getMedian(dataB.rawList);
  const { q1, q3, iqr } = getQuartiles(dataB.rawList);
  
  // Reset images
  assessmentState.generatedProblemImages = {};
  assessmentState.showTextFallback = false;
  assessmentState.isGeneratingImage = false;
  
  const scenarioFr = { 
    context: "Salaires", 
    itemA: "Entreprise A", 
    itemB: "Entreprise B", 
    goal: "Si tu veux gagner plus de 2000€, quelle entreprise choisir ?", 
    answerLogic: "L'Entreprise B car la médiane est 2400 (50% gagnent plus), contre 1800 pour A." 
  };
  const scenarioEn = { 
    context: "Salaries", 
    itemA: "Company A", 
    itemB: "Company B", 
    goal: "If you want to earn more than $2000, which company should you choose?", 
    answerLogic: "Company B because the median is 2400 (50% earn more), vs 1800 for A." 
  };
  const s4 = language === 'fr' ? scenarioFr : scenarioEn;

  const ex1 = { 
    id: 1, 
    title: language === 'fr' ? `Tableau : ${dataA.titre}` : `Table: ${dataA.titre}`, 
    description: language === 'fr' ? "Regrouper les données brutes dans un tableau d'effectifs." : "Group raw data into a frequency table.", 
    type: 'table', 
    problem: language === 'fr' 
      ? `Sondage sur "${dataA.titre}".\nDonnées brutes : ${cleanDataDisplayA}.` 
      : `Survey on "${dataA.titre}".\nRaw Data: ${cleanDataDisplayA}.`, 
    rawData: { valeurs: dataA.valeurs, effectifs: dataA.effectifs, total: dataA.total, label: dataA.label, frequences: dataA.frequences, arrondi: dataA.arrondi, titre: dataA.titre } 
  };
  
  const ex2 = { 
    id: 2, 
    title: language === 'fr' ? "Calcul de Fréquences" : "Relative Frequencies", 
    description: language === 'fr' ? "Compléter le tableau précédent avec les fréquences." : "Complete the table with relative frequencies.", 
    type: 'frequency', 
    problem: language === 'fr' 
      ? `Reprenons le tableau de l'exercice précédent.\nAjoute 3 colonnes : Fréquence (Fraction), Fréquence (Décimal), Fréquence (%).\nConsigne : Arrondis les fréquences décimales au centième et les fréquences en % à l'unité.` 
      : `Let's use the previous table.\nAdd 3 columns: Freq (Fraction), Freq (Decimal), Freq (%).\nInstruction: Round decimal frequencies to the hundredth and percentage frequencies to the unit.`, 
    rawData: { valeurs: dataA.valeurs, effectifs: dataA.effectifs, total: dataA.total, label: dataA.label, frequences: dataA.frequences, arrondi: dataA.arrondi, titre: dataA.titre } 
  };
  
  const ex3 = { 
    id: 3, 
    title: `Stats : ${dataB.titre}`, 
    description: "Moyenne, Médiane, Q1, Q3...", 
    type: 'indicators', 
    problem: language === 'fr' 
      ? `Série : ${cleanDataDisplayB}. Calcule tous les indicateurs.` 
      : `Series: ${cleanDataDisplayB}. Calculate all indicators.`, 
    rawData: { mean: mean3, median: median3, q1, q3, iqr, unit: dataB.unite } 
  };
  
  const ex4 = { 
    id: 4, 
    title: language === 'fr' ? "Résolution de Problème" : "Problem Solving", 
    description: language === 'fr' ? "Interpréter pour choisir." : "Interpret to choose.", 
    type: 'problem', 
    problem: `${s4.goal}`, 
    rawData: { answerLogic: s4.answerLogic } 
  };

  assessmentState.exercises = [ex1, ex2, ex3, ex4];
  assessmentState.feedbackHistory = [];
  assessmentState.currentStepIndex = 0;
  assessmentState.reportReady = false;
}

// Generate problem image with notebook style
async function generateProblemImage(exercise, language) {
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

  // Contenu du problème
  const problemText = document.createElement('div');
  const lines = exercise.problem.split('\n');

  lines.forEach((line, index) => {
    const p = document.createElement('p');
    p.textContent = line;
    p.style.marginBottom = index < lines.length - 1 ? '15px' : '0';
    p.style.color = '#1a237e';
    p.style.fontSize = '22px';
    p.style.lineHeight = '1.6';

    // Mettre en évidence les données brutes
    if (line.includes('Données brutes') || line.includes('Raw Data') || line.includes('Série :') || line.includes('Series:')) {
      p.style.fontWeight = 'bold';
      p.style.marginTop = '20px';
    }

    content.appendChild(p);
  });

  // Ajouter un tableau d'exemple pour les exercices de type 'table' et 'frequency'
  if (exercise.type === 'table' || exercise.type === 'frequency') {
    const { valeurs, label } = exercise.rawData;
    
    // Texte d'instruction pour le tableau
    const tableInstruction = document.createElement('p');
    tableInstruction.textContent = language === 'fr' 
      ? 'Complète le tableau suivant :' 
      : 'Complete the following table:';
    tableInstruction.style.marginTop = '20px';
    tableInstruction.style.marginBottom = '15px';
    tableInstruction.style.fontWeight = 'bold';
    tableInstruction.style.color = '#1a237e';
    content.appendChild(tableInstruction);

    // Créer le tableau d'exemple
    const table = document.createElement('table');
    Object.assign(table.style, {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      marginBottom: '20px',
      backgroundColor: 'transparent',
      color: '#1a237e',
      border: '2px solid #1a237e'
    });

    // En-têtes du tableau
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [label, language === 'fr' ? "Effectif" : "Count"];
    
    if (exercise.type === 'frequency') {
      if (language === 'fr') {
        headers.push('Fréq (Frac)', 'Fréq (Déc)', 'Fréq (%)');
      } else {
        headers.push('Freq (Frac)', 'Freq (Dec)', 'Freq (%)');
      }
    }
    
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      Object.assign(th.style, {
        border: '2px solid #1a237e',
        padding: '12px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1a237e',
        fontFamily: '"Patrick Hand", cursive',
        fontSize: '20px',
        backgroundColor: '#e3f2fd'
      });
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corps du tableau avec cellules vides
    const tbody = document.createElement('tbody');
    valeurs.forEach((val, idx) => {
      const tr = document.createElement('tr');
      
      // Colonne valeur (remplie)
      const tdValue = document.createElement('td');
      tdValue.textContent = val.toString();
      Object.assign(tdValue.style, {
        border: '2px solid #1a237e',
        padding: '10px',
        textAlign: 'center',
        color: '#1a237e',
        fontFamily: '"Patrick Hand", cursive',
        fontSize: '20px'
      });
      tr.appendChild(tdValue);
      
      // Colonnes vides à remplir
      const emptyCellCount = exercise.type === 'frequency' ? 4 : 1;
      for (let i = 0; i < emptyCellCount; i++) {
        const tdEmpty = document.createElement('td');
        tdEmpty.textContent = '?';
        Object.assign(tdEmpty.style, {
          border: '2px solid #1a237e',
          padding: '10px',
          textAlign: 'center',
          color: '#90caf9',
          fontFamily: '"Patrick Hand", cursive',
          fontSize: '20px',
          fontStyle: 'italic',
          backgroundColor: '#f5f5f5'
        });
        tr.appendChild(tdEmpty);
      }
      
      tbody.appendChild(tr);
    });

    // Ligne TOTAL
    const trTotal = document.createElement('tr');
    const tdTitle = document.createElement('td');
    tdTitle.textContent = "TOTAL";
    Object.assign(tdTitle.style, {
      border: '2px solid #1a237e',
      padding: '10px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#1a237e',
      fontFamily: '"Patrick Hand", cursive',
      fontSize: '20px',
      backgroundColor: '#fff9c4'
    });
    trTotal.appendChild(tdTitle);
    
    // Cellule TOTAL remplie
    const tdTotal = document.createElement('td');
    tdTotal.textContent = exercise.rawData.total.toString();
    Object.assign(tdTotal.style, {
      border: '2px solid #1a237e',
      padding: '10px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#1a237e',
      fontFamily: '"Patrick Hand", cursive',
      fontSize: '20px',
      backgroundColor: '#fff9c4'
    });
    trTotal.appendChild(tdTotal);
    
    // Cellules vides pour TOTAL si frequency
    if (exercise.type === 'frequency') {
      for (let i = 0; i < 3; i++) {
        const tdEmpty = document.createElement('td');
        tdEmpty.textContent = i === 0 ? '1' : (i === 1 ? '1' : '100%');
        Object.assign(tdEmpty.style, {
          border: '2px solid #1a237e',
          padding: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1a237e',
          fontFamily: '"Patrick Hand", cursive',
          fontSize: '20px',
          backgroundColor: '#fff9c4'
        });
        trTotal.appendChild(tdEmpty);
      }
    }
    
    tbody.appendChild(trTotal);
    table.appendChild(tbody);
    content.appendChild(table);
  }

  container.appendChild(content);
  document.body.appendChild(container);
  await document.fonts.ready;

  try {
    // Wait for html2canvas to be available (it's loaded via script tag)
    let attempts = 0;
    while (typeof html2canvas === 'undefined' && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (typeof html2canvas !== 'undefined') {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in cloned document
          const clonedContainer = clonedDoc.querySelector('div[style*="Patrick Hand"]');
          if (clonedContainer) {
            clonedContainer.style.fontFamily = '"Patrick Hand", cursive';
          }
        }
      });
      if (container.parentNode) {
        document.body.removeChild(container);
      }
      return canvas.toDataURL('image/png');
    } else {
      console.warn('html2canvas not available, using text fallback');
      if (container.parentNode) {
        document.body.removeChild(container);
      }
      return null;
    }
  } catch (e) {
    console.error('Error generating problem image:', e);
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    return null;
  }
}

export function renderAssessment(language) {
  if (assessmentState.exercises.length === 0) {
    generateRandomExercises(language);
  }

  if (assessmentState.reportReady) {
    return renderReport(language);
  }

  const currentExercise = assessmentState.exercises[assessmentState.currentStepIndex];
  if (!currentExercise) return '<div class="p-8 text-center">Loading...</div>';

  // Generate problem image if not already generated
  if (!assessmentState.generatedProblemImages[assessmentState.currentStepIndex] && !assessmentState.isGeneratingImage) {
    assessmentState.isGeneratingImage = true;
    generateProblemImage(currentExercise, language).then(imageDataUrl => {
      if (imageDataUrl) {
        assessmentState.generatedProblemImages[assessmentState.currentStepIndex] = imageDataUrl;
      } else {
        assessmentState.showTextFallback = true;
      }
      assessmentState.isGeneratingImage = false;
      if (window.render) window.render();
    }).catch(err => {
      console.error("Problem Image Gen Failed", err);
      assessmentState.showTextFallback = true;
      assessmentState.isGeneratingImage = false;
      if (window.render) window.render();
    });
  }

  const t = language === 'fr' ? {
    progression: "Progression",
    play: "À toi de jouer !",
    solvePrompt: "Résous ça sur papier, puis prends une photo !",
    analyzing: "Analyse en cours...",
    scan: "Scanner ma réponse",
    next: "Suivant",
    report: "Voir le Bilan",
    aiCorrection: "Correction du Prof IA",
    aiGen: "Généré par IA",
    aiWriting: "L'IA écrit...",
    viewRaw: "Voir texte",
    viewNotebook: "Voir le cahier"
  } : {
    progression: "Progress",
    play: "Your Turn!",
    solvePrompt: "Solve on paper, then snap a photo!",
    analyzing: "Analyzing...",
    scan: "Scan my Answer",
    next: "Next",
    report: "View Report",
    aiCorrection: "AI Teacher Feedback",
    aiGen: "AI Generated",
    aiWriting: "Writing...",
    viewRaw: "View Raw",
    viewNotebook: "View Notebook"
  };

  const progress = ((assessmentState.currentStepIndex + 1) / assessmentState.exercises.length) * 100;
  const feedback = assessmentState.feedbackHistory[assessmentState.currentStepIndex];
  const problemImage = assessmentState.generatedProblemImages[assessmentState.currentStepIndex];

  return `
    <div class="max-w-3xl mx-auto p-4 md:p-8">
      <div class="mb-8 bg-white p-4 rounded-full shadow-sm border border-gray-100 flex items-center gap-4">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">${t.progression}</span>
        <div class="flex-1 bg-gray-100 rounded-full h-3">
          <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-sm" style="width: ${progress}%"></div>
        </div>
        <span class="text-sm font-bold text-gray-600">${assessmentState.currentStepIndex + 1} / ${assessmentState.exercises.length}</span>
      </div>

      <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white">
        <div class="p-6 md:p-8">
          <div class="flex justify-between items-start mb-6">
            <div class="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-sm border border-amber-200">
              ${currentExercise.title}
            </div>
            ${problemImage ? `
              <button 
                onclick="window.toggleTextFallback()"
                class="text-gray-400 hover:text-amber-600 flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
                ${assessmentState.showTextFallback ? t.viewNotebook : t.viewRaw}
              </button>
            ` : ''}
          </div>

          <h2 class="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            ${t.play}
          </h2>

          <div class="mb-8 relative min-h-[250px] rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner bg-gray-50 group">
            ${!assessmentState.showTextFallback && problemImage ? `
              <div class="relative">
                <img src="${problemImage}" alt="Énoncé" class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
                <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">${t.aiGen}</div>
              </div>
            ` : assessmentState.isGeneratingImage ? `
              <div class="flex flex-col items-center justify-center h-80 bg-gray-50">
                <div class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <p class="text-amber-600 font-bold text-lg">${t.aiWriting}</p>
              </div>
            ` : `
              <div class="p-10 bg-white" style="background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 24px 24px;">
                <p class="whitespace-pre-wrap text-xl text-gray-800 font-hand leading-loose">
                  ${currentExercise.problem}
                </p>
              </div>
            `}
          </div>

          ${feedback ? `
            <div class="mb-8 animate-slide-up">
              <div class="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-6">
                <h3 class="font-bold text-emerald-800 mb-4 flex items-center gap-2 text-lg">
                  <i data-lucide="check-circle" style="width: 24px; height: 24px;"></i> ${t.aiCorrection}
                </h3>
                <div class="prose prose-emerald max-w-none text-gray-700 leading-relaxed">
                  ${formatFeedbackText(feedback)}
                </div>
              </div>

              <div class="flex justify-end">
                <button 
                  onclick="window.handleAssessmentNext()"
                  class="flex items-center gap-3 bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
                >
                  ${assessmentState.currentStepIndex < assessmentState.exercises.length - 1 ? t.next : t.report}
                  <i data-lucide="chevron-right" style="width: 24px; height: 24px;"></i>
                </button>
              </div>
            </div>
          ` : `
            <div class="space-y-6 animate-slide-up">
              <div class="bg-blue-50 p-5 rounded-2xl text-blue-800 text-base font-medium flex items-start gap-3 border border-blue-100">
                <div class="bg-blue-100 p-1.5 rounded-lg">
                  <i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i>
                </div>
                <p class="mt-0.5">${t.solvePrompt}</p>
              </div>
              <label class="flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-[2rem] p-10 hover:bg-gray-50 hover:border-amber-300 transition-all group cursor-pointer relative w-full h-64">
                ${assessmentState.isAnalyzing ? `
                  <div class="text-center py-4">
                    <div class="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <p class="text-amber-600 font-bold text-lg">${t.analyzing}</p>
                  </div>
                ` : `
                  <input 
                    type="file" 
                    id="assessment-file-input"
                    accept="image/*" 
                    capture="environment" 
                    onchange="window.handleAssessmentUpload(event)"
                    class="hidden"
                  />
                  <div class="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    <i data-lucide="camera" style="width: 48px; height: 48px; color: white;"></i>
                  </div>
                  <span class="font-black text-xl text-gray-400 mt-6 group-hover:text-amber-600 transition-colors">${t.scan}</span>
                `}
              </label>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function formatFeedbackText(text) {
  if (!text) return '';
  return text.split('\n').map((line, i) => {
    let content = line;
    let isListItem = false;
    if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) {
      isListItem = true;
      content = content.trim().substring(2);
    }
    const parts = content.split(/\*\*(.*?)\*\*/g);
    const formattedContent = parts.map((part, j) => {
      if (j % 2 === 1) return `<strong class="font-bold text-gray-900">${part}</strong>`;
      return part;
    }).join('');
    if (isListItem) {
      return `<div class="flex gap-2 mt-1 ml-1"><span class="text-amber-500 mt-1">•</span><div class="flex-1">${formattedContent}</div></div>`;
    }
    if (line.trim() === '') return '<div class="h-2"></div>';
    return `<div class="${i > 0 ? 'mt-1' : ''}">${formattedContent}</div>`;
  }).join('');
}

function renderReport(language) {
  const tReport = language === 'fr' ? {
    title: "Bilan de Compétences",
    recoTitle: "Recommandations personnalisées",
    intro: "Pour progresser, voici ce que tu peux travailler :",
    tips: [
      "Tableaux : Assure-toi de toujours vérifier que la somme de la colonne 'Effectif' est égale au total.",
      "Fréquences : Entraîne-toi à passer rapidement de la fraction au pourcentage.",
      "Indicateurs : Ne confonds pas Moyenne et Médiane."
    ],
    redo: "Refaire une série d'exercices",
    ex: "Exercice",
    mailTitle: "Informer les parents",
    send: "Envoyer",
    sent: "Envoyé !",
    back: "Retour à l'accueil",
    notDone: "Non traité"
  } : {
    title: "Skills Report",
    recoTitle: "Personalized Recommendations",
    intro: "To improve, work on these:",
    tips: [
      "Tables: Always check that the sum of the 'Count' column equals the total.",
      "Frequencies: Practice converting fractions to percentages quickly.",
      "Indicators: Do not confuse Mean and Median."
    ],
    redo: "Start a new series",
    ex: "Exercise",
    mailTitle: "Notify Parents",
    send: "Send",
    sent: "Sent!",
    back: "Back to Home",
    notDone: "Not attempted"
  };

  return `
    <div class="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
          <div class="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <i data-lucide="check-circle" style="width: 48px; height: 48px; color: white;"></i>
          </div>
          <h2 class="text-4xl font-extrabold">${tReport.title}</h2>
        </div>
        <div class="p-8 space-y-8">
          <div class="bg-amber-50 p-6 rounded-3xl border border-amber-200">
            <h3 class="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <i data-lucide="star" class="fill-amber-400 text-amber-500" style="width: 24px; height: 24px;"></i>
              ${tReport.recoTitle}
            </h3>
            <div class="space-y-2 text-amber-900">
              <p>${tReport.intro}</p>
              <ul class="list-disc list-inside space-y-1 ml-2">
                ${tReport.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
              <button onclick="window.resetAssessment()" class="mt-4 text-amber-700 font-bold hover:underline">${tReport.redo}</button>
            </div>
          </div>

          <div class="grid gap-6">
            ${assessmentState.exercises.map((ex, idx) => `
              <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-violet-200 transition-colors">
                <h4 class="font-bold text-violet-700 mb-2 text-lg">${tReport.ex} ${idx + 1} : ${ex.title}</h4>
                <div class="text-gray-700 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  ${formatFeedbackText(assessmentState.feedbackHistory[idx] || tReport.notDone)}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="bg-violet-50 p-6 rounded-3xl border border-violet-100">
            <h3 class="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2">
              <i data-lucide="mail" style="width: 20px; height: 20px;"></i> ${tReport.mailTitle}
            </h3>
            ${!assessmentState.emailSent ? `
              <div class="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  id="parent-email"
                  placeholder="parent@email.com" 
                  value="${assessmentState.parentEmail}" 
                  onchange="window.updateParentEmail(this.value)"
                  class="flex-1 p-3 border border-violet-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-400"
                />
                <button 
                  onclick="window.sendReportEmail()"
                  class="bg-violet-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                >
                  ${tReport.send}
                </button>
              </div>
            ` : `
              <div class="flex items-center gap-2 text-emerald-700 bg-emerald-100 p-4 rounded-xl font-bold">
                <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i> ${tReport.sent}
              </div>
            `}
          </div>
          <button onclick="window.navigateTo('HOME')" class="block w-full text-center text-gray-400 hover:text-violet-600 mt-8 font-medium transition-colors">
            ${tReport.back}
          </button>
        </div>
      </div>
    </div>
  `;
}

window.handleAssessmentUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  assessmentState.isAnalyzing = true;
  if (window.render) window.render();

  try {
    const apiKey = window.API_KEY;
    if (!apiKey) {
      throw new Error("API Key missing. Please set window.API_KEY");
    }

    // Convert file to base64
    const base64Content = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
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
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.95);
          resolve(optimizedBase64.split(',')[1]);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    const currentExercise = assessmentState.exercises[assessmentState.currentStepIndex];
    const analysisPrompt = genererPromptAnalyse({
      exerciseTitle: currentExercise.title,
      exerciseProblem: currentExercise.problem,
      exerciseType: currentExercise.type,
      rawData: currentExercise.rawData,
      language: window.appState?.getState()?.language || 'fr'
    });

    if (typeof google !== 'undefined' && google.generativeai) {
      const genAI = new google.generativeai.GenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const result = await model.generateContent([
        { text: analysisPrompt },
        { inlineData: { mimeType: 'image/jpeg', data: base64Content } }
      ]);

      const response = await result.response;
      const lang = window.appState?.getState()?.language || 'fr';
      const feedback = response.text() || (lang === 'fr' ? "Analyse impossible." : "Analysis failed.");

      assessmentState.feedbackHistory[assessmentState.currentStepIndex] = feedback;
    } else {
      throw new Error("Google Generative AI library not loaded");
    }
  } catch (error) {
    console.error('Assessment error:', error);
    const lang = window.appState?.getState()?.language || 'fr';
    const errorMessage = lang === 'fr'
      ? "Erreur lors de l'analyse. Veuillez réessayer avec une image plus claire."
      : "Analysis error. Please try again with a clearer image.";
    assessmentState.feedbackHistory[assessmentState.currentStepIndex] = errorMessage;
  } finally {
    assessmentState.isAnalyzing = false;
    if (window.render) window.render();
    // Reset file input
    const fileInput = document.getElementById('assessment-file-input');
    if (fileInput) fileInput.value = '';
  }
};

window.handleAssessmentNext = () => {
  if (assessmentState.currentStepIndex < assessmentState.exercises.length - 1) {
    assessmentState.currentStepIndex++;
    assessmentState.showTextFallback = false;
    // Generate image for new exercise
    const currentExercise = assessmentState.exercises[assessmentState.currentStepIndex];
    if (currentExercise && !assessmentState.generatedProblemImages[assessmentState.currentStepIndex] && !assessmentState.isGeneratingImage) {
      assessmentState.isGeneratingImage = true;
      generateProblemImage(currentExercise, window.appState?.getState()?.language || 'fr').then(imageDataUrl => {
        if (imageDataUrl) {
          assessmentState.generatedProblemImages[assessmentState.currentStepIndex] = imageDataUrl;
        } else {
          assessmentState.showTextFallback = true;
        }
        assessmentState.isGeneratingImage = false;
        if (window.render) window.render();
      }).catch(err => {
        console.error("Problem Image Gen Failed", err);
        assessmentState.showTextFallback = true;
        assessmentState.isGeneratingImage = false;
        if (window.render) window.render();
      });
    }
  } else {
    assessmentState.reportReady = true;
  }
  if (window.render) window.render();
};

window.resetAssessment = () => {
  const language = window.appState?.getState()?.language || 'fr';
  generateRandomExercises(language);
  if (window.render) window.render();
};

window.updateParentEmail = (email) => {
  assessmentState.parentEmail = email;
};

window.sendReportEmail = () => {
  if (!assessmentState.parentEmail.includes('@')) {
    alert(window.appState?.getState()?.language === 'fr' ? "Email invalide" : "Invalid Email");
    return;
  }
  assessmentState.emailSent = true;
  if (window.render) window.render();
};

window.toggleTextFallback = () => {
  assessmentState.showTextFallback = !assessmentState.showTextFallback;
  if (window.render) window.render();
};

// Initialize on language change
export function initAssessment(language) {
  generateRandomExercises(language);
}

