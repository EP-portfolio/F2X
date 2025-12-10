import React, { useState } from 'react';
import { LessonTopic, Language } from '../types';
import { ChevronRight, ChevronDown, BookOpen, Star, Zap, Layout } from 'lucide-react';

interface LessonProps {
  language: Language;
}

const getLessons = (lang: Language): LessonTopic[] => {
  if (lang === 'fr') {
    return [
      {
        id: 'effectifs',
        title: '1. Effectifs et Tableaux',
        description: 'Organiser des données brutes.',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><BookOpen size={20}/> Définition</h4>
              <p className="text-indigo-800 leading-relaxed">
                L'<strong>effectif</strong> d'une valeur est simplement le nombre de fois que cette valeur apparaît dans ta liste de données. C'est comme compter des points !
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Zap size={20} className="text-amber-500" fill="currentColor" /> Exemple Concret</h4>
              <p className="mb-4 text-gray-600">On a demandé à 6 élèves leur couleur préférée :</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {['Rouge', 'Bleu', 'Rouge', 'Noir', 'Bleu', 'Rouge'].map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 border border-gray-200">{c}</span>
                ))}
              </div>
              
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-bold">Couleur</th>
                      <th className="p-4 font-bold text-center">Effectif (Compte)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 divide-y divide-gray-100">
                    <tr><td className="p-4 font-medium text-red-500">Rouge</td><td className="p-4 text-center font-bold bg-red-50 text-red-700 rounded-lg">3</td></tr>
                    <tr><td className="p-4 font-medium text-blue-500">Bleu</td><td className="p-4 text-center font-bold bg-blue-50 text-blue-700 rounded-lg">2</td></tr>
                    <tr><td className="p-4 font-medium text-gray-800">Noir</td><td className="p-4 text-center font-bold bg-gray-100 text-gray-700 rounded-lg">1</td></tr>
                    <tr className="bg-gray-50"><td className="p-4 font-bold text-gray-900">TOTAL</td><td className="p-4 text-center font-black text-indigo-600 text-lg">6</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'frequences',
        title: '2. Les Fréquences',
        description: 'La part du gâteau (Proportions).',
        content: (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              La <strong>fréquence</strong>, c'est la part du gâteau 🍰. Elle permet de comparer même si les totaux sont différents.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-sky-50 p-5 rounded-3xl border border-sky-100">
                 <h4 className="font-bold text-sky-900 mb-2">La Formule Magique</h4>
                 <div className="bg-white p-3 rounded-xl text-center shadow-sm border border-sky-100 font-bold text-sky-600">
                    Effectif ÷ Total
                 </div>
               </div>
               <div className="bg-fuchsia-50 p-5 rounded-3xl border border-fuchsia-100">
                  <h4 className="font-bold text-fuchsia-900 mb-2">Les 3 Formes</h4>
                  <div className="flex justify-around items-center text-sm font-medium text-fuchsia-800">
                     <span className="bg-white px-2 py-1 rounded-lg shadow-sm">1/2</span>
                     <span>➔</span>
                     <span className="bg-white px-2 py-1 rounded-lg shadow-sm">0,5</span>
                     <span>➔</span>
                     <span className="bg-white px-2 py-1 rounded-lg shadow-sm">50%</span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3">Exemple : Voitures Rouges (3 sur 6)</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-600">En fraction</span>
                    <strong className="text-gray-900">3/6 = 1/2</strong>
                </li>
                <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-600">En décimal</span>
                    <strong className="text-gray-900">0,5</strong>
                </li>
                <li className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800">En pourcentage</span>
                    <strong className="text-emerald-600 text-lg">50%</strong>
                </li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'indicateurs_centraux',
        title: '3. Moyenne et Médiane',
        description: 'Où se situe le centre ?',
        content: (
          <div className="space-y-8">
            {/* Moyenne */}
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-200 rounded-full"></div>
              <h4 className="font-bold text-2xl text-indigo-700 mb-2">La Moyenne</h4>
              <p className="text-gray-600 mb-4">C'est le point d'équilibre. Imagine que tu redistribues tout équitablement.</p>
              <div className="bg-indigo-600 text-white p-4 rounded-2xl text-center font-bold shadow-lg shadow-indigo-200 transform hover:scale-[1.02] transition-transform">
                 Somme de tout ÷ Nombre total
              </div>
            </div>

            {/* Médiane */}
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-300 rounded-full"></div>
              <h4 className="font-bold text-2xl text-amber-600 mb-2">La Médiane</h4>
              <p className="text-gray-600 mb-4">C'est la valeur du milieu quand tout est rangé dans l'ordre.</p>
               <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                <ul className="space-y-3 text-amber-900 font-medium">
                  <li className="flex gap-3 items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    Si total IMPAIR : C'est pile la valeur au centre.
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    Si total PAIR : C'est la moyenne des deux valeurs du centre.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'dispersion',
        title: '4. Quartiles (Q1, Q3) et Étendue',
        description: 'Les données sont-elles étalées ?',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 rounded-3xl text-white shadow-lg">
                <h4 className="font-bold text-xl mb-1 opacity-90">L'Étendue</h4>
                <p className="text-emerald-50 text-sm mb-3 opacity-80">La distance entre les extrêmes.</p>
                <div className="text-3xl font-black tracking-tight">Max - Min</div>
            </div>

            <div>
                <h4 className="font-bold text-violet-800 text-xl mb-4 px-2">Les Quartiles (Q1 et Q3)</h4>
                <div className="grid gap-4">
                    <div className="bg-white p-5 rounded-3xl border-2 border-violet-100 hover:border-violet-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <strong className="text-violet-900 text-lg">Q1 (Premier Quartile)</strong>
                           <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-lg text-xs font-bold">25%</span>
                        </div>
                        <p className="text-gray-500 text-sm">Le premier quart de la classe est en dessous de cette note.</p>
                        <div className="mt-3 bg-gray-50 rounded-xl p-2 text-center text-violet-600 font-mono text-sm">Rang : N ÷ 4</div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border-2 border-fuchsia-100 hover:border-fuchsia-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <strong className="text-fuchsia-900 text-lg">Q3 (Troisième Quartile)</strong>
                           <span className="bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-lg text-xs font-bold">75%</span>
                        </div>
                        <p className="text-gray-500 text-sm">Les trois quarts de la classe sont en dessous.</p>
                        <div className="mt-3 bg-gray-50 rounded-xl p-2 text-center text-fuchsia-600 font-mono text-sm">Rang : 3 × N ÷ 4</div>
                    </div>
                </div>
            </div>
          </div>
        )
      }
    ];
  } else {
    // ENGLISH CONTENT
    return [
      {
        id: 'effectifs',
        title: '1. Frequency and Tables',
        description: 'Organize raw data.',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><BookOpen size={20}/> Definition</h4>
              <p className="text-indigo-800 leading-relaxed">
                The <strong>Frequency</strong> (or Count) is simply how many times a value appears in your list. It's like keeping score!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Zap size={20} className="text-amber-500" fill="currentColor" /> Concrete Example</h4>
              <p className="mb-4 text-gray-600">We asked 6 students their favorite color:</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {['Red', 'Blue', 'Red', 'Black', 'Blue', 'Red'].map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 border border-gray-200">{c}</span>
                ))}
              </div>
              
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-bold">Color</th>
                      <th className="p-4 font-bold text-center">Frequency (Count)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 divide-y divide-gray-100">
                    <tr><td className="p-4 font-medium text-red-500">Red</td><td className="p-4 text-center font-bold bg-red-50 text-red-700 rounded-lg">3</td></tr>
                    <tr><td className="p-4 font-medium text-blue-500">Blue</td><td className="p-4 text-center font-bold bg-blue-50 text-blue-700 rounded-lg">2</td></tr>
                    <tr><td className="p-4 font-medium text-gray-800">Black</td><td className="p-4 text-center font-bold bg-gray-100 text-gray-700 rounded-lg">1</td></tr>
                    <tr className="bg-gray-50"><td className="p-4 font-bold text-gray-900">TOTAL</td><td className="p-4 text-center font-black text-indigo-600 text-lg">6</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'frequences',
        title: '2. Relative Frequency',
        description: 'The slice of the cake (Proportions).',
        content: (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              The <strong>Relative Frequency</strong> represents the share of the total. It allows us to compare even if totals are different.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-sky-50 p-5 rounded-3xl border border-sky-100">
                 <h4 className="font-bold text-sky-900 mb-2">The Magic Formula</h4>
                 <div className="bg-white p-3 rounded-xl text-center shadow-sm border border-sky-100 font-bold text-sky-600">
                    Frequency ÷ Total
                 </div>
               </div>
               <div className="bg-fuchsia-50 p-5 rounded-3xl border border-fuchsia-100">
                  <h4 className="font-bold text-fuchsia-900 mb-2">The 3 Forms</h4>
                  <div className="flex justify-around items-center text-sm font-medium text-fuchsia-800">
                     <span className="bg-white px-2 py-1 rounded-lg shadow-sm">1/2</span>
                     <span>➔</span>
                     <span className="bg-white px-2 py-1 rounded-lg shadow-sm">0.5</span>
                     <span>➔</span>
                     <span className="bg-white px-2 py-1 rounded-lg shadow-sm">50%</span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3">Example: Red Cars (3 out of 6)</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-600">Fraction</span>
                    <strong className="text-gray-900">3/6 = 1/2</strong>
                </li>
                <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-600">Decimal</span>
                    <strong className="text-gray-900">0.5</strong>
                </li>
                <li className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800">Percentage</span>
                    <strong className="text-emerald-600 text-lg">50%</strong>
                </li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'indicateurs_centraux',
        title: '3. Mean and Median',
        description: 'Where is the center?',
        content: (
          <div className="space-y-8">
            {/* Mean */}
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-200 rounded-full"></div>
              <h4 className="font-bold text-2xl text-indigo-700 mb-2">The Mean</h4>
              <p className="text-gray-600 mb-4">It is the balance point. Imagine redistributing everything equally.</p>
              <div className="bg-indigo-600 text-white p-4 rounded-2xl text-center font-bold shadow-lg shadow-indigo-200 transform hover:scale-[1.02] transition-transform">
                 Sum of all values ÷ Total Count
              </div>
            </div>

            {/* Median */}
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-300 rounded-full"></div>
              <h4 className="font-bold text-2xl text-amber-600 mb-2">The Median</h4>
              <p className="text-gray-600 mb-4">It is the middle value when data is ordered.</p>
               <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                <ul className="space-y-3 text-amber-900 font-medium">
                  <li className="flex gap-3 items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    If ODD total: It's exactly the middle value.
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    If EVEN total: It's the average of the two middle values.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'dispersion',
        title: '4. Quartiles (Q1, Q3) and Range',
        description: 'Is the data spread out?',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 rounded-3xl text-white shadow-lg">
                <h4 className="font-bold text-xl mb-1 opacity-90">The Range</h4>
                <p className="text-emerald-50 text-sm mb-3 opacity-80">The distance between extremes.</p>
                <div className="text-3xl font-black tracking-tight">Max - Min</div>
            </div>

            <div>
                <h4 className="font-bold text-violet-800 text-xl mb-4 px-2">Quartiles (Q1 and Q3)</h4>
                <div className="grid gap-4">
                    <div className="bg-white p-5 rounded-3xl border-2 border-violet-100 hover:border-violet-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <strong className="text-violet-900 text-lg">Q1 (First Quartile)</strong>
                           <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-lg text-xs font-bold">25%</span>
                        </div>
                        <p className="text-gray-500 text-sm">The first quarter of the data is below this value.</p>
                        <div className="mt-3 bg-gray-50 rounded-xl p-2 text-center text-violet-600 font-mono text-sm">Rank: N ÷ 4</div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border-2 border-fuchsia-100 hover:border-fuchsia-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <strong className="text-fuchsia-900 text-lg">Q3 (Third Quartile)</strong>
                           <span className="bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-lg text-xs font-bold">75%</span>
                        </div>
                        <p className="text-gray-500 text-sm">Three quarters of the data are below this value.</p>
                        <div className="mt-3 bg-gray-50 rounded-xl p-2 text-center text-fuchsia-600 font-mono text-sm">Rank: 3 × N ÷ 4</div>
                    </div>
                </div>
            </div>
          </div>
        )
      }
    ];
  }
};

