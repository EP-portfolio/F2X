# 🚀 Déploiement sur Render (Gratuit)

Render offre un plan gratuit parfait pour déployer Stat'Master. Ce guide vous explique comment faire.

## ✅ Avantages du plan gratuit Render

- **Backend** : Service web gratuit (avec limitations)
- **Frontend** : Site statique gratuit (illimité)
- **Base de données** : PostgreSQL gratuit (90 jours, puis $7/mois)
- **HTTPS** : Automatique et gratuit
- **Déploiement automatique** : Depuis GitHub

## ⚠️ Limitations du plan gratuit

- **Backend** : S'endort après 15 minutes d'inactivité (première requête = réveil lent ~30s)
- **Base de données** : Gratuite 90 jours, puis $7/mois
- **Bandwidth** : 100 GB/mois

## 📋 Prérequis

1. Compte GitHub (gratuit)
2. Compte Render (gratuit) : https://render.com
3. Votre code poussé sur GitHub

## 🚀 Déploiement étape par étape

### Étape 1 : Préparer votre code

1. **Créez un repo GitHub** (si pas déjà fait)
2. **Poussez votre code** :
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/statmaster.git
git push -u origin main
```

### Étape 2 : Déployer le Backend

1. **Connectez-vous à Render** : https://dashboard.render.com
2. **Cliquez sur "New +"** > **"Web Service"**
3. **Connectez votre repo GitHub** (autorisez Render)
4. **Sélectionnez votre repo**
5. **Configurez le service** :
   - **Name** : `statmaster-backend`
   - **Environment** : `Node`
   - **Root Directory** : `backend` ⚠️ **IMPORTANT - C'est la clé !**
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Plan** : `Free`

6. **Ajoutez les variables d'environnement** :
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render définit automatiquement, mais on peut le spécifier)
   - `SUPABASE_URL` = votre URL Supabase
   - `SUPABASE_SERVICE_KEY` = votre service key
   - `SUPABASE_ANON_KEY` = votre anon key
   - `JWT_SECRET` = générez une clé secrète (ex: `openssl rand -hex 32`)
   - `GEMINI_API_KEY` = votre clé Gemini
   - `RESEND_API_KEY` = votre clé Resend (optionnel)
   - `FROM_EMAIL` = `noreply@statmaster.app`
   - `FRONTEND_URL` = `https://statmaster-frontend.onrender.com` (on l'ajustera après)

7. **Cliquez sur "Create Web Service"**
8. **Attendez le déploiement** (2-3 minutes)
9. **Notez l'URL** : `https://statmaster-backend.onrender.com`

### Étape 3 : Déployer le Frontend

1. **Dans Render Dashboard**, cliquez sur **"New +"** > **"Static Site"**
2. **Connectez votre repo GitHub** (si pas déjà fait)
3. **Sélectionnez votre repo**
4. **Configurez** :
   - **Name** : `statmaster-frontend`
   - **Build Command** : `echo "No build needed"`
   - **Publish Directory** : `.` (racine)
   - **Plan** : `Free`

5. **Ajoutez une route de réécriture** :
   - Cliquez sur **"Advanced"**
   - Ajoutez une **Rewrite Rule** :
     - **Source** : `/*`
     - **Destination** : `/index-standalone.html`

6. **Cliquez sur "Create Static Site"**
7. **Attendez le déploiement** (1-2 minutes)
8. **Notez l'URL** : `https://statmaster-frontend.onrender.com`

### Étape 4 : Configurer les URLs

1. **Mettez à jour le Backend** :
   - Dans Render Dashboard > `statmaster-backend` > **Environment**
   - Modifiez `FRONTEND_URL` = `https://statmaster-frontend.onrender.com`
   - Cliquez sur **"Save Changes"** (redéploiement automatique)

2. **Créez `config.js`** à la racine de votre repo :
```javascript
window.API_BASE_URL = 'https://statmaster-backend.onrender.com/api';
```

3. **Poussez sur GitHub** :
```bash
git add config.js
git commit -m "Add config for Render deployment"
git push
```

4. **Le frontend se redéploiera automatiquement**

## 🔧 Configuration alternative (sans render.yaml)

Si vous préférez configurer manuellement (recommandé pour la première fois) :

### Backend - Configuration manuelle

```
Name: statmaster-backend
Environment: Node
Build Command: cd backend && npm install
Start Command: cd backend && node server.js
Plan: Free
```

### Frontend - Configuration manuelle

```
Name: statmaster-frontend
Build Command: echo "No build needed"
Publish Directory: .
Plan: Free
```

**Rewrite Rules** (dans Advanced) :
- Source: `/*`
- Destination: `/index-standalone.html`

## ⚙️ Modifications nécessaires pour Render

### 1. Modifier backend/server.js pour Render

Render définit automatiquement le PORT. Assurez-vous que votre code utilise :

```javascript
const PORT = process.env.PORT || 3000;
```

C'est déjà le cas dans votre code ! ✅

### 2. Gérer le "sleep" du plan gratuit

Le backend gratuit s'endort après 15 min d'inactivité. Solutions :

**Option A : Utiliser un service de "ping" gratuit**
- UptimeRobot (gratuit) : https://uptimerobot.com
- Configurez un ping toutes les 5 minutes vers votre backend

**Option B : Accepter le délai de réveil**
- La première requête après le sleep prend ~30 secondes
- Les requêtes suivantes sont normales

## 📝 Variables d'environnement complètes

### Backend

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=votre_service_key
SUPABASE_ANON_KEY=votre_anon_key
JWT_SECRET=votre_jwt_secret_long_et_aleatoire
GEMINI_API_KEY=votre_cle_gemini
RESEND_API_KEY=votre_cle_resend
FROM_EMAIL=noreply@statmaster.app
FRONTEND_URL=https://statmaster-frontend.onrender.com
```

## ✅ Vérification

1. **Backend** : `https://statmaster-backend.onrender.com/health`
   - Devrait retourner : `{"status":"ok","timestamp":"..."}`

2. **Frontend** : `https://statmaster-frontend.onrender.com`
   - Devrait afficher l'application

3. **Test complet** :
   - Inscription/Connexion
   - Toutes les fonctionnalités

## 🐛 Dépannage

### Backend ne démarre pas

- Vérifiez les logs dans Render Dashboard
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que `cd backend && node server.js` fonctionne localement

### Erreur CORS

- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL du frontend
- Vérifiez les logs du backend pour les erreurs CORS

### Frontend ne charge pas

- Vérifiez que `config.js` existe et contient la bonne URL du backend
- Vérifiez la console du navigateur (F12)

### Backend "sleep"

- Utilisez UptimeRobot pour le garder éveillé
- Ou acceptez le délai de réveil de 30 secondes

## 💡 Astuces

1. **Déploiement automatique** : Render redéploie automatiquement à chaque push sur GitHub
2. **Logs en temps réel** : Consultez les logs dans Render Dashboard
3. **Variables d'environnement** : Modifiez-les sans redéployer (sauf changement de code)
4. **Custom domain** : Render permet d'ajouter un domaine personnalisé (gratuit)

## 🎉 C'est tout !

Votre application est maintenant accessible depuis n'importe où sur :
- Frontend : `https://statmaster-frontend.onrender.com`
- Backend : `https://statmaster-backend.onrender.com`

**Note** : Les URLs Render sont de la forme `xxx.onrender.com`. Vous pouvez ajouter un domaine personnalisé gratuitement dans les paramètres.

