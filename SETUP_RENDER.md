# 🚀 Configuration Rapide pour Render

## ✅ Votre clé API Gemini est déjà configurée dans Render !

Il ne reste plus qu'à configurer l'URL du backend dans le frontend.

## 📋 Étapes finales

### 1. Trouver l'URL de votre backend Render

1. Allez sur **Render Dashboard** : https://dashboard.render.com
2. Cliquez sur votre service backend (probablement `statmaster-backend`)
3. **Copiez l'URL** : `https://votre-backend.onrender.com`
   - Exemple : `https://statmaster-backend.onrender.com`

### 2. Créer le fichier config.js

À la **racine du projet**, créez un fichier `config.js` :

```javascript
window.API_BASE_URL = 'https://votre-backend.onrender.com/api';
```

**Remplacez `votre-backend` par le nom réel de votre service backend.**

### 3. Versionner le fichier (optionnel mais recommandé)

Le fichier `config.js` est normalement dans `.gitignore`, mais pour Render, vous pouvez le versionner car il ne contient que l'URL (pas de secret) :

```bash
# Retirer config.js de .gitignore temporairement (ou créer le fichier directement)
git add config.js
git commit -m "Add backend URL for Render deployment"
git push
```

**OU** vous pouvez créer le fichier directement dans Render Dashboard si vous utilisez un build command.

### 4. Vérifier que tout fonctionne

1. **Vérifiez le backend** :
   - Allez sur : `https://votre-backend.onrender.com/health`
   - Devrait retourner : `{"status":"ok","timestamp":"..."}`

2. **Vérifiez le frontend** :
   - Ouvrez la console du navigateur (F12)
   - Allez dans la section **"Évaluation"**
   - L'exercice 4 devrait se générer automatiquement
   - Si vous voyez des erreurs dans la console, vérifiez que l'URL du backend est correcte

## 🔍 Dépannage

### L'exercice ne se génère pas

1. **Vérifiez la console du navigateur** (F12) :
   - Cherchez les erreurs de fetch
   - Vérifiez que l'URL du backend est correcte

2. **Vérifiez que le backend répond** :
   - Testez : `https://votre-backend.onrender.com/health`
   - Testez : `https://votre-backend.onrender.com/api/exercises/generate-brevet` (devrait retourner une erreur 400, pas 404)

3. **Vérifiez les logs du backend dans Render** :
   - Allez dans Render Dashboard > votre service backend > Logs
   - Cherchez les erreurs liées à `GEMINI_API_KEY`

### Erreur CORS

Si vous voyez des erreurs CORS dans la console :
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL de votre frontend Render
- Le backend doit autoriser les requêtes depuis votre frontend

## ✅ C'est tout !

Une fois `config.js` créé avec la bonne URL, tout devrait fonctionner automatiquement. La clé API Gemini est déjà sécurisée dans Render, et le frontend appellera le backend pour générer les exercices.