export const Lesson: React.FC<LessonProps> = ({ language }) => {
  const [openLesson, setOpenLesson] = useState<string | null>('effectifs');
  const lessons = getLessons(language);

  const toggleLesson = (id: string) => {
    setOpenLesson(openLesson === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-blue-100 text-blue-600">
            <Layout size={32} />
        </div>
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {language === 'fr' ? 'Le Cours' : 'Lessons'}
            </h2>
            <p className="text-gray-500 font-medium">
                {language === 'fr' ? 'Chapitre : Statistiques' : 'Chapter: Statistics'}
            </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200 group">
            <button
              onClick={() => toggleLesson(lesson.id)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-colors ${openLesson === lesson.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                    {lesson.title.split('.')[0]}
                </div>
                <div>
                  <h3 className={`text-lg font-bold transition-colors ${openLesson === lesson.id ? 'text-blue-700' : 'text-gray-800'}`}>{lesson.title.split('. ')[1]}</h3>
                  <p className="text-gray-400 text-sm font-medium">{lesson.description}</p>
                </div>
              </div>
              <div className={`p-2 rounded-full transition-all ${openLesson === lesson.id ? 'bg-blue-50 text-blue-600 rotate-180' : 'text-gray-300'}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            
            {openLesson === lesson.id && (
              <div className="p-8 pt-2 animate-slide-down">
                <div className="h-px bg-gray-100 w-full mb-6"></div>
                {lesson.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};