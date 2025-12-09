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

const CARACTERISTIQUES = [
  { id: "freres_soeurs", titre: "Nombre de frères et sœurs", label: "Frères/Sœurs", unite: "", min: 0, max: 5 },
  { id: "animaux", titre: "Animaux domestiques", label: "Nb Animaux", unite: "", min: 0, max: 4 },
  { id: "livres_mois", titre: "Livres lus ce mois", label: "Nb Livres", unite: "", min: 0, max: 6 },
  { id: "heures_sport", titre: "Heures de sport / semaine", label: "Heures", unite: "h", min: 0, max: 8 },
  { id: "heures_ecran", titre: "Heures d'écran / jour", label: "Heures", unite: "h", min: 1, max: 6 },
  { id: "notes_maths", titre: "Notes de Mathématiques", label: "Note", unite: "/20", min: 8, max: 18 },
  { id: "temps_trajet", titre: "Temps de trajet (min)", label: "Temps", unite: "min", min: 5, max: 45 },
  { id: "age_eleves", titre: "Âge des élèves", label: "Âge", unite: "ans", min: 13, max: 16 },
  { id: "taille_chaussures", titre: "Pointures des élèves", label: "Pointure", unite: "", min: 36, max: 44 },
  { id: "argent_poche", titre: "Argent de poche", label: "Montant", unite: "€", min: 0, max: 50 },
  { id: "films_mois", titre: "Films vus au cinéma", label: "Nb Films", unite: "", min: 0, max: 4 },
  { id: "heures_sommeil", titre: "Heures de sommeil", label: "Heures", unite: "h", min: 6, max: 10 },
  { id: "jeux_video", titre: "Jeux vidéo (h/semaine)", label: "Heures", unite: "h", min: 0, max: 15 },
  { id: "notes_francais", titre: "Notes de Français", label: "Note", unite: "/20", min: 6, max: 18 },
  { id: "absences", titre: "Jours d'absence", label: "Jours", unite: "", min: 0, max: 5 },
  { id: "activites_extra", titre: "Activités extrascolaires", label: "Nb Activités", unite: "", min: 0, max: 4 },
  { id: "langues_parlees", titre: "Langues parlées", label: "Nb Langues", unite: "", min: 1, max: 4 },
  { id: "voyages_annee", titre: "Voyages cette année", label: "Nb Voyages", unite: "", min: 0, max: 5 },
  { id: "amis_proches", titre: "Nombre d'amis proches", label: "Nb Amis", unite: "", min: 1, max: 8 },
  { id: "repas_cantine", titre: "Repas cantine / semaine", label: "Nb Repas", unite: "", min: 0, max: 5 },
  { id: "reseaux_sociaux", titre: "Réseaux sociaux utilisés", label: "Nb Réseaux", unite: "", min: 0, max: 6 },
  { id: "distance_ecole", titre: "Distance domicile-école", label: "Distance", unite: "km", min: 1, max: 15 }
];

const PRECISIONS_ARRONDI: ArrondiOption[] = [
  { 
    id: "entier", 
    decimales: 0, 
    texteEnonce: "à l'unité",
    texteConsigne: "Arrondis les fréquences à l'entier."
  },
  { 
    id: "dixieme", 
    decimales: 1, 
    texteEnonce: "au dixième",
    texteConsigne: "Arrondis les fréquences au dixième (0,1 près)."
  },
  { 
    id: "centieme", 
    decimales: 2, 
    texteEnonce: "au centième",
    texteConsigne: "Arrondis les fréquences au centième (0,01 près)."
  }
];

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

export const generateExerciseData = (): ExerciseData => {
  const carac = CARACTERISTIQUES[getRandomInt(0, CARACTERISTIQUES.length - 1)];
  
  // 1. Générer les valeurs uniques
  const nbValeurs = getRandomInt(4, 6);
  const valeursSet = new Set<number>();
  let attempts = 0;
  
  const range = carac.max - carac.min + 1;
  const maxVals = Math.min(nbValeurs, range);

  while (valeursSet.size < maxVals && attempts < 100) {
    let val = getRandomInt(carac.min, carac.max);
    if (carac.id === 'temps_trajet' || carac.id === 'argent_poche') {
       if (Math.random() > 0.3) val = Math.round(val / 5) * 5; 
    }
    val = Math.max(carac.min, Math.min(carac.max, val));
    valeursSet.add(val);
    attempts++;
  }
  
  const valeurs = Array.from(valeursSet).sort((a, b) => a - b);

  // 2. Générer les effectifs
  const effectifs = valeurs.map(() => getRandomInt(1, 5));
  const total = effectifs.reduce((a, b) => a + b, 0);

  // 3. Choisir une précision d'arrondi
  const arrondi = PRECISIONS_ARRONDI[getRandomInt(0, PRECISIONS_ARRONDI.length - 1)];

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
    id: carac.id,
    titre: carac.titre,
    unite: carac.unite,
    label: carac.label,
    valeurs,
    effectifs,
    total,
    rawList,
    arrondi,
    frequences
  };
};