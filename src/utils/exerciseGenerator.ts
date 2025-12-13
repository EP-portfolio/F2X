import { Language } from '../types';

export interface ArrondiOption {
  id: string;
  decimales: number;
  texteEnonce: string;
  texteConsigne: string;
}

export interface FrequencyData {
  fraction: string; // "3/5"
  decimalFormate: string; // "0,6"
  pourcentageFormate: string; // "60"
}

export interface ExerciseData {
  id: string;
  titre: string;
  unite: string;
  label: string;
  valeurs: number[];
  effectifs: number[];
  total: number;
  rawList: number[];
  arrondi: ArrondiOption;
  frequences: FrequencyData[];
}

interface CaracteristiqueBase {
  id: string;
  min: number;
  max: number;
  unite: string;
}

interface TranslatedContent {
  titre: string;
  label: string;
}

const CARACTERISTIQUES_BASE: (CaracteristiqueBase & { fr: TranslatedContent, en: TranslatedContent })[] = [
  { id: "freres_soeurs", min: 0, max: 5, unite: "", fr: { titre: "Nombre de frères et sœurs", label: "Frères/Sœurs" }, en: { titre: "Number of siblings", label: "Siblings" } },
  { id: "animaux", min: 0, max: 4, unite: "", fr: { titre: "Animaux domestiques", label: "Nb Animaux" }, en: { titre: "Pets owned", label: "Pets" } },
  { id: "livres_mois", min: 0, max: 6, unite: "", fr: { titre: "Livres lus ce mois", label: "Nb Livres" }, en: { titre: "Books read this month", label: "Books" } },
  { id: "heures_sport", min: 0, max: 8, unite: "h", fr: { titre: "Heures de sport / semaine", label: "Heures" }, en: { titre: "Sports hours / week", label: "Hours" } },
  { id: "heures_ecran", min: 1, max: 6, unite: "h", fr: { titre: "Heures d'écran / jour", label: "Heures" }, en: { titre: "Screen time / day", label: "Hours" } },
  { id: "notes_maths", min: 8, max: 18, unite: "/20", fr: { titre: "Notes de Mathématiques", label: "Note" }, en: { titre: "Math Grades", label: "Grade" } },
  { id: "temps_trajet", min: 5, max: 45, unite: "min", fr: { titre: "Temps de trajet", label: "Temps" }, en: { titre: "Commute time", label: "Time" } },
  { id: "age_eleves", min: 13, max: 16, unite: "ans", fr: { titre: "Âge des élèves", label: "Âge" }, en: { titre: "Student Ages", label: "Age" } },
  { id: "taille_chaussures", min: 36, max: 44, unite: "", fr: { titre: "Pointures des élèves", label: "Pointure" }, en: { titre: "Shoe sizes", label: "Size" } },
  { id: "argent_poche", min: 0, max: 50, unite: "€", fr: { titre: "Argent de poche", label: "Montant" }, en: { titre: "Pocket money", label: "Amount" } },
  { id: "films_mois", min: 0, max: 4, unite: "", fr: { titre: "Films vus au cinéma", label: "Nb Films" }, en: { titre: "Movies seen in cinema", label: "Movies" } },
  { id: "heures_sommeil", min: 6, max: 10, unite: "h", fr: { titre: "Heures de sommeil", label: "Heures" }, en: { titre: "Sleep hours", label: "Hours" } },
  { id: "jeux_video", min: 0, max: 15, unite: "h", fr: { titre: "Jeux vidéo (h/semaine)", label: "Heures" }, en: { titre: "Video games (h/week)", label: "Hours" } },
  { id: "notes_francais", min: 6, max: 18, unite: "/20", fr: { titre: "Notes de Français", label: "Note" }, en: { titre: "French Grades", label: "Grade" } },
  { id: "absences", min: 0, max: 5, unite: "", fr: { titre: "Jours d'absence", label: "Jours" }, en: { titre: "Absence days", label: "Days" } },
  { id: "activites_extra", min: 0, max: 4, unite: "", fr: { titre: "Activités extrascolaires", label: "Nb Activités" }, en: { titre: "Extracurricular activities", label: "Activities" } },
  { id: "langues_parlees", min: 1, max: 4, unite: "", fr: { titre: "Langues parlées", label: "Nb Langues" }, en: { titre: "Languages spoken", label: "Languages" } },
  { id: "voyages_annee", min: 0, max: 5, unite: "", fr: { titre: "Voyages cette année", label: "Nb Voyages" }, en: { titre: "Trips this year", label: "Trips" } },
  { id: "amis_proches", min: 1, max: 8, unite: "", fr: { titre: "Nombre d'amis proches", label: "Nb Amis" }, en: { titre: "Close friends", label: "Friends" } },
  { id: "repas_cantine", min: 0, max: 5, unite: "", fr: { titre: "Repas cantine / semaine", label: "Nb Repas" }, en: { titre: "School lunches / week", label: "Lunches" } },
  { id: "reseaux_sociaux", min: 0, max: 6, unite: "", fr: { titre: "Réseaux sociaux utilisés", label: "Nb Réseaux" }, en: { titre: "Social networks used", label: "Networks" } },
  { id: "distance_ecole", min: 1, max: 15, unite: "km", fr: { titre: "Distance domicile-école", label: "Distance" }, en: { titre: "Distance to school", label: "Distance" } }
];

