import { generateRandomDataSet, getFrequencyData } from '../utils/math.js';

let practiceState = {
  dataSet: null,
  targetFreqValue: 0,
  userInputs: { mean: '', median: '', range: '', q1: '', q3: '', freq: '' },
  feedback: { mean: null, median: null, range: null, q1: null, q3: null, freq: null },
  showSolution: false
};

export function renderPractice(language) {
  if (!practiceState.dataSet) {
    generateNewExercise();
  }

  const t = language === 'fr' ? {
    title: 'Zone d\'Entraînement',
    subtitle: 'Mets tes connaissances à l\'épreuve !',
    newSeries: 'Nouveaux chiffres',
    tableTitle: '1. Tes Données',
    rawListIntro: 'Voici une liste de notes :',
    count: 'Eff.',
    vizTitle: 'Graphique',
    indicatorsTitle: '2. Tes Calculs',
    freqQuestion: 'Fréquence de',
    check: 'Vérifier',
    showSol: 'Voir Correction',
    hideSol: 'Cacher',
    solTitle: 'Correction',
    moyenne: 'Moyenne',
    mediane: 'Médiane',
    etendue: 'Étendue'
  } : {
    title: 'Training Zone',
    subtitle: 'Test your skills!',
    newSeries: 'New Numbers',
    tableTitle: '1. Your Data',
    rawListIntro: 'Here is a list of grades:',
    count: 'Count',
    vizTitle: 'Chart',
    indicatorsTitle: '2. Your Calculations',
    freqQuestion: 'Freq. of',
    check: 'Check',
    showSol: 'See Solution',
    hideSol: 'Hide',
    solTitle: 'Solution',
    moyenne: 'Mean',
    mediane: 'Median',
    etendue: 'Range'
  };

  const frequencyData = getFrequencyData(practiceState.dataSet.values);

  return `
    <div class="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100 text-emerald-600">
            <i data-lucide="calculator" style="width: 32px; height: 32px;"></i>
          </div>
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">${t.title}</h2>
            <p class="text-gray-500 font-medium">${t.subtitle}</p>
          </div>
        </div>
        <button 
          onclick="window.generateNewExercise()"
          class="group flex items-center gap-2 bg-white text-gray-700 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 px-5 py-3 rounded-full transition-all shadow-sm hover:shadow-md font-bold"
        >
          <i data-lucide="refresh-cw" class="group-hover:rotate-180 transition-transform duration-500" style="width: 20px; height: 20px;"></i>
          ${t.newSeries}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">${t.tableTitle}</h3>
              <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">${practiceState.dataSet.totalCount} ${language === 'fr' ? 'valeurs' : 'values'}</span>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              ${practiceState.dataSet.values.map(v => `
                <span class="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-mono text-gray-700 font-bold border border-gray-200">${v}</span>
              `).join('')}
            </div>

            <div class="overflow-hidden rounded-2xl border border-gray-100">
              <table class="w-full text-sm text-center">
                <thead class="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th class="p-3 text-left pl-4 rounded-tl-xl">${language === 'fr' ? 'Note' : 'Grade'}</th>
                    ${frequencyData.map(d => `<th class="p-3 border-l border-emerald-100">${d.value}</th>`).join('')}
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr>
                    <td class="p-3 font-bold text-left pl-4 bg-gray-50">${t.count}</td>
                    ${frequencyData.map(d => `<td class="p-3 border-l border-gray-100 font-medium">${d.count}</td>`).join('')}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-72">
            <h3 class="font-bold text-gray-800 mb-4">${t.vizTitle}</h3>
            <div id="practice-chart" style="width: 100%; height: 100%;"></div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-emerald-50 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
            
            <h3 class="text-xl font-black text-gray-800 mb-6 flex items-center gap-2 relative z-10">
              <span class="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                <i data-lucide="calculator" style="width: 20px; height: 20px;"></i>
              </span>
              ${t.indicatorsTitle}
            </h3>
            
            <div class="space-y-4 relative z-10">
              ${renderInputField(`${t.freqQuestion} ${practiceState.targetFreqValue} (%)`, 'freq', '', language)}
              
              <div class="grid grid-cols-2 gap-4">
                ${renderInputField(t.moyenne, 'mean', '', language)}
                ${renderInputField(t.mediane, 'median', '', language)}
              </div>
              <div class="grid grid-cols-2 gap-4">
                ${renderInputField('Q1', 'q1', '', language)}
                ${renderInputField('Q3', 'q3', '', language)}
              </div>
              ${renderInputField(t.etendue, 'range', '', language)}

              <div class="pt-4 flex gap-3">
                <button 
                  onclick="window.handleCheck()"
                  class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-emerald-200 shadow-lg active:scale-95 transition-all"
                >
                  ${t.check}
                </button>
                <button 
                  onclick="window.toggleSolution()"
                  class="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-colors"
                >
                  <i data-lucide="eye" style="width: 24px; height: 24px;"></i>
                </button>
              </div>
            </div>
          </div>
          
          ${practiceState.showSolution ? `
            <div class="mt-4 bg-amber-50 p-6 rounded-3xl border border-amber-100 text-amber-900 animate-slide-up">
              <h4 class="font-bold text-lg mb-2">💡 ${t.solTitle}</h4>
              <p class="text-sm opacity-80 mb-4">${language === 'fr' ? 'Série ordonnée' : 'Ordered series'} : ${practiceState.dataSet.sortedValues.join(' - ')}</p>
              <div class="grid grid-cols-2 gap-2 text-sm font-medium">
                <div class="bg-white/50 p-2 rounded-lg">${t.moyenne}: ${practiceState.dataSet.mean}</div>
                <div class="bg-white/50 p-2 rounded-lg">${t.mediane}: ${practiceState.dataSet.median}</div>
                <div class="bg-white/50 p-2 rounded-lg">Q1: ${practiceState.dataSet.q1}</div>
                <div class="bg-white/50 p-2 rounded-lg">Q3: ${practiceState.dataSet.q3}</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderInputField(label, field, placeholder, language) {
  const value = practiceState.userInputs[field] || '';
  const feedback = practiceState.feedback[field];
  let borderClass = 'border-transparent bg-white focus:border-emerald-300 text-gray-800 shadow-sm';
  if (feedback === true) borderClass = 'border-emerald-400 bg-emerald-50 text-emerald-700';
  if (feedback === false) borderClass = 'border-red-400 bg-red-50 text-red-700';

  return `
    <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">${label}</label>
      <div class="relative">
        <input 
          type="number" 
          step="0.1"
          id="input-${field}"
          value="${value}"
          onchange="window.updateInput('${field}', this.value)"
          class="block w-full rounded-xl border-2 py-2 px-3 text-lg font-bold outline-none transition-all ${borderClass}"
          placeholder="${placeholder || '?'}"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          ${feedback === true ? '<i data-lucide="check-circle" class="text-emerald-500" style="width: 20px; height: 20px;"></i>' : ''}
          ${feedback === false ? '<i data-lucide="x-circle" class="text-red-500" style="width: 20px; height: 20px;"></i>' : ''}
        </div>
      </div>
    </div>
  `;
}

window.generateNewExercise = () => {
  const count = Math.floor(Math.random() * 8) + 7;
  const newSet = generateRandomDataSet(count, 0, 20);
  practiceState.dataSet = newSet;
  practiceState.targetFreqValue = newSet.values[Math.floor(Math.random() * newSet.values.length)];
  practiceState.userInputs = { mean: '', median: '', range: '', q1: '', q3: '', freq: '' };
  practiceState.feedback = { mean: null, median: null, range: null, q1: null, q3: null, freq: null };
  practiceState.showSolution = false;
  
  if (window.render) {
    window.render();
    setTimeout(() => renderChart(), 100);
  }
};

window.updateInput = (field, value) => {
  practiceState.userInputs[field] = value;
  practiceState.feedback[field] = null;
};

window.handleCheck = () => {
  if (!practiceState.dataSet) return;
  
  const userMean = parseFloat((practiceState.userInputs.mean || '0').replace(',', '.'));
  const userMedian = parseFloat((practiceState.userInputs.median || '0').replace(',', '.'));
  const userRange = parseFloat((practiceState.userInputs.range || '0').replace(',', '.'));
  const userQ1 = parseFloat((practiceState.userInputs.q1 || '0').replace(',', '.'));
  const userQ3 = parseFloat((practiceState.userInputs.q3 || '0').replace(',', '.'));
  const userFreq = parseFloat((practiceState.userInputs.freq || '0').replace(',', '.'));
  const countOfTarget = practiceState.dataSet.values.filter(v => v === practiceState.targetFreqValue).length;
  const correctFreqPercent = Math.round((countOfTarget / practiceState.dataSet.totalCount) * 100);

  practiceState.feedback = {
    mean: Math.abs(userMean - practiceState.dataSet.mean) < 0.1,
    median: userMedian === practiceState.dataSet.median,
    range: userRange === practiceState.dataSet.range,
    q1: userQ1 === practiceState.dataSet.q1,
    q3: userQ3 === practiceState.dataSet.q3,
    freq: Math.abs(userFreq - correctFreqPercent) <= 1
  };
  
  if (window.render) window.render();
};

window.toggleSolution = () => {
  practiceState.showSolution = !practiceState.showSolution;
  if (window.render) window.render();
};

function renderChart() {
  const chartContainer = document.getElementById('practice-chart');
  if (!chartContainer || !practiceState.dataSet) return;

  const frequencyData = getFrequencyData(practiceState.dataSet.values);
  
  // Simple bar chart using SVG
  const width = chartContainer.clientWidth;
  const height = chartContainer.clientHeight - 40;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxCount = Math.max(...frequencyData.map(d => d.count));
  const barWidth = chartWidth / frequencyData.length * 0.8;
  const barSpacing = chartWidth / frequencyData.length;

  let svg = `
    <svg width="${width}" height="${height + 40}" style="overflow: visible;">
      ${frequencyData.map((d, i) => {
        const barHeight = (d.count / maxCount) * chartHeight;
        const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
        const y = padding + chartHeight - barHeight;
        const color = i % 2 === 0 ? '#10b981' : '#34d399';
        
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="6"/>
          <text x="${x + barWidth / 2}" y="${height + 20}" text-anchor="middle" class="text-xs fill-gray-600">${d.value}</text>
          <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" class="text-xs font-bold fill-gray-800">${d.count}</text>
        `;
      }).join('')}
      <line x1="${padding}" y1="${padding + chartHeight}" x2="${padding + chartWidth}" y2="${padding + chartHeight}" stroke="#94a3b8" stroke-width="2"/>
    </svg>
  `;
  
  chartContainer.innerHTML = svg;
}

// Listen for render event
if (typeof window !== 'undefined') {
  window.addEventListener('practice-render', () => {
    setTimeout(() => {
      if (document.getElementById('practice-chart')) {
        renderChart();
      }
    }, 100);
  });
}

