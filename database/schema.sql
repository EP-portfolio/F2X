-- Stat'Master Database Schema for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  language VARCHAR(2) DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'moderate', 'unlimited')),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  parent_email VARCHAR(255),
  parent_notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id VARCHAR(50) PRIMARY KEY,
  subject VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id VARCHAR(50) NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  exercise_type VARCHAR(100) NOT NULL,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent INTEGER NOT NULL CHECK (time_spent >= 0), -- in seconds
  attempts INTEGER NOT NULL CHECK (attempts >= 1),
  correct_answers INTEGER NOT NULL CHECK (correct_answers >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions >= 1),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment sessions table
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id VARCHAR(50) NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  overall_score DECIMAL(5,2) CHECK (overall_score >= 0 AND overall_score <= 100),
  exercises_data JSONB,
  feedback_data JSONB,
  recommendations JSONB,
  parent_notification_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment exercises table
CREATE TABLE IF NOT EXISTS assessment_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  exercise_type VARCHAR(100) NOT NULL,
  problem_data JSONB NOT NULL,
  student_answer JSONB,
  feedback TEXT,
  score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100),
  corrected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_chapter_id ON practice_sessions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_completed_at ON practice_sessions(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_chapter_id ON assessment_sessions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status ON assessment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_completed_at ON assessment_sessions(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_exercises_session_id ON assessment_exercises(assessment_session_id);

-- Insert default chapters
INSERT INTO chapters (id, subject, level, title, description, order_index) VALUES
  ('stats-3eme', 'Mathématiques', '3ème', 'Statistiques', 'Chapitre sur les statistiques pour le niveau 3ème', 1)
ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_exercises ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own practice sessions" ON practice_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own practice sessions" ON practice_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own assessment sessions" ON assessment_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own assessment sessions" ON assessment_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own assessment sessions" ON assessment_sessions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own assessment exercises" ON assessment_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions
      WHERE assessment_sessions.id = assessment_exercises.assessment_session_id
      AND auth.uid()::text = assessment_sessions.user_id::text
    )
  );

CREATE POLICY "Users can insert own assessment exercises" ON assessment_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_sessions
      WHERE assessment_sessions.id = assessment_exercises.assessment_session_id
      AND auth.uid()::text = assessment_sessions.user_id::text
    )
  );

-- Note: For service role operations (backend), RLS is bypassed when using service key

