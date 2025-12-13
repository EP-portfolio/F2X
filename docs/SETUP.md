# 🚀 Guide de Configuration - Stat'Master MVP

Ce guide vous explique comment configurer et lancer le MVP de Stat'Master.

## 📋 Prérequis

- Node.js 18+ installé
- Compte Supabase (gratuit)
- Clé API Google Gemini
- Compte Resend (pour les emails) - optionnel pour le développement

## 🔧 Configuration

### 1. Base de données Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **SQL Editor**
4. Exécutez le script `database/schema.sql`
5. Notez vos clés :
   - **URL** : `https://xxxxx.supabase.co`
   - **Service Role Key** (dans Settings > API)
   - **Anon Key** (dans Settings > API)

### 2. Backend

1. Allez dans le dossier `backend/`
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

4. Configurez le fichier `.env` :
```env
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key

# JWT
JWT_SECRET=changez-cette-cle-secrete-en-production

# Google Gemini API
GEMINI_API_KEY=votre_cle_gemini

# Email Service (Resend)
RESEND_API_KEY=votre_cle_resend
FROM_EMAIL=noreply@statmaster.app

# Frontend URL
FRONTEND_URL=http://localhost:8000
```

5. Lancez le serveur :
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

### 3. Frontend

1. À la racine du projet, créez un fichier `config.js` :
```javascript
// Configuration API
window.API_BASE_URL = 'http://localhost:3000/api';
```

2. Lancez un serveur HTTP local :
```bash
# Option 1 : Python
python -m http.server 8000

# Option 2 : Node.js
npx http-server -p 8000
```

3. Ouvrez `http://localhost:8000/index-standalone.html`

## ✅ Vérification

1. **Backend** : Vérifiez que le serveur répond :
```bash
curl http://localhost:3000/health
```

2. **Frontend** : Ouvrez la console du navigateur (F12) et vérifiez qu'il n'y a pas d'erreurs

3. **Base de données** : Dans Supabase, vérifiez que les tables sont créées

## 🧪 Test

1. Inscrivez-vous avec un nouvel utilisateur
2. Connectez-vous
3. Testez les différentes fonctionnalités :
   - Dashboard
   - Cours
   - Entraînement
   - Évaluation
   - Tuteur IA

## 🐛 Dépannage

### Erreur de connexion à Supabase
- Vérifiez que les clés sont correctes dans `.env`
- Vérifiez que le projet Supabase est actif

### Erreur API Gemini
- Vérifiez que `GEMINI_API_KEY` est défini
- Vérifiez que la clé est valide

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL du frontend
- Vérifiez que le backend autorise les requêtes depuis le frontend

## 📚 Prochaines étapes

- Configurer Stripe pour les abonnements
- Configurer un domaine personnalisé
- Déployer en production (Vercel, Netlify, etc.)

