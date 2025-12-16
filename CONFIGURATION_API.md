# 🔑 Configuration de la Clé API Gemini (SÉCURISÉE)

**✅ BONNE NOUVELLE** : La clé API est maintenant sécurisée côté serveur ! Elle n'est plus exposée dans le code client.

## 📋 Configuration pour Render (Production - RECOMMANDÉ)

### 1. Obtenir une clé API Gemini

1. Allez sur : **https://aistudio.google.com/app/apikey**
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. **Copiez la clé** (elle commence par `AIza...`)

### 2. Configurer la clé dans Render Dashboard (SÉCURISÉ)

1. Allez sur **Render Dashboard** : https://dashboard.render.com
2. Cliquez sur votre service **`statmaster-backend`**
3. Dans le menu de gauche, cliquez sur **"Environment"**
4. Cliquez sur **"Add Environment Variable"**
5. Ajoutez :
   - **Key** : `GEMINI_API_KEY`
   - **Value** : `AIza...votre_cle_ici` (collez votre clé)
6. Cliquez sur **"Save Changes"**
7. Render redéploiera automatiquement votre service

**✅ Avantages** :
- La clé est stockée de manière sécurisée dans Render
- Elle n'apparaît jamais dans le code source
- Elle est chiffrée et protégée par Render
- Facile à modifier sans toucher au code

### 3. Configurer l'URL de l'API dans le frontend

Si votre backend est déployé sur Render, créez un fichier `config.js` à la racine :

```javascript
window.API_BASE_URL = 'https://votre-backend.onrender.com/api';
```

Ou configurez-le dans Render pour le frontend (si vous utilisez un service frontend) :

1. Allez sur votre service frontend dans Render
2. **Environment** > **Add Environment Variable**
3. **Key** : `VITE_API_BASE_URL`
4. **Value** : `https://votre-backend.onrender.com/api`

## 📋 Configuration Locale (Développement)

### 1. Obtenir une clé API Gemini

1. Allez sur : **https://aistudio.google.com/app/apikey**
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. **Copiez la clé** (elle commence par `AIza...`)

### 2. Configurer la clé dans le backend local

1. Allez dans le dossier `backend/`
2. Créez ou modifiez le fichier `.env`
3. Ajoutez cette ligne :

```env
GEMINI_API_KEY=AIza...votre_cle_ici
```

4. **Important** : Le fichier `.env` est dans `.gitignore`, il ne sera **pas versionné** (sécurité)

### 3. Démarrer le backend

```bash
cd backend
npm install
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

### 4. Configurer l'URL de l'API dans le frontend (optionnel)

Si votre backend n'est pas sur `http://localhost:3000`, créez un fichier `config.js` à la racine :

```javascript
window.API_BASE_URL = 'http://localhost:3000/api';
```

Ou utilisez une variable d'environnement Vite :

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## ✅ Test

Une fois le backend configuré :

1. Démarrez le backend : `cd backend && npm run dev`
2. Démarrez le frontend : `npm run dev`
3. Allez dans la section **"Évaluation"**
4. L'exercice 4 (Résolution de Problème) devrait maintenant être généré automatiquement via le backend
5. Si vous voyez "Chargement de l'exercice..." qui ne se termine jamais, vérifiez :
   - Que le backend est bien démarré
   - Que `GEMINI_API_KEY` est bien défini dans `backend/.env`
   - Que l'URL de l'API est correcte (vérifiez la console pour les erreurs)

## 🔒 Sécurité

- ✅ **La clé API est maintenant sécurisée** : elle reste côté serveur
- ✅ **Pas d'exposition client** : la clé n'apparaît jamais dans le code source du frontend
- ✅ **Contrôle d'accès** : vous pouvez ajouter une authentification si nécessaire
- ⚠️ Surveillez votre utilisation sur Google Cloud Console
- ⚠️ La clé API gratuite a des limites de quota

## 🔧 Configuration alternative (Développement uniquement)

Si vous voulez tester sans backend (⚠️ **NON RECOMMANDÉ pour la production**) :

1. Créez un fichier `config.js` à la racine du projet
2. Ajoutez : `window.API_KEY = 'AIza...votre_cle_ici';`
3. Le code utilisera directement l'API Gemini (clé exposée côté client)

