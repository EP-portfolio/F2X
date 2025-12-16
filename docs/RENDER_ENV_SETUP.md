# ⚙️ Configuration des Variables d'Environnement sur Render

Votre build a réussi ! Maintenant, vous devez configurer les variables d'environnement dans Render Dashboard.

## 🚨 Erreur actuelle

```
Error: Missing Supabase configuration. Check your .env file.
```

## ✅ Solution : Configurer les variables dans Render

### Étape 1 : Accéder aux variables d'environnement

1. Allez sur **Render Dashboard** : https://dashboard.render.com
2. Cliquez sur votre service **`statmaster-backend`**
3. Dans le menu de gauche, cliquez sur **"Environment"**

### Étape 2 : Ajouter les variables

Cliquez sur **"Add Environment Variable"** et ajoutez chacune de ces variables :

#### Variables Supabase (OBLIGATOIRES)

1. **`SUPABASE_URL`**
   - Valeur : `https://xxxxx.supabase.co`
   - Où trouver : Supabase Dashboard > Settings > API > Project URL

2. **`SUPABASE_SERVICE_KEY`**
   - Valeur : `eyJhbGc...` (longue clé)
   - Où trouver : Supabase Dashboard > Settings > API > service_role key (secret)
   - ⚠️ **IMPORTANT** : Utilisez la `service_role` key, pas la `anon` key

3. **`SUPABASE_ANON_KEY`**
   - Valeur : `eyJhbGc...` (clé plus courte)
   - Où trouver : Supabase Dashboard > Settings > API > anon public key

#### Variables JWT (OBLIGATOIRE)

4. **`JWT_SECRET`**
   - Valeur : Générez une clé secrète aléatoire
   - Comment générer :
     ```bash
     # Sur Windows (PowerShell)
     -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
     
     # Ou utilisez un générateur en ligne : https://randomkeygen.com/
     ```
   - Exemple : `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1p`

#### Variables Gemini API (OBLIGATOIRE - pour la génération d'exercices)

5. **`GEMINI_API_KEY`**
   - Valeur : `AIza...` (votre clé Gemini)
   - Où trouver : https://aistudio.google.com/app/apikey
   - ⚠️ **IMPORTANT** : Cette clé est utilisée pour générer les exercices inspirés du Brevet dans la section Évaluation
   - ✅ **SÉCURISÉE** : La clé reste côté serveur, elle n'est jamais exposée au client

#### Variables Email (OPTIONNEL - pour notifications parents)

6. **`RESEND_API_KEY`**
   - Valeur : Votre clé Resend
   - Où trouver : https://resend.com/api-keys
   - ⚠️ Si non configuré, les emails ne seront pas envoyés

7. **`FROM_EMAIL`**
   - Valeur : `noreply@statmaster.app` (ou votre email vérifié)
   - ⚠️ Doit être un email vérifié dans Resend

#### Variables système (AUTOMATIQUES - ne pas modifier)

8. **`NODE_ENV`**
   - Valeur : `production` (déjà configuré)

9. **`PORT`**
   - Valeur : Automatiquement défini par Render (ne pas modifier)

10. **`FRONTEND_URL`**
    - Valeur : L'URL de votre frontend déployé
    - Exemple : `https://statmaster-frontend.onrender.com`
    - ⚠️ À configurer après avoir déployé le frontend

## 📋 Checklist complète

- [ ] `SUPABASE_URL` configuré
- [ ] `SUPABASE_SERVICE_KEY` configuré
- [ ] `SUPABASE_ANON_KEY` configuré
- [ ] `JWT_SECRET` configuré (généré)
- [ ] `GEMINI_API_KEY` configuré
- [ ] `RESEND_API_KEY` configuré (optionnel)
- [ ] `FROM_EMAIL` configuré (optionnel)
- [ ] `FRONTEND_URL` configuré (après déploiement frontend)

## 🔄 Après avoir ajouté les variables

1. **Sauvegardez** les variables (elles sont sauvegardées automatiquement)
2. Render **redéploiera automatiquement** votre service
3. Attendez 1-2 minutes pour le redéploiement
4. Vérifiez les logs pour confirmer que le serveur démarre

## ✅ Vérification

Une fois redéployé, vérifiez que le serveur fonctionne :

1. Allez dans **"Logs"** de votre service
2. Vous devriez voir :
   ```
   🚀 Server running on port 10000
   📡 Frontend URL: ...
   🌍 Environment: production
   Scheduler initialized
   ```

3. Testez l'endpoint de santé :
   ```
   https://votre-backend.onrender.com/health
   ```
   Devrait retourner : `{"status":"ok","timestamp":"..."}`

## 🐛 Si ça ne fonctionne toujours pas

1. Vérifiez que toutes les variables sont bien définies (pas de typos)
2. Vérifiez les logs pour d'autres erreurs
3. Vérifiez que les clés Supabase sont correctes (copie/colle exacte)
4. Vérifiez que la `SUPABASE_SERVICE_KEY` est bien la `service_role` key (pas `anon`)

## 📚 Ressources

- [Guide Supabase - Obtenir les clés API](https://supabase.com/docs/guides/api)
- [Guide Render - Variables d'environnement](https://render.com/docs/environment-variables)

