# 🌐 Guide de Déploiement - Stat'Master

Ce guide explique comment déployer Stat'Master pour qu'il soit accessible depuis n'importe quel appareil.

## 🎯 Options de déploiement

### Option 0 : Render (Gratuit - Recommandé pour débuter) ⭐

**Avantages** :
- ✅ Plan gratuit généreux
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique
- ✅ Simple à configurer

**Limitations** :
- ⚠️ Backend s'endort après 15 min d'inactivité (première requête = ~30s de délai)

**Guide complet** : Voir [`docs/DEPLOY_RENDER.md`](DEPLOY_RENDER.md)

### Option 1 : Vercel (Recommandé - Gratuit) ⭐

#### Backend

1. **Installez Vercel CLI** :
```bash
npm i -g vercel
```

2. **Dans le dossier `backend/`** :
```bash
cd backend
vercel
```

3. **Configurez les variables d'environnement** dans Vercel Dashboard :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_ANON_KEY`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `FRONTEND_URL` (URL de votre frontend déployé)

4. **Créez `vercel.json`** dans `backend/` :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### Frontend

1. **Créez `vercel.json`** à la racine :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index-standalone.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index-standalone.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

2. **Déployez** :
```bash
vercel
```

3. **Mettez à jour `config.js`** avec l'URL du backend :
```javascript
window.API_BASE_URL = 'https://votre-backend.vercel.app/api';
```

---

### Option 2 : Netlify (Gratuit)

#### Backend

Netlify Functions pour le backend (limité). Recommandation : utiliser Vercel pour le backend.

#### Frontend

1. **Créez `netlify.toml`** à la racine :
```toml
[build]
  publish = "."
  command = "echo 'No build needed'"

[[redirects]]
  from = "/*"
  to = "/index-standalone.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

2. **Déployez** :
   - Connectez votre repo GitHub à Netlify
   - Ou utilisez Netlify CLI : `netlify deploy --prod`

---

### Option 3 : Railway (Payant mais simple)

1. **Créez un compte** sur [Railway](https://railway.app)

2. **Backend** :
   - Créez un nouveau projet
   - Connectez votre repo GitHub
   - Sélectionnez le dossier `backend/`
   - Ajoutez les variables d'environnement
   - Railway détecte automatiquement Node.js

3. **Frontend** :
   - Créez un autre service
   - Sélectionnez le dossier racine
   - Configurez comme site statique

---

### Option 4 : VPS (Serveur dédié)

#### Sur un VPS Ubuntu/Debian

1. **Installez Node.js** :
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Installez PM2** :
```bash
sudo npm install -g pm2
```

3. **Clonez votre repo** :
```bash
git clone votre-repo
cd F2X
```

4. **Configurez le backend** :
```bash
cd backend
npm install
# Créez .env avec vos clés
pm2 start server.js --name statmaster-backend
pm2 save
pm2 startup
```

5. **Installez Nginx** :
```bash
sudo apt install nginx
```

6. **Configurez Nginx pour le backend** :
```bash
sudo nano /etc/nginx/sites-available/statmaster-backend
```

```nginx
server {
    listen 80;
    server_name api.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Configurez Nginx pour le frontend** :
```bash
sudo nano /etc/nginx/sites-available/statmaster-frontend
```

```nginx
server {
    listen 80;
    server_name votredomaine.com;

    root /chemin/vers/F2X;
    index index-standalone.html;

    location / {
        try_files $uri $uri/ /index-standalone.html;
    }
}
```

8. **Activez les sites** :
```bash
sudo ln -s /etc/nginx/sites-available/statmaster-backend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/statmaster-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Installez Certbot pour HTTPS** :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votredomaine.com -d api.votredomaine.com
```

---

## 🔧 Configuration CORS

Assurez-vous que le backend autorise les requêtes depuis votre frontend :

Dans `backend/server.js`, vérifiez :
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://votre-frontend.vercel.app',
  credentials: true
}));
```

Pour développement local depuis mobile :
```javascript
app.use(cors({
  origin: ['http://localhost:8000', 'http://192.168.1.X:8000'], // IP locale
  credentials: true
}));
```

---

## 📱 Accès depuis mobile (développement local)

### Option 1 : IP locale

1. **Trouvez votre IP locale** :
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. **Lancez le serveur** :
```bash
python -m http.server 8000 --bind 0.0.0.0
```

3. **Sur votre mobile** (même WiFi) :
   - Ouvrez `http://192.168.1.X:8000/index-standalone.html`
   - Remplacez `192.168.1.X` par votre IP locale

4. **Mettez à jour `config.js`** :
```javascript
window.API_BASE_URL = 'http://192.168.1.X:3000/api';
```

### Option 2 : ngrok (Tunnel public)

1. **Installez ngrok** :
```bash
npm install -g ngrok
# Ou téléchargez depuis ngrok.com
```

2. **Lancez ngrok** :
```bash
# Pour le frontend
ngrok http 8000

# Pour le backend (dans un autre terminal)
ngrok http 3000
```

3. **Utilisez les URLs ngrok** dans `config.js`

---

## ✅ Checklist de déploiement

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] HTTPS activé (pour production)
- [ ] Base de données Supabase accessible
- [ ] Tests depuis différents appareils
- [ ] Domaines configurés (optionnel)

---

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL réelle
- Vérifiez les headers CORS dans le navigateur (F12 > Network)

### Backend inaccessible
- Vérifiez que le port est ouvert (3000)
- Vérifiez les logs : `pm2 logs` ou dans Vercel/Railway

### Frontend ne charge pas
- Vérifiez que tous les fichiers sont déployés
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que `config.js` pointe vers le bon backend

---

## 🚀 Déploiement rapide (Vercel - Recommandé)

```bash
# Backend
cd backend
vercel

# Frontend (à la racine)
vercel

# Notez les URLs et mettez à jour config.js
```

C'est tout ! Votre application sera accessible depuis n'importe quel appareil. 🎉

