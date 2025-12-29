-- Phase 1: Interaction & Content Schema Migration

-- 1. Concepts & Mastery (Base Layer)
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES concepts(id), -- Hierarchy
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE concept_relationships (
  source_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  target_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('prerequisite', 'related')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (source_id, target_id, type)
);

CREATE TABLE student_concept_mastery (
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  mastery_level FLOAT DEFAULT 0.0 CHECK (mastery_level >= 0.0 AND mastery_level <= 1.0),
  streak_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  next_review_date TIMESTAMP WITH TIME ZONE, -- Spaced Repetition Core
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (student_id, concept_id)
);

-- 2. Micro-learning Engine (Practice Decks)
CREATE TABLE practice_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image TEXT,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE SET NULL, -- Optional link to roadmap
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE practice_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES practice_decks(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id), -- Link to Concept
  card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('text', 'image', 'video', 'quiz')),
  content JSONB NOT NULL, -- Flexible content structure
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Internal Discussions (Community)
CREATE TABLE roadmap_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('roadmap', 'week', 'task')),
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES roadmap_discussions(id) ON DELETE CASCADE, -- Threading
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Live Sessions (Clinics/Workshops)
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  platform VARCHAR(50) DEFAULT 'zoom',
  session_type VARCHAR(50) CHECK (session_type IN ('clinic', 'anchor', 'workshop', 'office_hours')), -- TaRL Patterns
  target_audience JSONB, -- Array of tags e.g. ["module_1", "beginner"]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Gamification Updates
ALTER TABLE student_batch_assignments ADD COLUMN xp_points INTEGER DEFAULT 0;

-- 6. RLS Policies
-- Enable RLS
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Policies

-- Concepts are generally public read
CREATE POLICY "Public read access for concepts" ON concepts FOR SELECT USING (true);
CREATE POLICY "Public read access for concept_relationships" ON concept_relationships FOR SELECT USING (true);

-- Student Mastery: Users can read/write their own
CREATE POLICY "Users view own mastery" ON student_concept_mastery FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users update own mastery" ON student_concept_mastery FOR UPDATE USING (auth.uid() = student_id); -- Usually backend updates this, but allowing safe frontend updates for now if needed

-- Practice Decks: Public or Enrolled based (Simplifying to public read for now)
CREATE POLICY "Anyone can view public decks" ON practice_decks FOR SELECT USING (is_public = true OR auth.uid() = created_by);
CREATE POLICY "Mentors can create decks" ON practice_decks FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'mentor')
);

-- Cards inherit Deck visibility
CREATE POLICY "View cards if deck is visible" ON practice_cards FOR SELECT USING (
  EXISTS (SELECT 1 FROM practice_decks WHERE id = deck_id)
);
CREATE POLICY "Mentors manage cards" ON practice_cards FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'mentor')
);

-- Discussions: 
CREATE POLICY "View discussions" ON roadmap_discussions FOR SELECT USING (true); -- Ideally scoped to batch enrollment
CREATE POLICY "Create discussions" ON roadmap_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own discussions" ON roadmap_discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own discussions" ON roadmap_discussions FOR DELETE USING (auth.uid() = user_id);

-- Live Sessions
CREATE POLICY "View live sessions" ON live_sessions FOR SELECT USING (true); -- Scoped to batch usually
CREATE POLICY "Mentors manage sessions" ON live_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'mentor')
);

-- Indexes
CREATE INDEX idx_discussions_entity ON roadmap_discussions(entity_id, entity_type);
CREATE INDEX idx_cards_deck ON practice_cards(deck_id);
CREATE INDEX idx_mastery_student ON student_concept_mastery(student_id);
CREATE INDEX idx_sessions_batch ON live_sessions(batch_id);
