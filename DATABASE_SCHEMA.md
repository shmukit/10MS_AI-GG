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

### 2. student_profiles
```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institute VARCHAR(255) NOT NULL,
  year VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  batch_id UUID REFERENCES batches(id),
  completed_weeks INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. mentor_profiles
```sql
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  expertise_areas TEXT[],
  bio TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. batches
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

### 5. roadmaps
```sql
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  category VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. roadmap_weeks
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

### 7. roadmap_tasks
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

### 8. student_progress
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

### 9. notices
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



### 10. user_sessions
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes for Performance
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

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
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
-- ... (enable on all tables)

-- Example policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can view their own progress" ON student_progress
  FOR SELECT USING (auth.uid() = student_id);
```
