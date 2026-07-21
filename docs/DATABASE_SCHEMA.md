# Database Schema for 10MS SheSTEM Project

## Core Tables

### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'mentor', 'admin')) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  profile_picture_url TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. student_profiles
```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institute VARCHAR(255) NOT NULL,
  year VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  -- Note: batch_id has been removed to support multiple batch enrollments
  -- Students are now linked to batches through student_batch_assignments table
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. student_batch_assignments (NEW TABLE)
```sql
CREATE TABLE student_batch_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) CHECK (status IN ('active', 'completed', 'dropped', 'suspended')) DEFAULT 'active',
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  completed_weeks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, batch_id) -- Prevent duplicate assignments
);
```

### 4. mentor_profiles
```sql
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT users(id) ON DELETE CASCADE,
  organization VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  expertise_areas TEXT[],
  bio TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. batches
```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  roadmap_id UUID REFERENCES roadmaps(id),
  mentor_id UUID REFERENCES users(id),
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  whatsapp_link TEXT,
  discord_link TEXT,
  emergency_contact VARCHAR(20),
  status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. roadmaps
```sql
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  category VARCHAR(100) NOT NULL,
  node_unit_label VARCHAR(50) NOT NULL DEFAULT 'Week',
  slides_url TEXT,
  decision_tree_enabled BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6b. roadmap_slide_decks
```sql
CREATE TABLE roadmap_slide_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slides_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_default_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6c. roadmap_decision_trees
```sql
CREATE TABLE roadmap_decision_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  tree_key VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_default_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (roadmap_id, tree_key)
);
```

### 6d. batch_slide_decks / batch_decision_trees
```sql
CREATE TABLE batch_slide_decks (
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  slide_deck_id UUID REFERENCES roadmap_slide_decks(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  PRIMARY KEY (batch_id, slide_deck_id)
);

CREATE TABLE batch_decision_trees (
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  decision_tree_id UUID REFERENCES roadmap_decision_trees(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  PRIMARY KEY (batch_id, decision_tree_id)
);
```

Legacy `roadmaps.slides_url` and `roadmaps.decision_tree_enabled` remain as fallback when catalog is empty.

### 7. roadmap_weeks
```sql
CREATE TABLE roadmap_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  domain VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. roadmap_tasks
```sql
CREATE TABLE roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES roadmap_weeks(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  task_details TEXT,
  task_type VARCHAR(20) CHECK (task_type IN ('watch', 'read', 'project', 'attend', 'mcq', 'written')) NOT NULL,
  relevant_links TEXT[],
  deadline DATE,
  estimated_hours INTEGER,
  points INTEGER DEFAULT 10,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 9. student_progress
```sql
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue')) DEFAULT 'not_started',
  completed_at TIMESTAMP,
  score DECIMAL(5,2),
  feedback TEXT,
  submitted_files TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 10. notices
```sql
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  batch_id UUID REFERENCES batches(id),
  tag VARCHAR(100),
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  scheduled_date DATE,
  scheduled_time TIME,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 11. user_sessions
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Key Changes Made

### Student-Batch Relationship
- **Before**: Students could only be enrolled in one batch at a time (via `student_profiles.batch_id`)
- **After**: Students can be enrolled in multiple batches simultaneously via the `student_batch_assignments` table
- This enables students to participate in multiple roadmaps/programs concurrently

### Benefits of New Structure
1. **Multiple Enrollments**: Students can join multiple batches without losing progress in others
2. **Flexible Progress Tracking**: Each enrollment maintains its own progress metrics
3. **Status Management**: Each enrollment can have different statuses (active, completed, dropped, suspended)
4. **Scalability**: Easy to add new batch enrollments without affecting existing ones

## Indexes for Performance
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Student-batch assignments
CREATE INDEX idx_student_batch_assignments_student ON student_batch_assignments(student_id);
CREATE INDEX idx_student_batch_assignments_batch ON student_batch_assignments(batch_id);
CREATE INDEX idx_student_batch_assignments_status ON student_batch_assignments(status);

-- Student progress
CREATE INDEX idx_student_progress_student_task ON student_progress(student_id, task_id);
CREATE INDEX idx_student_progress_status ON student_progress(status);

-- Roadmap queries
CREATE INDEX idx_roadmap_tasks_week ON roadmap_tasks(week_id);
CREATE INDEX idx_roadmap_weeks_roadmap ON roadmap_weeks(roadmap_id);
```

## Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_batch_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
-- ... (enable on all tables)

-- Example policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can view their own batch assignments" ON student_batch_assignments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view their own progress" ON student_progress
  FOR SELECT USING (auth.uid() = student_id);
```

## Migration Notes
- The `student_profiles.batch_id` column has been removed
- Existing student-batch relationships have been migrated to `student_batch_assignments`
- All queries that previously used `student_profiles.batch_id` should be updated to use the new table structure
