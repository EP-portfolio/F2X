import React, { useState, useEffect } from 'react';
import { generateRandomDataSet, getFrequencyData } from '../utils/math';
import { DataSet } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';

export const Practice: React.FC = () => {
  const [dataSet, setDataSet] = useState<DataSet | null>(null);
  
  // Choose a random value from the dataset to ask for its frequency
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
    // Generate between 7 and 15 values (ensure enough for quartiles)
    const count = Math.floor(Math.random() * 8) + 7; 
    const newSet = generateRandomDataSet(count, 0, 20);
    setDataSet(newSet);
    
    // Pick a value present in the set for the frequency question
    const randomVal = newSet.values[Math.floor(Math.random() * newSet.values.length)];
    setTargetFreqValue(randomVal);

    setUserInputs({ mean: '', median: '', range: '', q1: '', q3: '', freq: '' });
    setFeedback({ mean: null, median: null, range: null, q1: null, q3: null, freq: null });
    setShowSolution(false);
  };

  useEffect(() => {
    generateNewExercise();
  }, []);

  const handleCheck = () => {
    if (!dataSet) return;
    
    // Parse Inputs
    const userMean = parseFloat(userInputs.mean.replace(',', '.'));
    const userMedian = parseFloat(userInputs.median.replace(',', '.'));
    const userRange = parseFloat(userInputs.range.replace(',', '.'));
    const userQ1 = parseFloat(userInputs.q1.replace(',', '.'));
    const userQ3 = parseFloat(userInputs.q3.replace(',', '.'));
    const userFreq = parseFloat(userInputs.freq.replace(',', '.'));

    // Calc correct frequency % for the target value
    const countOfTarget = dataSet.values.filter(v => v === targetFreqValue).length;
    const correctFreqPercent = Math.round((countOfTarget / dataSet.totalCount) * 100);

    setFeedback({
      mean: Math.abs(userMean - dataSet.mean) < 0.1,
      median: userMedian === dataSet.median,
      range: userRange === dataSet.range,
      q1: userQ1 === dataSet.q1,
      q3: userQ3 === dataSet.q3,
      freq: Math.abs(userFreq - correctFreqPercent) <= 1 // Allow 1% rounding diff
    });
  };

  if (!dataSet) return <div>Chargement...</div>;

  const frequencyData = getFrequencyData(dataSet.values);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">Entraînement Complet</h2>
           <p className="text-gray-500 text-sm">Tableaux, Fréquences et Indicateurs</p>
        </div>
        <button 
          onClick={generateNewExercise}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          Nouvelle Série
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Data Visualization Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Raw Data & Table Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">1. Tableau des Effectifs</h3>
            <p className="text-sm text-gray-500 mb-2">Voici la liste brute des notes :</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {dataSet.values.map((v, i) => (
                <span key={i} className="inline-block bg-gray-100 text-gray-800 font-mono px-3 py-1 rounded-full text-lg">
                  {v}
                </span>
              ))}
            </div>
            
            {/* Displaying as a generated Frequency Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse">
                    <thead className="bg-indigo-50 text-indigo-900 font-bold">
                        <tr>
                            <td className="border p-2 text-left">Note</td>
                            {frequencyData.map(d => <td key={d.value} className="border p-2">{d.value}</td>)}
                            <td className="border p-2 bg-gray-100">Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border p-2 font-bold text-left">Effectif</td>
                             {frequencyData.map(d => <td key={d.value} className="border p-2">{d.count}</td>)}
                             <td className="border p-2 font-bold bg-gray-100">{dataSet.totalCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-64">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Visualisation</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <XAxis dataKey="value" stroke="#6b7280" />
                <YAxis stroke="#6b7280" allowDecimals={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                   cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                   {frequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#4f46e5" />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interaction Column */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-6">2. Indicateurs & Fréquence</h3>
              
              <div className="space-y-4">
                
                {/* Frequency Question */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fréquence de la note <strong>{targetFreqValue}</strong> (en %)
                   </label>
                   <div className="relative">
                    <input 
                      type="number" 
                      value={userInputs.freq}
                      onChange={(e) => setUserInputs({...userInputs, freq: e.target.value})}
                      className={`block w-full rounded-md border-gray-300 shadow-sm p-3 border outline-none
                         ${feedback.freq === true ? 'border-green-500 bg-green-50' : ''}
                         ${feedback.freq === false ? 'border-red-500 bg-red-50' : ''}
                      `}
                      placeholder="Ex: 20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                       {feedback.freq === true && <CheckCircle className="text-green-600" size={20} />}
                       {feedback.freq === false && <XCircle className="text-red-600" size={20} />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {/* Mean */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Moyenne</label>
                      <div className="relative">
                        <input type="number" step="0.1" value={userInputs.mean} onChange={(e) => setUserInputs({...userInputs, mean: e.target.value})} className={`block w-full rounded p-2 border text-sm ${feedback.mean === true ? 'border-green-500 bg-green-50' : feedback.mean === false ? 'border-red-500 bg-red-50' : ''}`} />
                      </div>
                    </div>
                    {/* Median */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Médiane</label>
                      <div className="relative">
                        <input type="number" step="0.5" value={userInputs.median} onChange={(e) => setUserInputs({...userInputs, median: e.target.value})} className={`block w-full rounded p-2 border text-sm ${feedback.median === true ? 'border-green-500 bg-green-50' : feedback.median === false ? 'border-red-500 bg-red-50' : ''}`} />
                      </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Q1 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Q1 (1er Quartile)</label>
                      <div className="relative">
                        <input type="number" value={userInputs.q1} onChange={(e) => setUserInputs({...userInputs, q1: e.target.value})} className={`block w-full rounded p-2 border text-sm ${feedback.q1 === true ? 'border-green-500 bg-green-50' : feedback.q1 === false ? 'border-red-500 bg-red-50' : ''}`} />
                      </div>
                    </div>
                    {/* Q3 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Q3 (3ème Quartile)</label>
                      <div className="relative">
                        <input type="number" value={userInputs.q3} onChange={(e) => setUserInputs({...userInputs, q3: e.target.value})} className={`block w-full rounded p-2 border text-sm ${feedback.q3 === true ? 'border-green-500 bg-green-50' : feedback.q3 === false ? 'border-red-500 bg-red-50' : ''}`} />
                      </div>
                    </div>
                </div>

                 {/* Range */}
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Étendue</label>
                    <div className="relative">
                    <input type="number" value={userInputs.range} onChange={(e) => setUserInputs({...userInputs, range: e.target.value})} className={`block w-full rounded p-2 border text-sm ${feedback.range === true ? 'border-green-500 bg-green-50' : feedback.range === false ? 'border-red-500 bg-red-50' : ''}`} />
                    </div>
                </div>


                <div className="pt-2 flex flex-col gap-3">
                  <button 
                    onClick={handleCheck}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors"
                  >
                    Vérifier mes réponses
                  </button>
                  <button 
                    onClick={() => setShowSolution(!showSolution)}
                    className="w-full bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    {showSolution ? 'Masquer la correction' : 'Voir la correction'}
                  </button>
                </div>
              </div>
           </div>

           {/* Correction Panel */}
           {showSolution && (
             <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 animate-fade-in text-sm">
               <h4 className="font-bold text-yellow-900 mb-4">Correction Détaillée</h4>
               <div className="space-y-3 text-yellow-800">
                 <div>
                   <strong>Série ordonnée :</strong>
                   <div className="font-mono bg-white px-2 py-1 rounded border border-yellow-100 mt-1 break-words">
                     {dataSet.sortedValues.join(', ')}
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <strong>Fréquence de {targetFreqValue} :</strong><br/>
                        {dataSet.values.filter(v=>v===targetFreqValue).length} / {dataSet.totalCount} ≈ <span className="font-bold">{Math.round((dataSet.values.filter(v=>v===targetFreqValue).length/dataSet.totalCount)*100)}%</span>
                     </div>
                     <div>
                         <strong>Moyenne :</strong> <span className="font-bold">{dataSet.mean}</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <strong>Médiane :</strong> <span className="font-bold">{dataSet.median}</span>
                     </div>
                     <div>
                        <strong>Étendue :</strong> <span className="font-bold">{dataSet.range}</span>
                     </div>
                 </div>

                 <div className="bg-yellow-100 p-2 rounded">
                    <strong>Quartiles :</strong><br/>
                    Rang Q1 = {dataSet.totalCount}/4 = {dataSet.totalCount/4} → {Math.ceil(dataSet.totalCount/4)}ème valeur<br/>
                    <strong>Q1 = {dataSet.q1}</strong><br/>
                    Rang Q3 = 3*{dataSet.totalCount}/4 = {3*dataSet.totalCount/4} → {Math.ceil(3*dataSet.totalCount/4)}ème valeur<br/>
                    <strong>Q3 = {dataSet.q3}</strong><br/>
                    <em>Écart Inter-quartile : {dataSet.interquartileRange}</em>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};