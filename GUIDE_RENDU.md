# 🎨 Guide pour Visualiser l'Application Stat'Master

## ⚠️ Différence entre AI Studio et Vite

Cette application a été développée pour **Google AI Studio**, qui utilise un système d'**importmap** pour charger les dépendances depuis un CDN (`aistudiocdn.com`). 

Quand vous lancez l'app avec **Vite** localement, il y a des différences car :
- **AI Studio** : Charge les dépendances depuis le CDN via importmap (pas de bundling)
- **Vite** : Bundle les dépendances depuis `node_modules` (bundling)

## 🚀 Options pour Visualiser l'Application

### Option 1 : Utiliser AI Studio (Rendu Identique) ⭐

**C'est la méthode recommandée pour avoir exactement le même rendu :**

1. Accédez à : https://ai.studio/apps/drive/1tHsFhHpmhlKutKvzaiadi1S9NpsgtPSr
2. L'application s'affichera exactement comme elle a été conçue

### Option 2 : Vite en Mode Développement (Rendu Similaire)

**Pour le développement local avec Vite :**

```bash
npm run dev
```

Puis ouvrez : **http://localhost:5173**

⚠️ **Note** : Le rendu peut être légèrement différent car Vite bundle les dépendances différemment.

### Option 3 : Serveur Simple avec Importmap (Expérimental)

**Pour reproduire le comportement AI Studio localement :**

```bash
python serve-ai-studio.py
```

Puis ouvrez : **http://localhost:8080**

⚠️ **Note** : Cette méthode nécessite que les fichiers TypeScript soient compilés en JavaScript d'abord, ou utilise un plugin TypeScript dans le navigateur.

## 📁 Structure des Fichiers

- `index.html` : Version pour Vite (avec importmap mais Vite l'ignore)
- `index-ai-studio.html` : Version pour AI Studio (utilise l'importmap)
- `src/` : Fichiers source (déplacés pour Vite)

## 🔧 Configuration Actuelle

- ✅ Fichiers déplacés dans `src/` pour Vite
- ✅ `index.html` configuré pour charger `/src/index.tsx`
- ✅ Importmap présent dans `index.html` (mais Vite l'ignore)
- ⚠️ Vite bundle depuis `node_modules` au lieu d'utiliser l'importmap

## 💡 Recommandation

**Pour avoir exactement le même rendu qu'AI Studio :**
- Utilisez **AI Studio** directement (Option 1)

**Pour le développement local :**
- Utilisez **Vite** (Option 2) - les différences de rendu sont généralement mineures

## 🐛 Si le Rendu est Très Différent

Si vous constatez des différences importantes :

1. Vérifiez que Tailwind CSS se charge correctement
2. Vérifiez les polices Google Fonts
3. Vérifiez la console du navigateur pour les erreurs
4. Comparez avec la version AI Studio pour identifier les différences

