import { ExerciseData } from './exerciseGenerator';

// ============================================================
// CONTEXTE FEW-SHOT POUR GÉNÉRATION D'ÉNONCÉS
// Compétence : Tableaux d'effectifs et fréquences
// Source : Exercices réels du Brevet des Collèges
// ============================================================

export const CONTEXTE_GENERATION_ENONCES = `
Tu es un générateur d'exercices de mathématiques pour le Brevet des Collèges (3ème).
Tu dois créer des énoncés de problèmes sur les TABLEAUX D'EFFECTIFS ET FRÉQUENCES.

RÈGLES IMPORTANTES :
1. L'énoncé doit être contextualisé (situation réelle, concrète)
2. Les données brutes sont fournies sous forme de liste
3. L'élève doit compléter un tableau avec : valeurs, effectifs, fréquences
4. La précision d'arrondi doit être mentionnée explicitement
5. Le style doit être celui du Brevet : clair, structuré, professionnel
6. Évite les formulations enfantines ou trop simples

VOICI 5 EXEMPLES RÉELS D'ÉNONCÉS DU BREVET :

===== EXEMPLE 1 (Brevet Asie 2008) =====
Voici le diagramme en bâtons des notes obtenues sur 20 par une classe de 25 élèves de 3ème au dernier devoir de mathématiques.

1) Calculer l'étendue des notes.
2) Compléter le tableau suivant :
   | Note | Effectif | Fréquence (%) |
3) Calculer la moyenne des notes.
4) Déterminer la médiane des notes.
5) Calculer le pourcentage d'élèves ayant eu une note inférieure ou égale à 14.
   (Les fréquences seront arrondies au dixième près)

===== EXEMPLE 2 (Brevet 2003 - 24h du Mans) =====
La course automobile des 24 heures du Mans consiste à effectuer en 24 heures le plus grand nombre de tours d'un circuit. Le diagramme en bâtons ci-contre donne la répartition du nombre de tours effectués par les 25 premiers coureurs automobiles du rallye.

1) Compléter le tableau des effectifs et des effectifs cumulés croissants de cette série statistique :
   | Nombre de tours | 310 | 320 | 330 | 340 | 350 | 360 |
   | Effectif        |     |     |     |     |     |     |
   | Eff. cumulé     |     |     |     |     |     |     |

2) Déterminer la médiane et l'étendue de cette série.
3) Calculer la moyenne de cette série (arrondir à l'unité).

===== EXEMPLE 3 (Brevet - Lancer de javelot) =====
Lors d'une compétition de lancer de javelot, on a relevé les performances de 25 sportifs. Voici les résultats en mètres :
36, 42, 37, 43, 38, 44, 32, 40, 44, 36, 46, 39, 40, 40, 41, 41, 45, 37, 43, 43, 46, 39, 44, 47, 48

1) Compléter le tableau suivant (les fréquences seront arrondies au centième) :
   | Distance (m)  | [30;35[ | [35;40[ | [40;45[ | [45;50[ |
   | Effectif      |         |         |         |         |
   | Fréquence     |         |         |         |         |

2) En utilisant les valeurs centrales, calculer la longueur moyenne d'un lancer.
3) Quel est le pourcentage de sportifs ayant lancé au moins à 40 mètres ?

===== EXEMPLE 4 (Brevet - Poids des cartables) =====
Dans un collège, une enquête a été menée sur le poids des cartables des élèves. Pour cela, on a pesé le cartable de 48 élèves du collège. Les résultats de cette enquête sont inscrits dans le tableau ci-dessous :

| Poids (kg) | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| Effectif   | 1 | 2 | 5 | 11| 8 | 8 | 3 | 4  |

1) Calculer l'étendue de cette série statistique.
2) Déterminer la médiane de cette série statistique.
3) Déterminer les valeurs du premier quartile et du troisième quartile.
4) Calculer la fréquence des élèves ayant un cartable de 6 kg ou plus (arrondir au centième).

===== EXEMPLE 5 (Brevet - Contrôle de vitesse) =====
Les gendarmes ont effectué un contrôle de vitesse sur le bord d'une route nationale. Les résultats sont donnés dans le tableau suivant :

| Vitesse (km/h) | [70;80[ | [80;90[ | [90;100[ | [100;110[ | [110;120[ |
| Effectif       |    8    |   25    |    42    |    18     |     7     |

1) Combien de véhicules ont été contrôlés ?
2) Calculer la fréquence de chaque classe de vitesse (arrondir à 0,01 près).
3) Quel pourcentage de véhicules roulaient à 90 km/h ou plus ?
4) Calculer la vitesse moyenne des automobilistes contrôlés.

===== FIN DES EXEMPLES =====

MAINTENANT, génère un nouvel énoncé en suivant ce modèle.
Utilise les DONNÉES SUIVANTES pour créer l'énoncé :
`;

// Structure pour générer un prompt complet
export function genererPromptEnonce(exercice: any) {
  const donneesExercice = `
DONNÉES DE L'EXERCICE À CRÉER :
- Thème : ${exercice.titre}
- Valeurs du caractère : ${exercice.valeurs.join(', ')}
- Effectifs correspondants : ${exercice.effectifs.join(', ')}
- Effectif total : ${exercice.total}
- Précision d'arrondi : ${exercice.arrondi.texteEnonce}

CONSIGNES POUR L'ÉNONCÉ :
1. Invente un contexte réaliste et engageant lié au thème "${exercice.titre}"
2. Présente les données brutes (liste de valeurs individuelles OU tableau partiel à compléter)
3. Demande de compléter un tableau avec : Valeur | Effectif | Fréquence (fraction) | Fréquence (décimale) | Fréquence (%)
4. Mentionne explicitement : "Les fréquences décimales et en pourcentage seront arrondies ${exercice.arrondi.texteEnonce}."
5. Ajoute 1 ou 2 questions d'interprétation (ex: "Quel pourcentage de... ?", "Combien de... ont... ?")
6. Style Brevet : professionnel, structuré, pas enfantin.
7. Ne donne PAS la correction, juste l'énoncé.

GÉNÈRE L'ÉNONCÉ MAINTENANT :
`;

  return CONTEXTE_GENERATION_ENONCES + donneesExercice;
}

// Structure pour générer un prompt de correction
export function genererPromptCorrection(exercice: any) {
  return `
Tu dois générer la CORRECTION COMPLÈTE de cet exercice de statistiques.

DONNÉES :
- Thème : ${exercice.titre}
- Valeurs : ${exercice.valeurs.join(', ')}
- Effectifs : ${exercice.effectifs.join(', ')}
- Total : ${exercice.total}
- Arrondi : ${exercice.arrondi.texteEnonce} (${exercice.arrondi.decimales} décimales)

FRÉQUENCES CALCULÉES :
${exercice.frequences.map((f: any, i: number) => 
  `- Valeur ${exercice.valeurs[i]} : effectif ${exercice.effectifs[i]}, fraction ${f.fraction}, décimal ${f.decimalFormate}, pourcentage ${f.pourcentageFormate}%`
).join('\n')}

GÉNÈRE :
1. Le tableau complété avec toutes les valeurs
2. Les calculs détaillés pour chaque fréquence
3. Les réponses aux questions d'interprétation
4. Présentation claire et structurée, style correction de Brevet
`;
}