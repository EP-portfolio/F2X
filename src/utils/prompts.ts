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

// ============================================================
// PROMPTS D'ANALYSE AMÉLIORÉS POUR COMPUTER VISION
// ============================================================

interface AnalysisContext {
   exerciseTitle: string;
   exerciseProblem: string;
   exerciseType: 'table' | 'frequency' | 'indicators' | 'problem';
   rawData?: any;
   language: Language;
}

export function genererPromptAnalyse(context: AnalysisContext): string {
   const { exerciseTitle, exerciseProblem, exerciseType, rawData, language } = context;

   if (language === 'fr') {
      const basePrompt = `Tu es un professeur de mathématiques expert en correction de copies. Tu dois analyser une photo de devoir d'un élève de 3ème.

EXERCICE À CORRIGER :
- Titre : "${exerciseTitle}"
- Consigne : "${exerciseProblem}"

INSTRUCTIONS GÉNÉRALES D'ANALYSE :
1. **Lecture attentive** : Examine minutieusement l'image. Détecte tous les textes, nombres, tableaux, calculs et graphiques présents.
2. **OCR précis** : Transcrit fidèlement tous les nombres, opérations mathématiques et textes visibles, même s'ils sont écrits à la main.
3. **Détection de structure** : Identifie les tableaux, colonnes, lignes, et leur organisation.
4. **Analyse des calculs** : Vérifie chaque étape de calcul, les formules utilisées, et les résultats obtenus.
5. **Tolérance** : Accepte les variations d'écriture manuscrite, les ratures, et les erreurs de formatage mineures.

`;

      let specificInstructions = '';

      if (exerciseType === 'table') {
         specificInstructions = `
INSTRUCTIONS SPÉCIFIQUES - TABLEAU D'EFFECTIFS :
1. **Vérification du tableau** :
   - Identifie toutes les valeurs uniques présentes dans les données brutes
   - Vérifie que chaque valeur apparaît une seule fois dans la colonne "Valeur"
   - Compte les effectifs pour chaque valeur et vérifie que les totaux sont corrects
   - Vérifie que la somme des effectifs correspond au total des données

2. **Points à vérifier** :
   - Toutes les valeurs sont-elles présentes ?
   - Les effectifs sont-ils corrects ?
   - Le total est-il correct ?
   - Le tableau est-il bien formaté ?

3. **Feedback** :
   - Si correct : Félicite l'élève et confirme chaque point
   - Si incorrect : Indique précisément quelles valeurs ou effectifs sont erronés, et explique comment les corriger
`;

         if (rawData) {
            specificInstructions += `
DONNÉES ATTENDUES (pour référence) :
- Valeurs : ${rawData.valeurs?.join(', ') || 'N/A'}
- Effectifs : ${rawData.effectifs?.join(', ') || 'N/A'}
- Total : ${rawData.total || 'N/A'}
`;
         }
      } else if (exerciseType === 'frequency') {
         // Calculer les fréquences attendues avec les bons arrondis
         let frequencesAttendues = '';
         if (rawData?.valeurs && rawData?.effectifs && rawData?.total) {
            frequencesAttendues = '\nFRÉQUENCES ATTENDUES (pour référence) :\n';
            rawData.valeurs.forEach((val: number, idx: number) => {
               const eff = rawData.effectifs[idx];
               const decimalExact = eff / rawData.total;
               // Arrondir au centième (2 décimales)
               const decimalArrondi = Math.round(decimalExact * 100) / 100;
               // Arrondir le pourcentage à l'unité
               const pctRounded = Math.round(decimalExact * 100);
               // Calculer la fraction simplifiée
               const pgcd = (a: number, b: number): number => {
                  a = Math.abs(a);
                  b = Math.abs(b);
                  while (b !== 0) {
                     const t = b;
                     b = a % b;
                     a = t;
                  }
                  return a;
               };
               const diviseur = pgcd(eff, rawData.total);
               const fraction = `${eff / diviseur}/${rawData.total / diviseur}`;
               frequencesAttendues += `- Valeur ${val}: Fraction = ${fraction} (accepte non réduites), Décimal = ${decimalArrondi.toFixed(2).replace('.', ',')} (arrondi au centième), % = ${pctRounded}% (arrondi à l'unité)\n`;
            });
         }

         specificInstructions = `
INSTRUCTIONS SPÉCIFIQUES - CALCUL DE FRÉQUENCES :
1. **Règles d'arrondi OBLIGATOIRES pour cet exercice** :
   - Fréquences décimales : TOUJOURS arrondies au CENTIÈME (2 décimales)
   - Fréquences en pourcentage : TOUJOURS arrondies à L'UNITÉ (0 décimales)
   - Fréquences en fraction : accepte les fractions non réduites (ex: 2/16 au lieu de 1/8)

2. **Vérification des fréquences** :
   - Vérifie que les fréquences en fraction correspondent à Effectif / Total (peuvent être non réduites)
   - Vérifie que les fréquences décimales sont arrondies au CENTIÈME (ex: 0,13 pour 2/16 = 0,125)
   - Vérifie que les fréquences en pourcentage sont arrondies à L'UNITÉ (ex: 13% pour 2/16 = 12,5%)
   - Vérifie que la somme des fréquences décimales ≈ 1,00 (tolérance ±0,01)
   - Vérifie que la somme des fréquences en % ≈ 100% (tolérance ±1%)

3. **Calculs à vérifier** :
   - Fréquence (fraction) = Effectif / Total
   - Fréquence (décimal) = Arrondi(Effectif / Total, 2 décimales) → au CENTIÈME
   - Fréquence (%) = Arrondi((Effectif / Total) × 100, 0 décimales) → à L'UNITÉ

4. **Points critiques** :
   - Les arrondis respectent-ils les règles ci-dessus ?
   - Les conversions entre fraction, décimal et pourcentage sont-elles cohérentes ?
   - La somme des fréquences est-elle proche de 1 (ou 100%) ?

5. **IMPORTANT - Utilisation des fréquences attendues** :
   - Utilise EXACTEMENT les fréquences attendues ci-dessous pour comparer avec le travail de l'élève
   - Si tu mentionnes les fréquences correctes dans ton feedback, COPIE EXACTEMENT les valeurs des fréquences attendues (sans utiliser "≈", utilise "=")
   - Les fréquences décimales doivent TOUJOURS être affichées avec EXACTEMENT 2 chiffres après la virgule (ex: 0,11, 0,22, 0,56) - JAMAIS "≈ 0" ou "≈ 1"
   - Les fréquences en pourcentage doivent TOUJOURS être arrondies à L'UNITÉ (0 décimales, ex: 11%, 22%, 56%)

6. **Format de feedback pour les fréquences** :
   - Quand tu listes les fréquences attendues, utilise EXACTEMENT ce format :
     • Fréq fraction de X attendue = [fraction] (accepte non réduites)
     • Fréq décimale de X attendue = [valeur avec 2 décimales, ex: 0,11] (arrondi au centième)
     • Fréq % de X attendue = [valeur entière]% (arrondie à l'unité)
   - NE PAS utiliser "≈" - utiliser "="
   - NE PAS arrondir les décimales à 0 ou 1 - TOUJOURS afficher 2 décimales

7. **Feedback** :
   - Si correct : Valide chaque colonne et félicite
   - Si incorrect : Indique précisément quelles fréquences sont fausses, montre le calcul correct en COPIANT EXACTEMENT les valeurs des fréquences attendues ci-dessous (avec 2 décimales pour les décimales), et explique l'erreur
${frequencesAttendues}
`;
      } else if (exerciseType === 'indicators') {
         specificInstructions = `
INSTRUCTIONS SPÉCIFIQUES - INDICATEURS STATISTIQUES :
1. **Vérification des calculs** :
   - **Moyenne** : Vérifie que la formule (Somme des valeurs / Nombre de valeurs) est correctement appliquée
   - **Médiane** : Vérifie que les données sont triées, puis que la valeur médiane est correctement identifiée
   - **Q1 (Premier Quartile)** : Vérifie le calcul au rang N/4
   - **Q3 (Troisième Quartile)** : Vérifie le calcul au rang 3N/4
   - **Étendue** : Vérifie que c'est bien (Maximum - Minimum)
   - **Écart interquartile** : Vérifie que c'est bien (Q3 - Q1)

2. **Points à vérifier** :
   - Les données sont-elles correctement triées pour la médiane et les quartiles ?
   - Les formules sont-elles correctement appliquées ?
   - Les résultats sont-ils arrondis correctement si nécessaire ?
   - Tous les indicateurs demandés sont-ils présents ?

3. **Feedback OBLIGATOIRE - Explications de calcul détaillées** :
   - **CRITIQUE** : Même si l'élève a tout juste, tu DOIS afficher TOUTES les explications de calcul détaillées ci-dessous
   - **NE PAS** simplement dire "Correct" ou lister les valeurs attendues sans explications
   - **TU DOIS** reproduire EXACTEMENT le format et le contenu des explications attendues fournies ci-dessous
   - **ÉTAPE PRÉLIMINAIRE OBLIGATOIRE** : Commence TOUJOURS par rappeler qu'on réarrange la liste dans l'ordre croissant
     Format EXACT : "Étape 1 : Réarranger la liste dans l'ordre croissant\nSérie triée : [liste triée]"
   - **Moyenne** : Montre la somme de toutes les valeurs, puis la division par le nombre de valeurs
     Format EXACT : "1. Moyenne = ([valeurs séparées par +]) / [n] = [somme] / [n] = [résultat] [unité]"
   - **Médiane** : TOUJOURS utiliser la formule (n+1)/2 pour calculer le rang
     * Si nombre pair : Format EXACT sur plusieurs lignes :
       "2. Médiane : Rang = ([n] + 1) / 2 = [résultat décimal] (nombre pair)\n   Médiane = (valeur au rang [floor(rang)] + valeur au rang [ceil(rang)]) / 2\n   Médiane = ([val1] + [val2]) / 2 = [résultat] [unité]"
     * Si nombre impair : Format EXACT :
       "2. Médiane : Rang = ([n] + 1) / 2 = [rang entier]\n   Médiane = valeur au rang [rang] = [valeur] [unité]"
   - **Q1** : Format EXACT sur plusieurs lignes :
     "3. Q1 : Rang = [n] / 4 = [résultat] → rang [rang final]\n   Q1 = valeur au rang [rang final] = [valeur]"
   - **Q3** : Format EXACT sur plusieurs lignes :
     "4. Q3 : Rang = 3 × [n] / 4 = [résultat] → rang [rang final]\n   Q3 = valeur au rang [rang final] = [valeur]"
   - **Écart interquartile** : Format EXACT :
     "5. Écart Inter-quartile = Q3 - Q1 = [q3] - [q1] = [résultat]"
   - **Si correct** : Commence par "✅ Correct" puis affiche TOUTES les explications de calcul détaillées ci-dessous (copie-les exactement)
   - **Si incorrect** : Indique quel(s) indicateur(s) est/sont faux, puis montre le calcul correct avec TOUTES les étapes détaillées (copie le format exact des explications attendues)
`;

         if (rawData) {
            const rawList = rawData.rawList || [];
            const sortedData = rawList.length > 0 ? [...rawList].sort((a, b) => a - b) : [];
            const n = sortedData.length;
            const sum = sortedData.reduce((a, b) => a + b, 0);

            let meanExplanation = '';
            let medianExplanation = '';
            let q1Explanation = '';
            let q3Explanation = '';
            let iqrExplanation = '';

            if (n > 0) {
               const sortReminder = `Étape 1 : Réarranger la liste dans l'ordre croissant\nSérie triée : ${sortedData.join(', ')}`;

               meanExplanation = `1. Moyenne = (${sortedData.join(' + ')}) / ${n} = ${sum} / ${n} = ${rawData.mean || 'N/A'} ${rawData.unit || ''}`;

               // Médiane : TOUJOURS utiliser (n+1)/2
               const medianRank = (n + 1) / 2;
               if (n % 2 === 0) {
                  // Nombre pair : (n+1)/2 donne un décimal, on prend la moyenne des deux valeurs autour
                  const mid1 = sortedData[Math.floor(medianRank) - 1];
                  const mid2 = sortedData[Math.floor(medianRank)];
                  const rank1 = Math.floor(medianRank);
                  const rank2 = Math.ceil(medianRank);
                  medianExplanation = `2. Médiane : Rang = (${n} + 1) / 2 = ${medianRank} (nombre pair)\n   Médiane = (valeur au rang ${rank1} + valeur au rang ${rank2}) / 2\n   Médiane = (${mid1} + ${mid2}) / 2 = ${(mid1 + mid2) / 2} ${rawData.unit || ''}`;
               } else {
                  // Nombre impair : (n+1)/2 donne un entier
                  const midRankInt = Math.round(medianRank);
                  const mid = sortedData[midRankInt - 1];
                  medianExplanation = `2. Médiane : Rang = (${n} + 1) / 2 = ${midRankInt}\n   Médiane = valeur au rang ${midRankInt} = ${mid} ${rawData.unit || ''}`;
               }

               const q1Index = Math.ceil(n / 4) - 1;
               const q3Index = Math.ceil((3 * n) / 4) - 1;
               const q1Rank = q1Index + 1;
               const q3Rank = q3Index + 1;
               q1Explanation = `3. Q1 : Rang = ${n} / 4 = ${n / 4} → rang ${q1Rank}\n   Q1 = valeur au rang ${q1Rank} = ${rawData.q1 || 'N/A'}`;
               q3Explanation = `4. Q3 : Rang = 3 × ${n} / 4 = ${(3 * n) / 4} → rang ${q3Rank}\n   Q3 = valeur au rang ${q3Rank} = ${rawData.q3 || 'N/A'}`;
               iqrExplanation = `5. Écart Inter-quartile = Q3 - Q1 = ${rawData.q3 || 'N/A'} - ${rawData.q1 || 'N/A'} = ${rawData.iqr || 'N/A'}`;

               specificInstructions += `
RÉSULTATS ATTENDUS AVEC EXPLICATIONS DE CALCUL COMPLÈTES (COPIE EXACTEMENT CES EXPLICATIONS) :

${sortReminder}
${meanExplanation || `Moyenne : ${rawData.mean || 'N/A'} ${rawData.unit || ''}`}
${medianExplanation || `Médiane : ${rawData.median || 'N/A'} ${rawData.unit || ''}`}
${q1Explanation || `Q1 : ${rawData.q1 || 'N/A'}`}
${q3Explanation || `Q3 : ${rawData.q3 || 'N/A'}`}
${iqrExplanation || `Écart interquartile : ${rawData.iqr || 'N/A'}`}

⚠️ INSTRUCTIONS CRITIQUES ⚠️
- Même si l'élève a tout juste, tu DOIS afficher TOUTES les explications ci-dessus dans ton feedback
- COPIE EXACTEMENT le texte ci-dessus (sauf si l'élève a fait des erreurs, dans ce cas corrige uniquement les parties erronées)
- NE PAS simplement dire "Correct" ou lister les valeurs sans les explications détaillées
- Ton feedback doit contenir EXACTEMENT le même niveau de détail que les explications ci-dessus
- Si tout est correct, commence par "✅ Correct" puis copie TOUTES les explications ci-dessus
- Si il y a des erreurs, indique-les puis copie les explications correctes pour chaque indicateur
`;
            } else {
               specificInstructions += `
RÉSULTATS ATTENDUS (pour référence) :
- Moyenne : ${rawData.mean || 'N/A'} ${rawData.unit || ''}
- Médiane : ${rawData.median || 'N/A'} ${rawData.unit || ''}
- Q1 : ${rawData.q1 || 'N/A'}
- Q3 : ${rawData.q3 || 'N/A'}
- Écart interquartile : ${rawData.iqr || 'N/A'}
`;
            }
         }
      } else if (exerciseType === 'problem') {
         specificInstructions = `
INSTRUCTIONS SPÉCIFIQUES - RÉSOLUTION DE PROBLÈME :
1. **Analyse de la réponse** :
   - Identifie la réponse finale de l'élève
   - Vérifie si l'élève a choisi la bonne option (si applicable)
   - Analyse le raisonnement et les justifications fournies

2. **Vérification du raisonnement** :
   - L'élève a-t-il utilisé les bons indicateurs statistiques ?
   - Le raisonnement est-il logique et cohérent ?
   - Les justifications sont-elles pertinentes ?

3. **Feedback** :
   - Si correct : Félicite et valide le raisonnement
   - Si incorrect : Explique pourquoi la réponse est fausse, indique la bonne réponse, et guide l'élève vers le bon raisonnement
`;
      }

      return basePrompt + specificInstructions + `

FORMAT DE RÉPONSE ATTENDU :
- Commence par un verdict clair : "✅ Correct" ou "❌ À corriger"
- Liste les points vérifiés
- Pour chaque erreur, explique clairement et propose la correction
- Sois encourageant et pédagogique
- Utilise des puces (*) pour structurer ta réponse
`;
   } else {
      // English version
      const basePrompt = `You are an expert math teacher specialized in grading student homework. You must analyze a photo of a 3rd grade student's work.

EXERCISE TO GRADE :
- Title : "${exerciseTitle}"
- Instructions : "${exerciseProblem}"

GENERAL ANALYSIS INSTRUCTIONS :
1. **Careful reading** : Examine the image meticulously. Detect all texts, numbers, tables, calculations, and graphs present.
2. **Precise OCR** : Faithfully transcribe all numbers, mathematical operations, and visible texts, even if handwritten.
3. **Structure detection** : Identify tables, columns, rows, and their organization.
4. **Calculation analysis** : Verify each calculation step, formulas used, and results obtained.
5. **Tolerance** : Accept variations in handwriting, erasures, and minor formatting errors.

`;

      let specificInstructions = '';

      if (exerciseType === 'table') {
         specificInstructions = `
SPECIFIC INSTRUCTIONS - FREQUENCY TABLE :
1. **Table verification** :
   - Identify all unique values present in the raw data
   - Verify that each value appears only once in the "Value" column
   - Count frequencies for each value and verify totals are correct
   - Verify that the sum of frequencies matches the total data count

2. **Points to check** :
   - Are all values present?
   - Are frequencies correct?
   - Is the total correct?
   - Is the table well formatted?

3. **Feedback** :
   - If correct : Congratulate the student and confirm each point
   - If incorrect : Precisely indicate which values or frequencies are wrong, and explain how to correct them
`;

         if (rawData) {
            specificInstructions += `
EXPECTED DATA (for reference) :
- Values : ${rawData.valeurs?.join(', ') || 'N/A'}
- Frequencies : ${rawData.effectifs?.join(', ') || 'N/A'}
- Total : ${rawData.total || 'N/A'}
`;
         }
      } else if (exerciseType === 'frequency') {
         // Calculate expected frequencies with correct rounding
         let frequencesAttendues = '';
         if (rawData?.valeurs && rawData?.effectifs && rawData?.total) {
            frequencesAttendues = '\nEXPECTED FREQUENCIES (for reference) :\n';
            rawData.valeurs.forEach((val: number, idx: number) => {
               const eff = rawData.effectifs[idx];
               const decimalExact = eff / rawData.total;
               // Round to hundredth (2 decimals)
               const decimalArrondi = Math.round(decimalExact * 100) / 100;
               // Round percentage to unit
               const pctRounded = Math.round(decimalExact * 100);
               // Calculate simplified fraction
               const pgcd = (a: number, b: number): number => {
                  a = Math.abs(a);
                  b = Math.abs(b);
                  while (b !== 0) {
                     const t = b;
                     b = a % b;
                     a = t;
                  }
                  return a;
               };
               const diviseur = pgcd(eff, rawData.total);
               const fraction = `${eff / diviseur}/${rawData.total / diviseur}`;
               frequencesAttendues += `- Value ${val}: Fraction = ${fraction} (non-reduced accepted), Decimal = ${decimalArrondi.toFixed(2)} (rounded to hundredth), % = ${pctRounded}% (rounded to unit)\n`;
            });
         }

         specificInstructions = `
SPECIFIC INSTRUCTIONS - RELATIVE FREQUENCY CALCULATION :
1. **MANDATORY rounding rules for this exercise** :
   - Decimal frequencies : ALWAYS rounded to the HUNDREDTH (2 decimals)
   - Percentage frequencies : ALWAYS rounded to the UNIT (0 decimals)
   - Fraction frequencies : non-reduced fractions accepted (e.g. 2/16 instead of 1/8)

2. **Frequency verification** :
   - Verify that fraction frequencies correspond to Count / Total (can be non-reduced)
   - Verify that decimal frequencies are rounded to the HUNDREDTH (e.g. 0.13 for 2/16 = 0.125)
   - Verify that percentage frequencies are rounded to the UNIT (e.g. 13% for 2/16 = 12.5%)
   - Verify that the sum of decimal frequencies ≈ 1.00 (tolerance ±0.01)
   - Verify that the sum of percentage frequencies ≈ 100% (tolerance ±1%)

3. **Calculations to verify** :
   - Frequency (fraction) = Count / Total
   - Frequency (decimal) = Round(Count / Total, 2 decimals) → to HUNDREDTH
   - Frequency (%) = Round((Count / Total) × 100, 0 decimals) → to UNIT

4. **Critical points** :
   - Do rounding respect the rules above?
   - Are conversions between fraction, decimal, and percentage consistent?
   - Does the sum of frequencies equal approximately 1 (or 100%)?

5. **IMPORTANT - Using expected frequencies** :
   - Use EXACTLY the expected frequencies below to compare with the student's work
   - If you mention correct frequencies in your feedback, COPY EXACTLY the values from the expected frequencies (do not use "≈", use "=")
   - Decimal frequencies must ALWAYS be displayed with EXACTLY 2 digits after the decimal point (e.g. 0.11, 0.22, 0.56) - NEVER "≈ 0" or "≈ 1"
   - Percentage frequencies must ALWAYS be rounded to the UNIT (0 decimals, e.g. 11%, 22%, 56%)

6. **Feedback format for frequencies** :
   - When listing expected frequencies, use EXACTLY this format :
     • Freq fraction of X expected = [fraction] (non-reduced accepted)
     • Freq decimal of X expected = [value with 2 decimals, e.g. 0.11] (rounded to hundredth)
     • Freq % of X expected = [whole number]% (rounded to unit)
   - DO NOT use "≈" - use "="
   - DO NOT round decimals to 0 or 1 - ALWAYS display 2 decimals

7. **Feedback** :
   - If correct : Validate each column and congratulate
   - If incorrect : Precisely indicate which frequencies are wrong, show the correct calculation by COPYING EXACTLY the values from the expected frequencies below (with 2 decimals for decimals), and explain the error
${frequencesAttendues}
`;
      } else if (exerciseType === 'indicators') {
         specificInstructions = `
SPECIFIC INSTRUCTIONS - STATISTICAL INDICATORS :
1. **Calculation verification** :
   - **Mean** : Verify that the formula (Sum of values / Number of values) is correctly applied
   - **Median** : Verify that data is sorted, then that the median value is correctly identified
   - **Q1 (First Quartile)** : Verify calculation at rank N/4
   - **Q3 (Third Quartile)** : Verify calculation at rank 3N/4
   - **Range** : Verify that it's (Maximum - Minimum)
   - **Interquartile Range** : Verify that it's (Q3 - Q1)

2. **Points to check** :
   - Is data correctly sorted for median and quartiles?
   - Are formulas correctly applied?
   - Are results correctly rounded if necessary?
   - Are all requested indicators present?

3. **MANDATORY Feedback - Detailed calculation explanations** :
   - **CRITICAL** : Even if the student got everything right, you MUST display ALL the detailed calculation explanations below
   - **DO NOT** simply say "Correct" or list expected values without explanations
   - **YOU MUST** reproduce EXACTLY the format and content of the expected explanations provided below
   - **MANDATORY PRELIMINARY STEP** : ALWAYS start by reminding that we rearrange the list in ascending order
     EXACT Format : "Step 1: Rearrange the list in ascending order\nSorted series: [sorted list]"
   - **Mean** : Show the sum of all values, then the division by the number of values
     EXACT Format : "1. Mean = ([values separated by +]) / [n] = [sum] / [n] = [result] [unit]"
   - **Median** : ALWAYS use the formula (n+1)/2 to calculate the rank
     * If even number : EXACT Format on multiple lines :
       "2. Median: Rank = ([n] + 1) / 2 = [decimal result] (even number)\n   Median = (value at rank [floor(rank)] + value at rank [ceil(rank)]) / 2\n   Median = ([val1] + [val2]) / 2 = [result] [unit]"
     * If odd number : EXACT Format :
       "2. Median: Rank = ([n] + 1) / 2 = [integer rank]\n   Median = value at rank [rank] = [value] [unit]"
   - **Q1** : EXACT Format on multiple lines :
     "3. Q1: Rank = [n] / 4 = [result] → rank [final rank]\n   Q1 = value at rank [final rank] = [value]"
   - **Q3** : EXACT Format on multiple lines :
     "4. Q3: Rank = 3 × [n] / 4 = [result] → rank [final rank]\n   Q3 = value at rank [final rank] = [value]"
   - **Interquartile Range** : EXACT Format :
     "5. Interquartile Range = Q3 - Q1 = [q3] - [q1] = [result]"
   - **If correct** : Start with "✅ Correct" then display ALL the detailed calculation explanations below (copy them exactly)
   - **If incorrect** : Indicate which indicator(s) is/are wrong, then show the correct calculation with ALL detailed steps (copy the exact format of expected explanations)
`;

         if (rawData) {
            const rawList = rawData.rawList || [];
            const sortedData = rawList.length > 0 ? [...rawList].sort((a, b) => a - b) : [];
            const n = sortedData.length;
            const sum = sortedData.reduce((a, b) => a + b, 0);

            let meanExplanation = '';
            let medianExplanation = '';
            let q1Explanation = '';
            let q3Explanation = '';
            let iqrExplanation = '';

            if (n > 0) {
               const sortReminder = `Step 1: Rearrange the list in ascending order\nSorted series: ${sortedData.join(', ')}`;

               meanExplanation = `1. Mean = (${sortedData.join(' + ')}) / ${n} = ${sum} / ${n} = ${rawData.mean || 'N/A'} ${rawData.unit || ''}`;

               // Median: ALWAYS use (n+1)/2
               const medianRank = (n + 1) / 2;
               if (n % 2 === 0) {
                  // Even number: (n+1)/2 gives a decimal, take the average of the two values around
                  const mid1 = sortedData[Math.floor(medianRank) - 1];
                  const mid2 = sortedData[Math.floor(medianRank)];
                  const rank1 = Math.floor(medianRank);
                  const rank2 = Math.ceil(medianRank);
                  medianExplanation = `2. Median: Rank = (${n} + 1) / 2 = ${medianRank} (even number)\n   Median = (value at rank ${rank1} + value at rank ${rank2}) / 2\n   Median = (${mid1} + ${mid2}) / 2 = ${(mid1 + mid2) / 2} ${rawData.unit || ''}`;
               } else {
                  // Odd number: (n+1)/2 gives an integer
                  const midRankInt = Math.round(medianRank);
                  const mid = sortedData[midRankInt - 1];
                  medianExplanation = `2. Median: Rank = (${n} + 1) / 2 = ${midRankInt}\n   Median = value at rank ${midRankInt} = ${mid} ${rawData.unit || ''}`;
               }

               const q1Index = Math.ceil(n / 4) - 1;
               const q3Index = Math.ceil((3 * n) / 4) - 1;
               const q1Rank = q1Index + 1;
               const q3Rank = q3Index + 1;
               q1Explanation = `3. Q1: Rank = ${n} / 4 = ${n / 4} → rank ${q1Rank}\n   Q1 = value at rank ${q1Rank} = ${rawData.q1 || 'N/A'}`;
               q3Explanation = `4. Q3: Rank = 3 × ${n} / 4 = ${(3 * n) / 4} → rank ${q3Rank}\n   Q3 = value at rank ${q3Rank} = ${rawData.q3 || 'N/A'}`;
               iqrExplanation = `5. Interquartile Range = Q3 - Q1 = ${rawData.q3 || 'N/A'} - ${rawData.q1 || 'N/A'} = ${rawData.iqr || 'N/A'}`;

               specificInstructions += `
EXPECTED RESULTS WITH COMPLETE CALCULATION EXPLANATIONS (COPY EXACTLY THESE EXPLANATIONS) :

${sortReminder}
${meanExplanation || `Mean : ${rawData.mean || 'N/A'} ${rawData.unit || ''}`}
${medianExplanation || `Median : ${rawData.median || 'N/A'} ${rawData.unit || ''}`}
${q1Explanation || `Q1 : ${rawData.q1 || 'N/A'}`}
${q3Explanation || `Q3 : ${rawData.q3 || 'N/A'}`}
${iqrExplanation || `Interquartile Range : ${rawData.iqr || 'N/A'}`}

⚠️ CRITICAL INSTRUCTIONS ⚠️
- Even if the student got everything right, you MUST display ALL the explanations above in your feedback
- COPY EXACTLY the text above (except if the student made errors, in which case correct only the erroneous parts)
- DO NOT simply say "Correct" or list values without detailed explanations
- Your feedback must contain EXACTLY the same level of detail as the explanations above
- If everything is correct, start with "✅ Correct" then copy ALL the explanations above
- If there are errors, indicate them then copy the correct explanations for each indicator
`;
            } else {
               specificInstructions += `
EXPECTED RESULTS (for reference) :
- Mean : ${rawData.mean || 'N/A'} ${rawData.unit || ''}
- Median : ${rawData.median || 'N/A'} ${rawData.unit || ''}
- Q1 : ${rawData.q1 || 'N/A'}
- Q3 : ${rawData.q3 || 'N/A'}
- Interquartile Range : ${rawData.iqr || 'N/A'}
`;
            }
         }
      } else if (exerciseType === 'problem') {
         specificInstructions = `
SPECIFIC INSTRUCTIONS - PROBLEM SOLVING :
1. **Answer analysis** :
   - Identify the student's final answer
   - Verify if the student chose the correct option (if applicable)
   - Analyze the reasoning and justifications provided

2. **Reasoning verification** :
   - Did the student use the correct statistical indicators?
   - Is the reasoning logical and coherent?
   - Are justifications relevant?

3. **Feedback** :
   - If correct : Congratulate and validate the reasoning
   - If incorrect : Explain why the answer is wrong, indicate the correct answer, and guide the student toward correct reasoning
`;
      }

      return basePrompt + specificInstructions + `

EXPECTED RESPONSE FORMAT :
- Start with a clear verdict : "✅ Correct" or "❌ Needs correction"
- List checked points
- For each error, explain clearly and propose the correction
- Be encouraging and pedagogical
- Use bullets (*) to structure your response
`;
   }
}