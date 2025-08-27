-- 10MS SheSTEM Database Tables Creation Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 2. Create roadmaps table (needed before batches)
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  category VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create batches table
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 4. Create student_profiles table
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 5. Create mentor_profiles table
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  expertise_areas TEXT[],
  bio TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create roadmap_weeks table
CREATE TABLE roadmap_weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  domain VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create roadmap_tasks table
CREATE TABLE roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 8. Create student_progress table
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 9. Create notices table
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 10. Create user_sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_batch_id ON student_profiles(batch_id);
CREATE INDEX idx_mentor_profiles_user_id ON mentor_profiles(user_id);
CREATE INDEX idx_batches_roadmap_id ON batches(roadmap_id);
CREATE INDEX idx_batches_mentor_id ON batches(mentor_id);
CREATE INDEX idx_roadmap_weeks_roadmap_id ON roadmap_weeks(roadmap_id);
CREATE INDEX idx_roadmap_tasks_week_id ON roadmap_tasks(week_id);
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_task_id ON student_progress(task_id);
CREATE INDEX idx_student_progress_status ON student_progress(status);
CREATE INDEX idx_notices_batch_id ON notices(batch_id);
CREATE INDEX idx_notices_author_id ON notices(author_id);


-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to tables that need them
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentor_profiles_updated_at BEFORE UPDATE ON mentor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Insert sample data for testing
INSERT INTO roadmaps (title, description, total_weeks, difficulty_level, category) VALUES
('Python Fundamentals', 'Learn the core concepts of Python programming', 8, 'beginner', 'Programming'),
('Data Structures', 'Master fundamental data structures and algorithms', 6, 'intermediate', 'Computer Science'),
('Web Development', 'Build web applications with modern frameworks', 10, 'intermediate', 'Web Development'),
('Machine Learning', 'Introduction to ML algorithms and concepts', 12, 'advanced', 'Artificial Intelligence');

-- Create a sample admin user (password: admin123)
INSERT INTO users (email, password_hash, role, first_name, last_name, email_verified) VALUES
('admin@10ms.com', '$2a$10$example_hash_here', 'admin', 'System', 'Admin', true);

-- Create a sample mentor user (password: mentor123)
INSERT INTO users (email, password_hash, role, first_name, last_name, email_verified) VALUES
('uttam.deb@10minuteschool.com', '$2a$10$example_hash_here', 'mentor', 'Uttam', 'Deb', true);

-- Create mentor profile
INSERT INTO mentor_profiles (user_id, organization, designation, expertise_areas, years_of_experience) VALUES
((SELECT id FROM users WHERE email = 'uttam.deb@10minuteschool.com'), '10 Minute School', 'Senior BI Executive', ARRAY['Python', 'SQL', 'Data Analysis'], 5);

-- Create a sample batch
INSERT INTO batches (name, roadmap_id, mentor_id, start_date, status) VALUES
('Python Learning Cohort - Batch 15', 
 (SELECT id FROM roadmaps WHERE title = 'Python Fundamentals'),
 (SELECT id FROM users WHERE email = 'uttam.deb@10minuteschool.com'),
 '2025-01-01', 'active');

-- Create sample roadmap weeks
INSERT INTO roadmap_weeks (roadmap_id, week_number, title, description, domain) VALUES
((SELECT id FROM roadmaps WHERE title = 'Python Fundamentals'), 1, 'Introduction to Python', 'Learn Python basics and setup', 'Python Basics'),
((SELECT id FROM roadmaps WHERE title = 'Python Fundamentals'), 2, 'Variables and Data Types', 'Understanding data types and variables', 'Python Basics'),
((SELECT id FROM roadmaps WHERE title = 'Python Fundamentals'), 3, 'Control Structures', 'If statements and loops', 'Python Basics');

-- Create sample tasks
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, deadline, points) VALUES
((SELECT id FROM roadmap_weeks WHERE week_number = 1 AND roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Python Fundamentals')), 
 'Install Python', 'Install Python and set up development environment', 'project', ARRAY['https://python.org/downloads'], '2025-01-15', 10),
((SELECT id FROM roadmap_weeks WHERE week_number = 1 AND roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Python Fundamentals')), 
 'Watch Python Introduction', 'Watch video on Python fundamentals', 'watch', ARRAY['https://youtube.com/watch?v=example'], '2025-01-17', 5);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you'll need to customize these based on your auth setup)
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);
CREATE POLICY "Public read access to roadmaps" ON roadmaps FOR SELECT USING (true);
CREATE POLICY "Public read access to roadmap weeks" ON roadmap_weeks FOR SELECT USING (true);
CREATE POLICY "Public read access to roadmap tasks" ON roadmap_tasks FOR SELECT USING (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
SELECT 'Database tables created successfully!' as status;
