# 🚀 Stat'Master - Version HTML/JS Standalone COMPLÈTE

Version HTML/JavaScript pur de l'application Stat'Master, **sans dépendance à React ou AI Studio**, avec **toutes les fonctionnalités** implémentées.

## ✅ Fonctionnalités Complètes

### 🎯 Toutes les sections fonctionnelles :

1. **✅ Sélection de langue** (FR/EN)
2. **✅ Page d'accueil** avec design identique
3. **✅ Navigation** responsive
4. **✅ Cours (Lesson)** - 4 leçons complètes avec accordéon
5. **✅ Entraînement (Practice)** - Exercices interactifs avec graphiques SVG
6. **✅ Évaluation (Assessment)** - Upload d'images, analyse IA, rapport
7. **✅ Tuteur IA (AiTutor)** - Chat avec Gemini API

## 📁 Structure

```
F2X/
├── index-standalone.html    # Fichier HTML principal
├── js/
│   ├── app.js              # Application principale
│   ├── components/         # Composants UI
│   │   ├── LanguageSelector.js
│   │   ├── NavBar.js
│   │   ├── Home.js
│   │   ├── Lesson.js       ✅ COMPLET
│   │   ├── Practice.js     ✅ COMPLET (avec graphiques SVG)
│   │   ├── Assessment.js   ✅ COMPLET (avec IA)
│   │   └── AiTutor.js      ✅ COMPLET (avec Gemini)
│   └── utils/              # Utilitaires
│       ├── state.js        # Gestion d'état
│       ├── math.js         # Calculs statistiques
│       ├── exerciseGenerator.js
│       └── prompts.js      # Prompts pour l'IA
└── README_STANDALONE.md
```

## 🚀 Utilisation

### Option 1 : Serveur Python Simple

```bash
python -m http.server 8000
```

Puis ouvrez : **http://localhost:8000/index-standalone.html**

### Option 2 : Serveur Node.js (http-server)

```bash
npx http-server -p 8000
```

### Option 3 : Ouvrir directement

⚠️ **Note** : Certaines fonctionnalités peuvent ne pas fonctionner en ouvrant directement le fichier (CORS, modules ES6). Utilisez un serveur HTTP.

## 📦 Dépendances (CDN)

Toutes les dépendances sont chargées via CDN dans `index-standalone.html` :

- **Tailwind CSS** : https://cdn.tailwindcss.com
- **Lucide Icons** : https://unpkg.com/lucide@latest
- **html2canvas** : https://unpkg.com/html2canvas@1.4.1
- **Google Generative AI** : https://cdn.jsdelivr.net/npm/@google/generative-ai@1.31.0/dist/index.umd.js

## 🔧 Configuration API

Pour utiliser les fonctionnalités IA (Tuteur, Évaluation), définissez votre clé API :

### Option 1 : Dans la console du navigateur
```javascript
window.API_KEY = 'votre_cle_api_gemini';
```

### Option 2 : Dans un fichier `config.js` (créer à la racine)
```javascript
window.API_KEY = 'votre_cle_api_gemini';
```

Puis ajoutez dans `index-standalone.html` avant `app.js` :
```html
<script src="config.js"></script>
```

⚠️ **Sécurité** : Cette clé sera exposée côté client. Pour la production, utilisez un backend proxy.

## 🎨 Design

Le design est **identique** à la version React originale :
- ✅ Même palette de couleurs (violet/fuchsia)
- ✅ Même typographie (Inter, Patrick Hand, Caveat)
- ✅ Mêmes animations et transitions
- ✅ Responsive design complet
- ✅ Graphiques SVG pour Practice (au lieu de Recharts)

## 📝 Détails Techniques

### Graphiques
- Les graphiques dans Practice utilisent **SVG natif** au lieu de Recharts
- Même rendu visuel, performance optimale

### Gestion d'état
- Système de state management simple et léger
- Pas de dépendances lourdes

### Modules ES6
- Tous les fichiers utilisent les modules ES6
- Nécessite un serveur HTTP (pas de file://)

## 🐛 Dépannage

### Les icônes ne s'affichent pas
- Vérifiez que Lucide Icons est chargé
- Les icônes sont initialisées automatiquement après chaque rendu

### L'IA ne fonctionne pas
- Vérifiez que `window.API_KEY` est défini
- Vérifiez que la bibliothèque Google Generative AI est chargée
- Ouvrez la console pour voir les erreurs

### Les graphiques ne s'affichent pas
- Attendez quelques secondes après le chargement
- Vérifiez la console pour les erreurs

## 🎯 Différences avec la version React

1. **Graphiques** : SVG natif au lieu de Recharts (même rendu)
2. **Gestion d'état** : Système simple au lieu de React hooks
3. **Rendu** : InnerHTML au lieu de JSX (même résultat visuel)
4. **Pas de build** : Fonctionne directement, pas besoin de Vite/Webpack

## ✨ Avantages

- ✅ **Aucune dépendance** à React ou build tools
- ✅ **Léger** : Pas de node_modules
- ✅ **Rapide** : Chargement direct
- ✅ **Portable** : Fonctionne sur n'importe quel serveur HTTP
- ✅ **Même rendu** : Design identique à l'original

## 🚀 Déploiement

Vous pouvez déployer cette version sur :
- GitHub Pages
- Netlify
- Vercel
- N'importe quel serveur web statique

Il suffit de mettre les fichiers dans un dossier et de les servir via HTTP.

---

**Version** : 1.0.0 - Toutes les fonctionnalités implémentées ✅
