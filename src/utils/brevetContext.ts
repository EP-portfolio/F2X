/**
 * Exemples d'exercices du Brevet des Collèges utilisés comme contexte
 * pour inspirer la génération de nouveaux exercices variés par le LLM
 */

export interface BrevetExample {
  id: string;
  source: string;
  context: string;
  dataType: 'notes' | 'tailles' | 'livres' | 'temps' | 'autres';
  dataFormat: 'liste' | 'tableau' | 'histogramme' | 'comparaison';
  questions: string[];
  concepts: string[]; // moyenne, médiane, fréquences, etc.
}

export const BREVET_EXAMPLES: BrevetExample[] = [
  {
    id: 'brevet-1',
    source: 'Brevet Guyane Antilles - Septembre 2003',
    context: "Lors d'un contrôle, un élève de 3ème a obtenu les notes suivantes : 6 7 8 11 11 11 10 8 17 16 4 11 11 9 9 7 11 18 6 9 7 10 12 17 6 19",
    dataType: 'notes',
    dataFormat: 'liste',
    questions: [
      "Compléter le tableau suivant en rangeant les notes par ordre croissant",
      "Quel est l'effectif total de ce groupe ?",
      "Calculer la moyenne de cette classe ? Arrondir à 0,1 près.",
      "Déterminer la médiane de ces notes. Justifier."
    ],
    concepts: ['tableau_effectifs', 'moyenne', 'médiane', 'arrondi']
  },
  {
    id: 'brevet-2',
    source: 'Brevet Guadeloupe Sud - 2005',
    context: "Voici l'histogramme des notes d'un contrôle (sur 20 points) dans une classe. Les notes sont regroupées par intervalles : [0,2[ (effectif 2), [2,4[ (3), [4,6[ (5), [6,8[ (7), [8,10[ (9), [10,12[ (10), [12,14[ (8), [14,16[ (6), [16,18[ (4), [18,20[ (1)",
    dataType: 'notes',
    dataFormat: 'histogramme',
    questions: [
      "Compléter le tableau suivant",
      "Quel est l'effectif total de cette classe ?",
      "Combien d'élèves ont eu 10 ou moins ?",
      "Calculer la fréquence (en pourcentage) correspondant à la note 2 ? Donner la signification de cette fréquence.",
      "Déterminer la médiane de cette série de notes, en justifiant. Puis donner sa signification."
    ],
    concepts: ['histogramme', 'fréquences_pourcentage', 'médiane', 'interprétation']
  },
  {
    id: 'brevet-3',
    source: 'Brevet Polynésie 2007',
    context: "Le tableau ci-dessous montre la répartition des notes lors d'un contrôle pour 26 élèves d'une classe de 3ème. Notes : 7(1), 8(2), 9(3), 10(4), 11(3), 12(4), 13(3), 14(2), 15(2), 16(1), 17(1)",
    dataType: 'notes',
    dataFormat: 'tableau',
    questions: [
      "Calculer M, la note moyenne. Arrondir à l'unité.",
      "Déterminer m, la médiane de cette série. Justifier. Que signifie cette médiane ?",
      "Calculer le pourcentage d'élèves ayant eu une note inférieure ou égale à 11 ? Arrondir au dixième."
    ],
    concepts: ['moyenne', 'médiane', 'pourcentage', 'arrondi']
  },
  {
    id: 'brevet-4',
    source: 'Brevet Pondichéry 2013',
    context: "Un professeur de SVT demande aux 25 élèves d'une classe de 3ème de faire germer des graines de blé chez eux. Le tableau donne les tailles des plantules à 10 jours : 8cm(2), 9cm(3), 10cm(5), 11cm(6), 12cm(4), 13cm(3), 14cm(2)",
    dataType: 'tailles',
    dataFormat: 'tableau',
    questions: [
      "Combien de plantules ont une taille qui mesure au plus 11 cm ?",
      "Calculer l'étendue de cette série.",
      "Calculer la moyenne de cette série. Arrondir au dixième près.",
      "Déterminer la médiane de cette série. Justifier. Interpréter le résultat.",
      "On considère qu'un élève a bien respecté le protocole si la taille de la plantule 10 jours est supérieure ou égale à 14 cm. Quel pourcentage des élèves de la classe a bien respecté le protocole ?",
      "Le professeur a fait lui-même la même expérience. Prouver que, si on ajoute la donnée du professeur à cette série, la médiane ne changera pas."
    ],
    concepts: ['étendue', 'moyenne', 'médiane', 'pourcentage', 'impact_nouvelle_donnée']
  },
  {
    id: 'brevet-5',
    source: 'Brevet Amérique du Nord - 2012',
    context: "Deux classes du collège ont répondu à la question : « Combien de livres as-tu empruntés dans les 12 derniers mois ? » Classe 3ème A : Effectif total 25, Moyenne 4, Médiane 5, Étendue 8. Classe 3ème B : Effectif total 25, Moyenne 5, Médiane 5, Étendue 9.",
    dataType: 'livres',
    dataFormat: 'comparaison',
    questions: [
      "Comparer les nombres moyens de livres empruntés dans chaque classe.",
      "Un si grand lecteur est un élève qui a emprunté 6 livres ou plus. Quelle classe compte le plus de « grands lecteurs » ?",
      "Dans quelle classe se trouve l'élève qui a emprunté le plus de livres ?"
    ],
    concepts: ['comparaison', 'moyenne', 'médiane', 'étendue', 'interprétation']
  },
  {
    id: 'brevet-6',
    source: 'Brevet Amérique du Nord - 2015',
    context: "À l'heure de la 14ème étape du tour de France cycliste 2014, les coureurs ont parcouru 3 260,9 km depuis le départ. Le classement général des 10 premiers coureurs avec leurs temps : Nibali (59h16min07s), Bardet (59h19min41s), Pinot (59h19min49s), Valverde (59h20min01s), Péraud (59h20min02s), Van Garderen (59h20min10s), Mollema (59h20min11s), Konig (59h20min12s), Horner (59h20min13s), Talansky (59h20min14s)",
    dataType: 'temps',
    dataFormat: 'tableau',
    questions: [
      "Calculer la différence entre le temps de course de Leopold Konig et celui de Vincenzo Nibali.",
      "Que représente la différence calculée pour la série statistique ?",
      "Quelle est la médiane de cette série statistique ? Justifier."
    ],
    concepts: ['différence', 'étendue', 'médiane', 'interprétation']
  },
  {
    id: 'brevet-7',
    source: 'Exercice Brevet - Tortues vertes',
    context: "Afin de surveiller la bonne santé des tortues vertes à Madagascar, elles sont régulièrement pesées. Voici les données relevées par un scientifique en mai 2021. Tableau : 7 tortues marquées (A-001 à A-007) avec leur sexe (Mâle, Femelle) et leur masse en kg (113, 96, 125, 87, 117, 104, 101)",
    dataType: 'autres',
    dataFormat: 'tableau',
    questions: [
      "Calculer l'étendue de cette série statistique.",
      "Calculer la masse moyenne de ces 7 tortues. Arrondir le résultat à l'unité.",
      "Déterminer la médiane de cette série statistique. Interpréter le résultat.",
      "Est-il vrai que les mâles représentent moins de 20% de cet échantillon ?"
    ],
    concepts: ['étendue', 'moyenne', 'médiane', 'pourcentage', 'interprétation']
  },
  {
    id: 'brevet-8',
    source: 'Brevet - Bordeaux, Caen, Clermont-Ferrand, Limoges, Nantes, Orléans-Tours, Poitiers, Rennes - 2006',
    context: "Le tableau ci-dessous donne la répartition des notes obtenues à un contrôle de mathématiques par les 27 élèves d'une classe de troisième. Notes : 6(3), 8(5), 10(6), 13(7), 14(5), 17(1)",
    dataType: 'notes',
    dataFormat: 'tableau',
    questions: [
      "Calculer la note moyenne de la classe à ce contrôle. Arrondir le résultat à l'unité.",
      "Calculer le pourcentage d'élèves ayant eu une note supérieure ou égale à 10. Arrondir le résultat au dixième."
    ],
    concepts: ['moyenne', 'pourcentage', 'arrondi']
  },
  {
    id: 'brevet-9',
    source: 'Brevet - Aix-Marseille, Corse, Montpellier, Nice, Toulouse - 2005',
    context: "Voici l'histogramme des notes d'un contrôle noté sur 5 pour une classe de 25 élèves. Notes : 0/5(1), 1/5(2), 2/5(4), 3/5(4), 4/5(7), 5/5(7)",
    dataType: 'notes',
    dataFormat: 'histogramme',
    questions: [
      "Reproduire et remplir le tableau des notes suivants (avec effectifs et effectifs cumulés croissants).",
      "Calculer la moyenne des notes de la classe.",
      "Quelle est la médiane des notes de la classe ?",
      "Calculer la fréquence des notes inférieures ou égales à 3 points sur 5."
    ],
    concepts: ['histogramme', 'tableau', 'effectifs_cumulés', 'moyenne', 'médiane', 'fréquence']
  },
  {
    id: 'brevet-10',
    source: 'Brevet - Amiens, Créteil, Lille, Paris, Rouen, Versailles - 2004',
    context: "Après un contrôle, les notes de 25 élèves ont été regroupées dans le tableau ci-dessous. Classes : 0≤n<4(1), 4≤n<8(6), 8≤n<12(7), 12≤n<16(?), 16≤n≤20(3)",
    dataType: 'notes',
    dataFormat: 'tableau',
    questions: [
      "Compléter le tableau en indiquant le nombre d'élèves ayant obtenu une note comprise entre 12 et 16 (16 exclu).",
      "Combien d'élèves ont obtenu moins de 12?",
      "Combien d'élèves ont obtenu au moins 8?",
      "Quel est le pourcentage des élèves qui ont obtenu une note comprise entre 8 et 12 (12 exclu)?"
    ],
    concepts: ['classes', 'effectifs', 'fréquences_cumulées', 'pourcentage']
  },
  {
    id: 'brevet-11',
    source: 'Brevet - Aix-Marseille, Corse, Montpellier, Nice, Toulouse - 2004',
    context: "Une station de ski réalise une enquête auprès de 300 skieurs. Répartition par classes d'âge : [0;10[(27), [10;20[(46), [20;30[(48), [30;40[(39), [40;50[(42), [50;60[(36), [60;70[(33), [70;80[(24), [80;90[(6)",
    dataType: 'autres',
    dataFormat: 'tableau',
    questions: [
      "Compléter ce tableau en indiquant le centre de chaque classe d'âge.",
      "Calculer l'âge moyen des skieurs fréquentant cette station.",
      "Quelle est la fréquence, en pourcentage, de skieurs ayant un âge strictement inférieur à 20 ans ?"
    ],
    concepts: ['classes', 'centre_de_classe', 'moyenne_groupée', 'pourcentage']
  },
  {
    id: 'brevet-12',
    source: 'Brevet - Besançon, Dijon, Grenoble, Lyon, Nancy-Metz, Reims, Strasbourg - 2004',
    context: "Le diagramme en barres ci-dessous donne la répartition des notes obtenues à un contrôle de mathématiques par les élèves d'une classe de 3ème. Notes : 8(2), 9(5), 10(2), 11(2), 12(3), 13(2), 14(7), 15(2)",
    dataType: 'notes',
    dataFormat: 'histogramme',
    questions: [
      "Combien d'élèves y a-t-il dans cette classe ?",
      "Quelle est la note moyenne de la classe à ce contrôle ?",
      "Quelle est la note médiane ?",
      "Quelle est l'étendue de cette série de notes ?"
    ],
    concepts: ['effectif_total', 'moyenne', 'médiane', 'étendue']
  },
  {
    id: 'brevet-13',
    source: 'Brevet - Besançon, Dijon, Grenoble, Lyon, Nancy-Metz, Reims, Strasbourg - 2003',
    context: "La course automobile des 24 heures du Mans consiste à effectuer en 24 heures le plus grand nombre de tours d'un circuit. Le diagramme en bâtons donne la répartition du nombre de tours effectués par les 28 premiers coureurs. Tours : 310(4), 320(4), 330(5), 340(7), 350(3), 360(2)",
    dataType: 'autres',
    dataFormat: 'histogramme',
    questions: [
      "Compléter le tableau des effectifs et des effectifs cumulés croissants de cette série statistique.",
      "Déterminer la médiane et l'étendue de cette série.",
      "Calculer la moyenne de cette série. (on donnera la valeur arrondie à l'unité)."
    ],
    concepts: ['effectifs_cumulés', 'médiane', 'étendue', 'moyenne', 'arrondi']
  },
  {
    id: 'brevet-14',
    source: 'Brevet - Besançon, Dijon, Lyon, Nancy-Metz, Reims, Strasbourg - 2002',
    context: "Voici le diagramme représentant la répartition des notes obtenues par les élèves d'une classe de troisième lors d'un contrôle de français. Notes : 6(2), 7(3), 8(5), 9(1), 10(4), 12(1), 13(6), 15(3)",
    dataType: 'notes',
    dataFormat: 'histogramme',
    questions: [
      "Quel est l'effectif de cette classe de troisième?",
      "Calculer la moyenne des notes obtenues en donnant le résultat sous sa forme décimale exacte."
    ],
    concepts: ['effectif_total', 'moyenne']
  },
  {
    id: 'brevet-15',
    source: 'Brevet - Grenoble - 2002',
    context: "Une usine teste des ampoules pour déterminer leur durée de vie en heures. Résultats : 1000≤d<1200(550), 1200≤d<1400(1460), 1400≤d<1600(1920), 1600≤d<1800(1640), 1800≤d<2000(430)",
    dataType: 'autres',
    dataFormat: 'tableau',
    questions: [
      "Quel est le pourcentage d'ampoules qui ont une durée de vie de moins de 1400 h ?",
      "Calculer la durée de vie moyenne d'une ampoule."
    ],
    concepts: ['classes', 'pourcentage', 'moyenne_groupée']
  },
  {
    id: 'brevet-16',
    source: 'Brevet - Grenoble - 2001',
    context: "En météorologie, l'insolation est le nombre d'heures d'ensoleillement. Données d'insolation pour le mois de juillet sur plusieurs années à Voglans, Savoie. Années 1990-2000 : 324, 325, 257, 234, 285, 261, 213, 226, 308, 259, 206 heures",
    dataType: 'temps',
    dataFormat: 'liste',
    questions: [
      "Calculer la moyenne d'insolation sur cette période (On donnera le résultat arrondi à l'heure près).",
      "Peut-on dire que la valeur 259 est la médiane de cette série ? Justifier."
    ],
    concepts: ['moyenne', 'médiane', 'justification', 'arrondi']
  },
  {
    id: 'brevet-17',
    source: 'Brevet - Bordeaux - 2000',
    context: "Tableau de fréquentation quotidienne d'une braderie. Vendredi(770), Samedi(1925), Dimanche(9009), Lundi(3080), Mardi(616)",
    dataType: 'autres',
    dataFormat: 'tableau',
    questions: [
      "Sur le nombre total de personnes ayant fréquenté la braderie, quel est le pourcentage de celles qui sont venues le dimanche?",
      "Quel est le nombre moyen de visiteurs, par jour, pendant la durée de la braderie?"
    ],
    concepts: ['pourcentage', 'moyenne']
  },
  {
    id: 'brevet-18',
    source: 'Brevet - Grenoble - 2000',
    context: "A la sortie d'une agglomération, on a relevé la répartition par tranches horaires des 6400 véhicules quittant la ville entre 16 heures et 22 heures. 16h-17h(1100), 17h-18h(2000), 18h-19h(1600), 19h-20h(900), 20h-21h(450), 21h-22h(350)",
    dataType: 'temps',
    dataFormat: 'tableau',
    questions: [
      "Représenter l'histogramme des effectifs de cette série statistique.",
      "Calculer la fréquence de la tranche horaire 19 h - 20 h (on donnera le résultat arrondi à 0,01 près, puis le pourcentage correspondant).",
      "Calculer le pourcentage de véhicules quittant la ville entre 16 h et 20 h."
    ],
    concepts: ['histogramme', 'fréquence', 'pourcentage', 'arrondi']
  },
  {
    id: 'brevet-19',
    source: 'Brevet - Orléans-Tours - 2000',
    context: "Le groupe des onze latinistes de la 3ème B du collège a obtenu les notes suivantes à un devoir : 7, 9, 9.5, 9.5, 10, 10, 12, 14, 16, 16, 19",
    dataType: 'notes',
    dataFormat: 'liste',
    questions: [
      "Calculer la moyenne du groupe.",
      "Déterminer la médiane de cette série."
    ],
    concepts: ['moyenne', 'médiane']
  }
];

/**
 * Retourne un exemple aléatoire du Brevet pour servir de contexte
 */
export function getRandomBrevetExample(): BrevetExample {
  return BREVET_EXAMPLES[Math.floor(Math.random() * BREVET_EXAMPLES.length)];
}

/**
 * Retourne plusieurs exemples variés pour enrichir le contexte
 */
export function getVariedBrevetExamples(count: number = 3): BrevetExample[] {
  const shuffled = [...BREVET_EXAMPLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, BREVET_EXAMPLES.length));
}

