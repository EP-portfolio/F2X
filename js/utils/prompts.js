export function genererPromptAnalyse(context) {
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
      specificInstructions = `
INSTRUCTIONS SPÉCIFIQUES - CALCUL DE FRÉQUENCES :
1. **Vérification des fréquences** :
   - Vérifie que les fréquences en fraction sont simplifiées au maximum
   - Vérifie que les fréquences décimales respectent la précision demandée
   - Vérifie que les fréquences en pourcentage sont cohérentes avec les décimales
   - Vérifie que la somme des fréquences décimales/pourcentages est égale à 1/100%

2. **Calculs à vérifier** :
   - Fréquence (fraction) = Effectif / Total
   - Fréquence (décimal) = Arrondi(Effectif / Total, précision)
   - Fréquence (%) = Arrondi((Effectif / Total) × 100, précision)

3. **Feedback** :
   - Si correct : Valide chaque colonne et félicite
   - Si incorrect : Indique précisément quelles fréquences sont fausses, montre le calcul correct, et explique l'erreur
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

2. **Feedback** :
   - Si correct : Valide chaque indicateur et explique brièvement la méthode
   - Si incorrect : Indique quel(s) indicateur(s) est/sont faux, montre le calcul étape par étape, et explique l'erreur
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
    // English version - similar structure
    return `You are an expert math teacher specialized in grading student homework. You must analyze a photo of a 3rd grade student's work.

EXERCISE TO GRADE :
- Title : "${exerciseTitle}"
- Instructions : "${exerciseProblem}"

GENERAL ANALYSIS INSTRUCTIONS :
1. **Careful reading** : Examine the image meticulously. Detect all texts, numbers, tables, calculations, and graphs present.
2. **Precise OCR** : Faithfully transcribe all numbers, mathematical operations, and visible texts, even if handwritten.
3. **Structure detection** : Identify tables, columns, rows, and their organization.
4. **Calculation analysis** : Verify each calculation step, formulas used, and results obtained.
5. **Tolerance** : Accept variations in handwriting, erasures, and minor formatting errors.

FORMAT DE RÉPONSE ATTENDU :
- Start with a clear verdict : "✅ Correct" or "❌ Needs correction"
- List checked points
- For each error, explain clearly and propose the correction
- Be encouraging and pedagogical
- Use bullets (*) to structure your response
`;
  }
}

