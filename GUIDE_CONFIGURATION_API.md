# 🔑 Guide de Configuration API - Stat'Master

Pour utiliser le **Tuteur IA** et la **Computer Vision** (correction des exercices), vous devez configurer une clé API Gemini.

## 📋 Ce qui est nécessaire

### 1. **Clé API Gemini**

Vous devez obtenir une clé API Google Gemini :
- Allez sur : https://aistudio.google.com/app/apikey
- Connectez-vous avec votre compte Google
- Cliquez sur "Create API Key"
- Copiez la clé générée

### 2. **Configuration de la clé API**

Vous avez **2 options** pour configurer la clé :

#### Option 1 : Fichier config.js (Recommandé) ⭐

1. Créez un fichier `config.js` à la racine du projet
2. Ajoutez cette ligne :
```javascript
window.API_KEY = 'votre_cle_api_gemini_ici';
```
3. Le fichier `config.js` est déjà dans `.gitignore`, il ne sera pas versionné

**Avantages** :
- ✅ Séparé du code source
- ✅ Facile à modifier
- ✅ Pas versionné (sécurité)

#### Option 2 : Directement dans index-standalone.html

1. Ouvrez `index-standalone.html`
2. Décommentez et modifiez cette section :
```html
<script>
  window.API_KEY = 'votre_cle_api_gemini_ici';
</script>
```

**Inconvénient** :
- ⚠️ La clé sera visible dans le code source
- ⚠️ Ne convient pas pour la production

## ✅ Vérification

Une fois la clé configurée :

1. **Ouvrez l'application** dans votre navigateur
2. **Ouvrez la console** (F12)
3. **Tapez** : `console.log(window.API_KEY)`
4. Vous devriez voir votre clé (ou `undefined` si non configurée)

## 🧪 Test des fonctionnalités

### Test du Tuteur IA

1. Allez dans la section **"Tuteur IA"**
2. Posez une question (ex: "Comment calcule-t-on la médiane ?")
3. Si la clé est correcte, vous recevrez une réponse
4. Si erreur, vérifiez la console pour les messages d'erreur

### Test de la Computer Vision

1. Allez dans la section **"Évaluation"**
2. Résolvez un exercice sur papier
3. Prenez une photo de votre réponse
4. Cliquez sur "Scanner ma réponse"
5. Si la clé est correcte, vous recevrez un feedback détaillé
6. Si erreur, vérifiez la console

## ⚠️ Messages d'erreur courants

### "API Key missing"
- **Cause** : `window.API_KEY` n'est pas défini
- **Solution** : Vérifiez que vous avez créé `config.js` ou défini la clé dans le HTML

### "Google Generative AI library not loaded"
- **Cause** : La bibliothèque n'est pas chargée
- **Solution** : Vérifiez votre connexion internet, la bibliothèque est chargée via CDN

### Erreurs 401/403
- **Cause** : Clé API invalide ou expirée
- **Solution** : Vérifiez que la clé est correcte et active sur Google AI Studio

### Erreurs de quota
- **Cause** : Limite d'utilisation atteinte
- **Solution** : Vérifiez vos quotas sur Google Cloud Console

## 🔒 Sécurité

⚠️ **IMPORTANT** : Dans cette version standalone, la clé API est exposée côté client.

**Pour la production** :
- Utilisez un backend proxy pour masquer la clé API
- Configurez des restrictions de domaine/IP dans Google Cloud Console
- Surveillez l'utilisation de votre clé API

## 📝 Fichiers concernés

- `config.js` : Fichier de configuration (à créer)
- `config.js.example` : Exemple de configuration
- `index-standalone.html` : Point d'entrée (option de configuration directe)
- `js/components/AiTutor.js` : Utilise `window.API_KEY` pour le chat
- `js/components/Assessment.js` : Utilise `window.API_KEY` pour la vision

## 🚀 Démarrage rapide

1. **Obtenez votre clé API** : https://aistudio.google.com/app/apikey
2. **Créez `config.js`** à la racine :
   ```javascript
   window.API_KEY = 'AIza...'; // Votre clé ici
   ```
3. **Rechargez l'application**
4. **Testez** le Tuteur IA ou l'Évaluation

C'est tout ! 🎉

