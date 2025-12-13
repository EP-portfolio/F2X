# 📱 Accès depuis Mobile - Guide Rapide

## 🚀 Méthode 1 : Déploiement en ligne (Recommandé)

Une fois déployé sur Vercel/Netlify, votre application sera accessible depuis n'importe quel appareil avec une connexion Internet.

### Étapes :

1. **Déployez le backend** sur Vercel (voir `docs/DEPLOYMENT.md`)
2. **Déployez le frontend** sur Vercel/Netlify
3. **Mettez à jour `config.js`** avec l'URL du backend déployé
4. **Accédez** à l'URL depuis n'importe quel appareil

---

## 🏠 Méthode 2 : Accès local (même réseau WiFi)

Pour tester depuis votre mobile sur le même réseau WiFi :

### 1. Trouvez votre IP locale

**Windows** :
```bash
ipconfig
# Cherchez "Adresse IPv4" (ex: 192.168.1.100)
```

**Mac/Linux** :
```bash
ifconfig
# Cherchez "inet" (ex: 192.168.1.100)
```

### 2. Lancez le backend

```bash
cd backend
npm run dev
# Le backend sera sur http://192.168.1.100:3000
```

### 3. Lancez le frontend

```bash
# À la racine du projet
python -m http.server 8000 --bind 0.0.0.0
# Le frontend sera sur http://192.168.1.100:8000
```

### 4. Configurez config.js

Créez `config.js` à la racine :
```javascript
window.API_BASE_URL = 'http://192.168.1.100:3000/api';
```
(Remplacez `192.168.1.100` par votre IP locale)

### 5. Accédez depuis votre mobile

1. Connectez votre mobile au **même réseau WiFi**
2. Ouvrez le navigateur
3. Allez sur : `http://192.168.1.100:8000/index-standalone.html`

---

## 🌐 Méthode 3 : Tunnel public (ngrok)

Pour accéder depuis n'importe où (même hors de votre réseau) :

### 1. Installez ngrok

```bash
npm install -g ngrok
# Ou téléchargez depuis https://ngrok.com
```

### 2. Créez un compte ngrok (gratuit)

1. Allez sur https://ngrok.com
2. Créez un compte
3. Copiez votre authtoken

### 3. Configurez ngrok

```bash
ngrok config add-authtoken votre_token
```

### 4. Lancez les tunnels

**Terminal 1 - Backend** :
```bash
cd backend
npm run dev
```

**Terminal 2 - Tunnel Backend** :
```bash
ngrok http 3000
# Notez l'URL (ex: https://abc123.ngrok.io)
```

**Terminal 3 - Frontend** :
```bash
python -m http.server 8000
```

**Terminal 4 - Tunnel Frontend** :
```bash
ngrok http 8000
# Notez l'URL (ex: https://xyz789.ngrok.io)
```

### 5. Configurez config.js

```javascript
window.API_BASE_URL = 'https://abc123.ngrok.io/api';
```

### 6. Accédez depuis votre mobile

Ouvrez `https://xyz789.ngrok.io/index-standalone.html` depuis n'importe où !

---

## ⚠️ Important

- **Développement** : Les URLs ngrok changent à chaque redémarrage (gratuit)
- **Production** : Utilisez un déploiement Vercel/Netlify pour des URLs stables
- **Sécurité** : Ne partagez pas vos URLs ngrok publiquement en production

---

## ✅ Test rapide

1. Ouvrez l'application sur votre mobile
2. Testez l'inscription/connexion
3. Testez toutes les fonctionnalités
4. Vérifiez que les appels API fonctionnent

Si tout fonctionne, vous pouvez accéder depuis n'importe quel appareil ! 🎉