const PRECISIONS_ARRONDI = {
  fr: [
    { id: "entier", decimales: 0, texteEnonce: "à l'unité", texteConsigne: "Arrondis les fréquences à l'entier." },
    { id: "dixieme", decimales: 1, texteEnonce: "au dixième", texteConsigne: "Arrondis les fréquences au dixième (0,1 près)." },
    { id: "centieme", decimales: 2, texteEnonce: "au centième", texteConsigne: "Arrondis les fréquences au centième (0,01 près)." }
  ],
  en: [
    { id: "entier", decimales: 0, texteEnonce: "to the nearest whole number", texteConsigne: "Round frequencies to the nearest whole number." },
    { id: "dixieme", decimales: 1, texteEnonce: "to one decimal place", texteConsigne: "Round frequencies to one decimal place." },
    { id: "centieme", decimales: 2, texteEnonce: "to two decimal places", texteConsigne: "Round frequencies to two decimal places." }
  ]
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calcul du PGCD pour simplifier les fractions
function pgcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Simplifier une fraction
function simplifierFraction(numerateur: number, denominateur: number) {
  const diviseur = pgcd(numerateur, denominateur);
  return {
    numerateur: numerateur / diviseur,
    denominateur: denominateur / diviseur
  };
}

// Arrondir selon la précision
function arrondirPrecision(valeur: number, decimales: number) {
  const facteur = Math.pow(10, decimales);
  return Math.round(valeur * facteur) / facteur;
}

export const generateExerciseData = (lang: Language = 'fr'): ExerciseData => {
  const caracBase = CARACTERISTIQUES_BASE[getRandomInt(0, CARACTERISTIQUES_BASE.length - 1)];
  const caracLang = caracBase[lang];
  
  // 1. Générer les valeurs uniques
  const nbValeurs = getRandomInt(4, 6);
  const valeursSet = new Set<number>();
  let attempts = 0;
  
  const range = caracBase.max - caracBase.min + 1;
  const maxVals = Math.min(nbValeurs, range);

  while (valeursSet.size < maxVals && attempts < 100) {
    let val = getRandomInt(caracBase.min, caracBase.max);
    if (caracBase.id === 'temps_trajet' || caracBase.id === 'argent_poche') {
       if (Math.random() > 0.3) val = Math.round(val / 5) * 5; 
    }
    val = Math.max(caracBase.min, Math.min(caracBase.max, val));
    valeursSet.add(val);
    attempts++;
  }
  
  const valeurs = Array.from(valeursSet).sort((a, b) => a - b);

  // 2. Générer les effectifs
  const effectifs = valeurs.map(() => getRandomInt(1, 5));
  const total = effectifs.reduce((a, b) => a + b, 0);

  // 3. Choisir une précision d'arrondi
  const optionsArrondi = PRECISIONS_ARRONDI[lang];
  const arrondi = optionsArrondi[getRandomInt(0, optionsArrondi.length - 1)];

  // 4. Calculer les fréquences pré-formatées
  const frequences: FrequencyData[] = effectifs.map(eff => {
    const fraction = simplifierFraction(eff, total);
    const decimalExact = eff / total;
    const pourcentageExact = decimalExact * 100;
    
    const decimalArrondi = arrondirPrecision(decimalExact, arrondi.decimales);
    const pourcentageArrondi = arrondirPrecision(pourcentageExact, arrondi.decimales);
    
    return {
      fraction: fraction.numerateur + "/" + fraction.denominateur,
      decimalFormate: decimalArrondi.toFixed(arrondi.decimales).replace('.', ','),
      pourcentageFormate: pourcentageArrondi.toFixed(arrondi.decimales).replace('.', ',')
    };
  });

  // 5. Construire la liste brute pour l'énoncé
  let rawList: number[] = [];
  valeurs.forEach((val, index) => {
    for (let i = 0; i < effectifs[index]; i++) {
      rawList.push(val);
    }
  });
  rawList = rawList.sort(() => Math.random() - 0.5);

  return {
    id: caracBase.id,
    titre: caracLang.titre,
    unite: caracBase.unite,
    label: caracLang.label,
    valeurs,
    effectifs,
    total,
    rawList,
    arrondi,
    frequences
  };
};