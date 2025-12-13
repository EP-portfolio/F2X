# 🎓 Stat'Master MVP - Application SaaS Éducative

Application SaaS complète pour l'apprentissage des statistiques avec IA, tracking de performance et notifications parents.

## ✨ Fonctionnalités

### ✅ Implémenté dans le MVP

- **Authentification** : Inscription/Connexion avec JWT
- **Dashboard** : Vue d'ensemble des performances
- **Tracking des performances** : Historique des sessions d'entraînement
- **Sessions d'évaluation** : Évaluations avec analyse IA
- **Recommandations IA** : Suggestions personnalisées après évaluation
- **Notifications parents** : Envoi automatique des bilans par email
- **Tuteur IA** : Chat avec Gemini pour questions/réponses
- **Computer Vision** : Analyse des devoirs via photo

## 📁 Structure du projet

```
F2X/
├── backend/                 # API Node.js/Express
│   ├── routes/             # Routes API
│   ├── services/           # Services (Gemini, Email, Scheduler)
│   ├── middleware/         # Middleware (auth)
│   ├── config/             # Configuration DB
│   └── server.js           # Point d'entrée
├── database/
│   └── schema.sql          # Schéma Supabase
├── js/                     # Frontend
│   ├── components/         # Composants UI
│   ├── services/           # Client API
│   └── utils/              # Utilitaires
├── docs/                   # Documentation
└── index-standalone.html   # Point d'entrée frontend
```

## 🚀 Démarrage rapide

### 1. Configuration Supabase

1. Créez un compte [Supabase](https://supabase.com)
2. Créez un projet
3. Exécutez `database/schema.sql` dans le SQL Editor
4. Notez vos clés API

### 2. Configuration Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditez .env avec vos clés
npm run dev
```

### 3. Configuration Frontend

```bash
# Créez config.js à la racine
echo "window.API_BASE_URL = 'http://localhost:3000/api';" > config.js

# Lancez un serveur HTTP
python -m http.server 8000
```

### 4. Accès

Ouvrez `http://localhost:8000/index-standalone.html`

## 📚 Documentation

- [Guide de configuration](docs/SETUP.md)
- [Documentation API](docs/API.md)
- [Déploiement sur Render (Gratuit)](docs/DEPLOY_RENDER.md)
- [Déploiement général](docs/DEPLOYMENT.md)
- [Accès mobile](docs/MOBILE_ACCESS.md)

## 🔧 Technologies

- **Backend** : Node.js, Express, Supabase
- **Frontend** : Vanilla JavaScript, Tailwind CSS
- **IA** : Google Gemini (1.5 Flash)
- **Email** : Resend
- **Base de données** : PostgreSQL (Supabase)

## 🌐 Accès depuis n'importe quel appareil

L'application peut être déployée pour être accessible depuis n'importe quel appareil :

- **Déploiement en ligne** : Vercel, Netlify (voir `docs/DEPLOYMENT.md`)
- **Accès local mobile** : Même réseau WiFi (voir `docs/MOBILE_ACCESS.md`)
- **Tunnel public** : ngrok pour tester depuis n'importe où

## 📝 Prochaines étapes

- [x] Déploiement multi-appareils
- [ ] Intégration Stripe pour abonnements
- [ ] Notifications push
- [ ] Analytics avancés
- [ ] Multi-chapitres

## 📄 Licence

MIT

