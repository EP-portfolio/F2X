# 📡 Documentation API - Stat'Master

## Base URL

```
http://localhost:3000/api
```

## Authentification

Toutes les routes (sauf `/auth/*`) nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

## Routes

### Authentification

#### POST `/auth/register`
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "eleve@example.com",
  "password": "motdepasse123",
  "parentEmail": "parent@example.com", // optionnel
  "language": "fr" // "fr" ou "en"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "eleve@example.com",
    "language": "fr"
  },
  "token": "jwt_token"
}
```

#### POST `/auth/login`
Connexion

**Body:**
```json
{
  "email": "eleve@example.com",
  "password": "motdepasse123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "eleve@example.com",
    "language": "fr",
    "subscriptionStatus": "active"
  },
  "token": "jwt_token"
}
```

### Practice

#### POST `/practice/sessions`
Sauvegarder une session d'entraînement

**Body:**
```json
{
  "chapterId": "stats-3eme",
  "exerciseType": "mean",
  "score": 85,
  "timeSpent": 120,
  "attempts": 3,
  "correctAnswers": 5,
  "totalQuestions": 6
}
```

#### GET `/practice/history/:chapterId`
Récupérer l'historique d'entraînement pour un chapitre

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "chapter_id": "stats-3eme",
      "exercise_type": "mean",
      "score": 85,
      "time_spent": 120,
      "completed_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### GET `/practice/stats/:chapterId`
Récupérer les statistiques de performance

**Response:**
```json
{
  "averageScore": 82.5,
  "totalTimeSpent": 3600,
  "totalSessions": 15,
  "exerciseTypes": {
    "mean": {
      "count": 5,
      "avgScore": 85
    }
  },
  "lastPracticeDate": "2025-01-15T10:30:00Z"
}
```

### Assessments

#### POST `/assessments/sessions`
Créer une nouvelle session d'évaluation

**Body:**
```json
{
  "chapterId": "stats-3eme"
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "chapter_id": "stats-3eme",
    "status": "in_progress",
    "started_at": "2025-01-15T10:30:00Z"
  }
}
```

#### POST `/assessments/analyze`
Analyser le travail d'un élève (image)

**Body:**
```json
{
  "sessionId": "uuid",
  "exerciseIndex": 0,
  "imageBase64": "base64_encoded_image",
  "exerciseData": {
    "title": "Exercice 1",
    "type": "table",
    "problem": "...",
    "rawData": {...}
  },
  "language": "fr"
}
```

**Response:**
```json
{
  "feedback": "Analyse détaillée du travail..."
}
```

#### POST `/assessments/sessions/:sessionId/complete`
Compléter une session d'évaluation

**Body:**
```json
{
  "overallScore": 85,
  "strengths": ["mean", "median"],
  "weaknesses": ["frequency"],
  "exercises": [...],
  "language": "fr"
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "status": "completed",
    "overall_score": 85,
    "recommendations": [...]
  },
  "recommendations": [...]
}
```

#### GET `/assessments/history?chapterId=stats-3eme`
Récupérer l'historique des évaluations

#### GET `/assessments/due`
Vérifier si une évaluation est due

**Response:**
```json
{
  "isDue": true,
  "daysSinceLast": 4,
  "lastAssessmentDate": "2025-01-11T10:30:00Z"
}
```

### Recommendations

#### GET `/recommendations`
Récupérer les recommandations personnalisées

**Response:**
```json
{
  "recommendations": [
    {
      "type": "practice",
      "title": "Pratiquer les fréquences",
      "description": "...",
      "priority": "high",
      "estimatedTime": "20",
      "chapter": "Statistics"
    }
  ],
  "generatedAt": "2025-01-15T10:30:00Z"
}
```

## Codes d'erreur

- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Token invalide ou expiré
- `404` : Ressource non trouvée
- `500` : Erreur serveur

