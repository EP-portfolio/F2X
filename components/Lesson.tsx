import React, { useState } from 'react';
import { LessonTopic } from '../types';
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react';

const lessons: LessonTopic[] = [
  {
    id: 'effectifs',
    title: '1. Effectifs et Tableaux',
    description: 'Organiser des données brutes dans un tableau d\'effectifs.',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Avant d'analyser des données, il faut les ranger. L'<strong>effectif</strong> d'une valeur est le nombre de fois que cette valeur apparaît dans la liste.
        </p>
        <div className="bg-white p-4 rounded shadow-sm border">
          <h4 className="font-semibold mb-2">Exemple :</h4>
          <p className="mb-2">Liste brute des couleurs de voitures : <br/>
          <span className="font-mono text-sm bg-gray-100 p-1">Rouge, Bleu, Rouge, Noir, Bleu, Rouge</span></p>
          
          <table className="w-full text-sm text-left border-collapse mt-3">
            <thead className="bg-indigo-50 text-indigo-900">
              <tr>
                <th className="border p-2">Couleur</th>
                <th className="border p-2">Effectif</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-2">Rouge</td><td className="border p-2 font-bold">3</td></tr>
              <tr><td className="border p-2">Bleu</td><td className="border p-2 font-bold">2</td></tr>
              <tr><td className="border p-2">Noir</td><td className="border p-2 font-bold">1</td></tr>
              <tr className="bg-gray-50 font-bold"><td className="border p-2">TOTAL</td><td className="border p-2">6</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 'frequences',
    title: '2. Les Fréquences',
    description: 'Calculer la proportion d\'une valeur par rapport au total.',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          La <strong>fréquence</strong> permet de savoir quelle part représente une catégorie par rapport au total. Elle peut s'écrire sous 3 formes : fraction, nombre décimal ou pourcentage.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-900 mb-2">Formule :</h4>
          <p className="font-mono text-sm text-blue-800">
            Fréquence = Effectif de la valeur / Effectif Total
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border">
          <h4 className="font-semibold mb-2">Exemple (Voitures Rouges) :</h4>
          <p>Effectif Rouge = 3. Effectif Total = 6.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Fraction :</strong> 3/6 = 1/2</li>
            <li><strong>Décimal :</strong> 0,5</li>
            <li><strong>Pourcentage :</strong> 0,5 × 100 = <strong>50%</strong></li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'indicateurs_centraux',
    title: '3. Moyenne et Médiane',
    description: 'Les indicateurs de position centrale.',
    content: (
      <div className="space-y-6">
        {/* Moyenne */}
        <div>
          <h4 className="font-bold text-lg text-indigo-700 mb-2">La Moyenne</h4>
          <p className="text-gray-700 mb-2">
             C'est le point d'équilibre. On additionne toutes les valeurs et on divise par l'effectif total.
          </p>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono">
             Moyenne = Somme des valeurs / Effectif Total
          </div>
        </div>

        {/* Médiane */}
        <div className="border-t pt-4">
          <h4 className="font-bold text-lg text-indigo-700 mb-2">La Médiane</h4>
          <p className="text-gray-700 mb-2">
            C'est la valeur qui coupe la série <strong>ordonnée</strong> en deux groupes de même effectif (50% inférieurs, 50% supérieurs).
          </p>
           <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Effectif Impair :</strong> La valeur juste au milieu.</li>
              <li><strong>Effectif Pair :</strong> La moyenne des deux valeurs centrales.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'dispersion',
    title: '4. Quartiles et Dispersion',
    description: 'Comprendre comment les valeurs sont réparties (Q1, Q3, Étendue).',
    content: (
      <div className="space-y-6">
        <p className="text-gray-700">
           Pour savoir si les données sont regroupées ou très étalées, on utilise des indicateurs de dispersion.
        </p>

        {/* Étendue */}
        <div className="bg-white p-4 rounded border">
            <h4 className="font-bold text-green-700">L'Étendue</h4>
            <p className="text-sm">Différence entre la plus grande et la plus petite valeur.</p>
            <p className="font-mono bg-green-50 p-1 mt-1 text-sm">Étendue = Max - Min</p>
        </div>

        {/* Quartiles */}
        <div>
            <h4 className="font-bold text-purple-700 mb-2">Les Quartiles (Q1 et Q3)</h4>
            <p className="text-gray-700 text-sm mb-2">
                Les quartiles partagent la série ordonnée en 4 parties.
            </p>
            <ul className="space-y-3">
                <li className="bg-purple-50 p-3 rounded">
                    <strong>Q1 (Premier Quartile) :</strong> La plus petite valeur telle qu'au moins 25% des données soient inférieures ou égales à elle.<br/>
                    <span className="text-xs text-purple-600">Calcul du rang : N ÷ 4 (arrondi à l'entier supérieur).</span>
                </li>
                <li className="bg-purple-50 p-3 rounded">
                    <strong>Q3 (Troisième Quartile) :</strong> La plus petite valeur telle qu'au moins 75% des données soient inférieures ou égales à elle.<br/>
                    <span className="text-xs text-purple-600">Calcul du rang : 3 × N ÷ 4 (arrondi à l'entier supérieur).</span>
                </li>
            </ul>
        </div>

        {/* Écart Inter-quartile */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h4 className="font-bold mb-1">L'Écart Inter-quartile</h4>
            <p className="text-sm mb-2">C'est la largeur de la zone où se trouvent les 50% de valeurs centrales.</p>
            <p className="font-mono text-center text-lg">I = Q3 - Q1</p>
        </div>
      </div>
    )
  }
];

export const Lesson: React.FC = () => {
  const [openLesson, setOpenLesson] = useState<string | null>('effectifs');

  const toggleLesson = (id: string) => {
    setOpenLesson(openLesson === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <BookOpen className="text-indigo-600" />
        Cours de Statistiques
      </h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all">
            <button
              onClick={() => toggleLesson(lesson.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 focus:outline-none"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>
              </div>
              {openLesson === lesson.id ? (
                <ChevronDown className="text-indigo-600" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </button>
            
            {openLesson === lesson.id && (
              <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                <div className="prose max-w-none mt-4">
                  {lesson.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};