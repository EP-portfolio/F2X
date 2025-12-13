# Backend Stat'Master

API Node.js/Express pour Stat'Master.

## Installation

```bash
npm install
```

## Configuration

1. Copiez `.env.example` en `.env`
2. Configurez vos clés API dans `.env`

## Lancement

```bash
# Développement
npm run dev

# Production
npm start
```

## Structure

- `routes/` : Routes API
- `services/` : Services (Gemini, Email, Scheduler)
- `middleware/` : Middleware (authentification)
- `config/` : Configuration base de données

