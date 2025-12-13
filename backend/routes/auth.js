import express from 'express';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  parentEmail: z.string().email().optional(),
  language: z.enum(['fr', 'en']).default('fr')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

/**
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, parentEmail, language } = validatedData;

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        parent_email: parentEmail || null,
        language: language || 'fr',
        subscription_tier: 'free', // Default to free tier
        subscription_status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        language: user.language
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Get user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, language, subscription_status')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        language: user.language,
        subscriptionStatus: user.subscription_status
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

