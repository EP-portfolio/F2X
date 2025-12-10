import React, { useState, useEffect } from 'react';
import { generateRandomDataSet, getFrequencyData } from '../utils/math';
import { DataSet, Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, CheckCircle, XCircle, Eye, Calculator } from 'lucide-react';

interface PracticeProps {
  language: Language;
}

export const Practice: React.FC<PracticeProps> = ({ language }) => {
  const [dataSet, setDataSet] = useState<DataSet | null>(null);
  const [targetFreqValue, setTargetFreqValue] = useState<number>(0);

  const [userInputs, setUserInputs] = useState({
    mean: '',
    median: '',
    range: '',
    q1: '',
    q3: '',
    freq: ''
  });
  
  const [feedback, setFeedback] = useState({
    mean: null as boolean | null,
    median: null as boolean | null,
    range: null as boolean | null,
    q1: null as boolean | null,
    q3: null as boolean | null,
    freq: null as boolean | null
  });
  
  const [showSolution, setShowSolution] = useState(false);

  const generateNewExercise = () => {
    const count = Math.floor(Math.random() * 8) + 7; 
    const newSet = generateRandomDataSet(count, 0, 20);
    setDataSet(newSet);
    const randomVal = newSet.values[Math.floor(Math.random() * newSet.values.length)];
    setTargetFreqValue(randomVal);
    setUserInputs({ mean: '', median: '', range: '', q1: '', q3: '', freq: '' });
    setFeedback({ mean: null, median: null, range: null, q1: null, q3: null, freq: null });
    setShowSolution(false);
  };

  useEffect(() => {
    generateNewExercise();
  }, [language]);

  const handleCheck = () => {
    if (!dataSet) return;
    const userMean = parseFloat(userInputs.mean.replace(',', '.'));
    const userMedian = parseFloat(userInputs.median.replace(',', '.'));
    const userRange = parseFloat(userInputs.range.replace(',', '.'));
    const userQ1 = parseFloat(userInputs.q1.replace(',', '.'));
    const userQ3 = parseFloat(userInputs.q3.replace(',', '.'));
    const userFreq = parseFloat(userInputs.freq.replace(',', '.'));
    const countOfTarget = dataSet.values.filter(v => v === targetFreqValue).length;
    const correctFreqPercent = Math.round((countOfTarget / dataSet.totalCount) * 100);

    setFeedback({
      mean: Math.abs(userMean - dataSet.mean) < 0.1,
      median: userMedian === dataSet.median,
      range: userRange === dataSet.range,
      q1: userQ1 === dataSet.q1,
      q3: userQ3 === dataSet.q3,
      freq: Math.abs(userFreq - correctFreqPercent) <= 1
    });
  };

  if (!dataSet) return <div className="p-8 text-center text-gray-500">...</div>;

  const frequencyData = getFrequencyData(dataSet.values);
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
    solTitle: 'Correction'
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
    solTitle: 'Solution'
  };

  const InputField = ({ label, field, placeholder = "" }: any) => (
    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">{label}</label>
        <div className="relative">
            <input 
                type="number" 
                step="0.1"
                value={userInputs[field as keyof typeof userInputs]}
                onChange={(e) => setUserInputs({...userInputs, [field]: e.target.value})}
                className={`block w-full rounded-xl border-2 py-2 px-3 text-lg font-bold outline-none transition-all
                    ${feedback[field as keyof typeof feedback] === true ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 
                      feedback[field as keyof typeof feedback] === false ? 'border-red-400 bg-red-50 text-red-700' : 
                      'border-transparent bg-white focus:border-emerald-300 text-gray-800 shadow-sm'}
                `}
                placeholder={placeholder}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {feedback[field as keyof typeof feedback] === true && <CheckCircle size={20} className="text-emerald-500" />}
                {feedback[field as keyof typeof feedback] === false && <XCircle size={20} className="text-red-500" />}
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100 text-emerald-600">
                <Calculator size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t.title}</h2>
                <p className="text-gray-500 font-medium">{t.subtitle}</p>
            </div>
        </div>
        <button 
          onClick={generateNewExercise}
          className="group flex items-center gap-2 bg-white text-gray-700 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 px-5 py-3 rounded-full transition-all shadow-sm hover:shadow-md font-bold"
        >
          <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          {t.newSeries}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Data & Viz */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">{t.tableTitle}</h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{dataSet.totalCount} valeurs</span>
             </div>
             
             <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                {dataSet.values.map((v, i) => (
                    <span key={i} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-mono text-gray-700 font-bold border border-gray-200">{v}</span>
                ))}
             </div>

             <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-sm text-center">
                    <thead className="bg-emerald-50 text-emerald-800">
                        <tr>
                            <th className="p-3 text-left pl-4 rounded-tl-xl">Note</th>
                            {frequencyData.map(d => <th key={d.value} className="p-3 border-l border-emerald-100">{d.value}</th>)}
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        <tr>
                            <td className="p-3 font-bold text-left pl-4 bg-gray-50">{t.count}</td>
                             {frequencyData.map(d => <td key={d.value} className="p-3 border-l border-gray-100 font-medium">{d.count}</td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-72">
            <h3 className="font-bold text-gray-800 mb-4">{t.vizTitle}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} margin={{top: 5, right: 20, bottom: 25, left: -20}}>
                <XAxis dataKey="value" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: '#f0fdf4'}}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 6, 6]} barSize={40}>
                   {frequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Calculator */}
        <div className="lg:col-span-5">
           <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
              
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2 relative z-10">
                  <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Calculator size={20}/></span>
                  {t.indicatorsTitle}
              </h3>
              
              <div className="space-y-4 relative z-10">
                <InputField label={`${t.freqQuestion} ${targetFreqValue} (%)`} field="freq" placeholder="?" />
                
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Moyenne" field="mean" />
                    <InputField label="Médiane" field="median" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Q1" field="q1" />
                    <InputField label="Q3" field="q3" />
                </div>
                <InputField label="Étendue" field="range" />

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={handleCheck}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-emerald-200 shadow-lg active:scale-95 transition-all"
                  >
                    {t.check}
                  </button>
                  <button 
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-colors"
                  >
                    <Eye size={24} />
                  </button>
                </div>
              </div>
           </div>
           
           {/* Solution Card */}
           {showSolution && (
             <div className="mt-4 bg-amber-50 p-6 rounded-3xl border border-amber-100 text-amber-900 animate-slide-up">
                <h4 className="font-bold text-lg mb-2">💡 {t.solTitle}</h4>
                <p className="text-sm opacity-80 mb-4">Série ordonnée : {dataSet.sortedValues.join(' - ')}</p>
                <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                    <div className="bg-white/50 p-2 rounded-lg">Moyenne: {dataSet.mean}</div>
                    <div className="bg-white/50 p-2 rounded-lg">Médiane: {dataSet.median}</div>
                    <div className="bg-white/50 p-2 rounded-lg">Q1: {dataSet.q1}</div>
                    <div className="bg-white/50 p-2 rounded-lg">Q3: {dataSet.q3}</div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};