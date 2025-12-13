import { generateExerciseData } from '../utils/exerciseGenerator.js';

let generatorState = {
  currentExercise: null,
  language: 'fr',
  showSolution: false
};

export function renderExerciseGenerator(language) {
  generatorState.language = language;
  
  if (!generatorState.currentExercise) {
    generateNewExercise();
  }

  const exercise = generatorState.currentExercise;
  const t = language === 'fr' ? {
    title: "Générateur d'Exercices",
    subtitle: "Tableau d'effectifs et Calculs de fréquences",
    generateNew: "Générer un nouvel exercice",
    exercise1: "Exercice 1 : Tableau d'effectifs",
    exercise2: "Exercice 2 : Calculs de fréquences",
    rawData: "Données brutes",
    instruction1: "Construis le tableau des effectifs en regroupant les valeurs.",
    instruction2: "Ajoute 3 colonnes : Fréquence (Fraction), Fréquence (Décimal), Fréquence (%).",
    instruction2Note: "Consigne : Arrondis les fréquences décimales au centième et les fréquences en % à l'unité.",
    showSolution: "Voir la solution",
    hideSolution: "Cacher la solution",
    tableTitle: "Tableau d'effectifs",
    value: "Valeur",
    count: "Effectif",
    total: "TOTAL",
    freqFraction: "Fréq (Frac)",
    freqDecimal: "Fréq (Déc)",
    freqPercent: "Fréq (%)"
  } : {
    title: "Exercise Generator",
    subtitle: "Frequency Table and Frequency Calculations",
    generateNew: "Generate New Exercise",
    exercise1: "Exercise 1: Frequency Table",
    exercise2: "Exercise 2: Frequency Calculations",
    rawData: "Raw Data",
    instruction1: "Build the frequency table by grouping values.",
    instruction2: "Add 3 columns: Frequency (Fraction), Frequency (Decimal), Frequency (%).",
    instruction2Note: "Instruction: Round decimal frequencies to the hundredth and percentage frequencies to the unit.",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    tableTitle: "Frequency Table",
    value: "Value",
    count: "Count",
    total: "TOTAL",
    freqFraction: "Freq (Frac)",
    freqDecimal: "Freq (Dec)",
    freqPercent: "Freq (%)"
  };

  return `
    <div class="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div class="mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">${t.title}</h2>
        <p class="text-gray-500">${t.subtitle}</p>
      </div>

      <div class="mb-6">
        <button
          onclick="window.generateNewExercise()"
          class="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-3 px-6 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg"
        >
          ${t.generateNew}
        </button>
      </div>

      ${exercise ? `
        <div class="space-y-8">
          <!-- Exercice 1 : Tableau d'effectifs -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-blue-700 mb-4">${t.exercise1}</h3>
            <div class="mb-4">
              <p class="font-bold text-gray-700 mb-2">${t.rawData} :</p>
              <p class="text-lg text-gray-800 bg-gray-50 p-3 rounded-lg font-mono">
                ${exercise.rawList.join(', ')}
              </p>
            </div>
            <p class="text-gray-600 mb-4">${t.instruction1}</p>
            
            ${generatorState.showSolution ? `
              <div class="mt-6">
                <h4 class="font-bold mb-3">${t.tableTitle} :</h4>
                <table class="w-full border-collapse border-2 border-gray-800">
                  <thead>
                    <tr class="bg-blue-50">
                      <th class="border-2 border-gray-800 p-3 text-left font-bold">${exercise.label}</th>
                      <th class="border-2 border-gray-800 p-3 text-center font-bold">${t.count}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${exercise.valeurs.map((val, idx) => `
                      <tr>
                        <td class="border-2 border-gray-800 p-3">${val}${exercise.unite ? ' ' + exercise.unite : ''}</td>
                        <td class="border-2 border-gray-800 p-3 text-center">${exercise.effectifs[idx]}</td>
                      </tr>
                    `).join('')}
                    <tr class="bg-gray-100 font-bold">
                      <td class="border-2 border-gray-800 p-3">${t.total}</td>
                      <td class="border-2 border-gray-800 p-3 text-center">${exercise.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>

          <!-- Exercice 2 : Calculs de fréquences -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-emerald-700 mb-4">${t.exercise2}</h3>
            <p class="text-gray-600 mb-2">${t.instruction2}</p>
            <p class="text-sm text-gray-500 mb-4 italic">${t.instruction2Note}</p>
            
            ${generatorState.showSolution ? `
              <div class="mt-6">
                <h4 class="font-bold mb-3">${t.tableTitle} avec fréquences :</h4>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse border-2 border-gray-800 min-w-[600px]">
                    <thead>
                      <tr class="bg-emerald-50">
                        <th class="border-2 border-gray-800 p-3 text-left font-bold">${exercise.label}</th>
                        <th class="border-2 border-gray-800 p-3 text-center font-bold">${t.count}</th>
                        <th class="border-2 border-gray-800 p-3 text-center font-bold">${t.freqFraction}</th>
                        <th class="border-2 border-gray-800 p-3 text-center font-bold">${t.freqDecimal}</th>
                        <th class="border-2 border-gray-800 p-3 text-center font-bold">${t.freqPercent}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${exercise.valeurs.map((val, idx) => {
                        const freq = exercise.frequences[idx];
                        // Pour l'exercice 2, on arrondit les décimales au centième et les % à l'unité
                        const decimalRounded = (exercise.effectifs[idx] / exercise.total).toFixed(2);
                        const percentRounded = Math.round((exercise.effectifs[idx] / exercise.total) * 100);
                        return `
                          <tr>
                            <td class="border-2 border-gray-800 p-3">${val}${exercise.unite ? ' ' + exercise.unite : ''}</td>
                            <td class="border-2 border-gray-800 p-3 text-center">${exercise.effectifs[idx]}</td>
                            <td class="border-2 border-gray-800 p-3 text-center">${freq.fraction}</td>
                            <td class="border-2 border-gray-800 p-3 text-center">${decimalRounded}</td>
                            <td class="border-2 border-gray-800 p-3 text-center">${percentRounded}%</td>
                          </tr>
                        `;
                      }).join('')}
                      <tr class="bg-gray-100 font-bold">
                        <td class="border-2 border-gray-800 p-3">${t.total}</td>
                        <td class="border-2 border-gray-800 p-3 text-center">${exercise.total}</td>
                        <td class="border-2 border-gray-800 p-3 text-center">1</td>
                        <td class="border-2 border-gray-800 p-3 text-center">1,00</td>
                        <td class="border-2 border-gray-800 p-3 text-center">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Bouton pour afficher/cacher la solution -->
          <div class="text-center">
            <button
              onclick="window.toggleExerciseSolution()"
              class="bg-amber-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-amber-600 transition-all shadow-lg"
            >
              ${generatorState.showSolution ? t.hideSolution : t.showSolution}
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

window.generateNewExercise = () => {
  generatorState.currentExercise = generateExerciseData(generatorState.language);
  generatorState.showSolution = false;
  if (window.render) window.render();
};

window.toggleExerciseSolution = () => {
  generatorState.showSolution = !generatorState.showSolution;
  if (window.render) window.render();
};

export function initExerciseGenerator(language) {
  generatorState.language = language;
  if (!generatorState.currentExercise) {
    generateNewExercise();
  }
}

