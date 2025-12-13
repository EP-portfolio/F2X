# 🚀 Configuration Rapide - API Gemini

## Ce qui manque pour utiliser le Tuteur IA et la Computer Vision

### ✅ Déjà en place :
- ✅ Bibliothèque Google Generative AI chargée (CDN)
- ✅ Code prêt pour utiliser l'API
- ✅ Gestion des erreurs implémentée

### ❌ Ce qui manque :

**1. Clé API Gemini**

Vous devez obtenir une clé API et la configurer.

## 📝 Étapes de configuration (2 minutes)

### Étape 1 : Obtenir une clé API

1. Allez sur : **https://aistudio.google.com/app/apikey**
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. **Copiez la clé** (elle commence par `AIza...`)

### Étape 2 : Configurer la clé

**Option A : Fichier config.js (Recommandé)**

1. Créez un fichier `config.js` à la racine du projet
2. Ajoutez cette ligne :
```javascript
window.API_KEY = 'AIza...votre_cle_ici';
```
3. Sauvegardez

**Option B : Console du navigateur (Test rapide)**

1. Ouvrez l'application dans votre navigateur
2. Ouvrez la console (F12)
3. Tapez :
```javascript
window.API_KEY = 'AIza...votre_cle_ici';
```
4. Rechargez la page

## ✅ Vérification

1. Ouvrez la console (F12)
2. Tapez : `console.log(window.API_KEY)`
3. Vous devriez voir votre clé

## 🧪 Test

### Test Tuteur IA :
1. Allez dans **"Tuteur IA"**
2. Posez une question
3. Vous devriez recevoir une réponse

### Test Computer Vision :
1. Allez dans **"Évaluation"**
2. Prenez une photo d'un exercice résolu
3. Cliquez sur "Scanner ma réponse"
4. Vous devriez recevoir un feedback

## ⚠️ Important

- La clé API est exposée côté client (visible dans le code source)
- Pour la production, utilisez un backend proxy
- Surveillez votre utilisation sur Google Cloud Console

## 📚 Documentation complète

Voir `GUIDE_CONFIGURATION_API.md` pour plus de détails.

