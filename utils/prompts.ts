import { ExerciseData } from './exerciseGenerator';
import { Language } from '../types';

// ============================================================
// CONTEXTE FEW-SHOT (FRANCAIS)
// ============================================================

const CONTEXTE_GENERATION_ENONCES_FR = `
Tu es un générateur d'exercices de mathématiques pour le Brevet des Collèges (3ème).
Tu dois créer des énoncés de problèmes sur les TABLEAUX D'EFFECTIFS ET FRÉQUENCES.
Style : Brevet, scolaire, précis.

RÈGLES :
1. Contexte réaliste.
2. Données brutes fournies.
3. Tableau à compléter (Valeurs, Effectifs, Fréquences).
4. Précision d'arrondi explicite.

EXEMPLE (Style attendu) :
"Voici les notes d'une classe. Calculer l'étendue. Compléter le tableau des fréquences (arrondir au dixième). Quelle est la moyenne ?"
`;

// ============================================================
// FEW-SHOT CONTEXT (ENGLISH)
// ============================================================

const CONTEXTE_GENERATION_ENONCES_EN = `
You are a math exercise generator for 9th Grade (Year 10 / 3ème) students.
You must create problem statements regarding FREQUENCY TABLES AND STATISTICS.
Style: Formal exam style (GCSE / SAT style), precise.

RULES:
1. Realistic context.
2. Raw data provided.
3. Table to complete (Values, Frequency, Relative Frequency).
4. Rounding precision explicit.

EXAMPLE (Expected style):
"Here are the test scores of a class. Calculate the range. Complete the frequency table (round to one decimal place). What is the mean score?"
`;

// Structure pour générer un prompt complet
export function genererPromptEnonce(exercice: ExerciseData, lang: Language = 'fr') {
  if (lang === 'fr') {
      const donneesExercice = `
DONNÉES DE L'EXERCICE À CRÉER :
- Thème : ${exercice.titre}
- Valeurs du caractère : ${exercice.valeurs.join(', ')}
- Effectifs correspondants : ${exercice.effectifs.join(', ')}
- Effectif total : ${exercice.total}
- Précision d'arrondi : ${exercice.arrondi.texteEnonce}

CONSIGNES POUR L'ÉNONCÉ :
1. Invente un contexte réaliste lié au thème "${exercice.titre}"
2. Présente les données brutes.
3. Demande de compléter un tableau avec : Valeur | Effectif | Fréquence (fraction) | Fréquence (décimale) | Fréquence (%)
4. Mentionne l'arrondi : "${exercice.arrondi.texteEnonce}".
5. Ajoute 1 ou 2 questions d'interprétation.
6. Ne donne PAS la correction.
`;
      return CONTEXTE_GENERATION_ENONCES_FR + donneesExercice;
  } else {
      const donneesExercice = `
EXERCISE DATA TO CREATE:
- Topic: ${exercice.titre}
- Values: ${exercice.valeurs.join(', ')}
- Counts (Frequency): ${exercice.effectifs.join(', ')}
- Total Count: ${exercice.total}
- Rounding Precision: ${exercice.arrondi.texteEnonce}

INSTRUCTIONS FOR THE PROBLEM STATEMENT:
1. Invent a realistic context related to "${exercice.titre}".
2. Present the raw data.
3. Ask to complete a table with: Value | Frequency | Relative Freq (fraction) | Relative Freq (decimal) | Relative Freq (%)
4. Mention rounding: "${exercice.arrondi.texteEnonce}".
5. Add 1 or 2 interpretation questions.
6. Do NOT provide the solution.
`;
      return CONTEXTE_GENERATION_ENONCES_EN + donneesExercice;
  }
}

// Structure pour générer un prompt de correction
export function genererPromptCorrection(exercice: ExerciseData, lang: Language = 'fr') {
  if (lang === 'fr') {
    return `
Tu dois générer la CORRECTION COMPLÈTE de cet exercice de statistiques.
DONNÉES : Thème: ${exercice.titre}, Valeurs: ${exercice.valeurs.join(', ')}, Effectifs: ${exercice.effectifs.join(', ')}, Total: ${exercice.total}.
GÉNÈRE :
1. Le tableau complété.
2. Les calculs détaillés.
3. Les réponses aux questions.
Langue : Français.
`;
  } else {
    return `
You must generate the FULL SOLUTION for this statistics exercise.
DATA: Topic: ${exercice.titre}, Values: ${exercice.valeurs.join(', ')}, Frequencies: ${exercice.effectifs.join(', ')}, Total: ${exercice.total}.
GENERATE:
1. The completed table.
2. Detailed calculations.
3. Answers to questions.
Language: English.
`;
  }
}