import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import practiceRoutes from './routes/practice.js';
import assessmentRoutes from './routes/assessments.js';
import recommendationRoutes from './routes/recommendations.js';
import exerciseRoutes from './routes/exercises.js';
import tutorRoutes from './routes/tutor.js';
import { setupScheduler } from './services/scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';
const FRONTEND_REGEX = process.env.FRONTEND_REGEX || /\.onrender\.com$/;

// Middleware
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];

// Add local network IPs for mobile testing
if (process.env.NODE_ENV !== 'production') {
  // Allow any origin in development (for mobile testing on same network)
  app.use(cors({
    origin: true, // Allow any origin in dev
    credentials: true
  }));
} else {
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      const isAllowedList = allowedOrigins.indexOf(origin) !== -1;
      const isRender = FRONTEND_REGEX && FRONTEND_REGEX.test && FRONTEND_REGEX.test(origin);
      const isVercelOrNetlify = origin.includes('vercel.app') || origin.includes('netlify.app');

      if (isAllowedList || isRender || isVercelOrNetlify) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
}
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/tutor', tutorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Setup scheduler
  setupScheduler();
});

