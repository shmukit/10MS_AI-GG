-- Seed script for Adaptive Learning System Demo Data
-- Targeted for "Revenue Cycle Management Specialist" Roadmap
-- Roadmap ID: 172580f4-1209-4e31-9841-21c939175a61
-- Users: Raied (Admin), Mukit (Mentor/Student), Uttam (Mentor/Student)

BEGIN;

-- 1. Concepts (Hierarchical)
-- ID: a0000000-0000-0000-0000-000000000001
INSERT INTO public.concepts (id, name, description, parent_id, created_at)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'Revenue Cycle Management', 'Core domain of maintaining financial viability of healthcare facilities.', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- Level 1
INSERT INTO public.concepts (id, name, description, parent_id, created_at)
VALUES 
    ('a0000000-0000-0000-0000-000000000002', 'Medical Terminology', 'Language used to describe human body components, processes, conditions.', 'a0000000-0000-0000-0000-000000000001', NOW()),
    ('a0000000-0000-0000-0000-000000000003', 'Medical Coding', 'Transformation of healthcare diagnoses into universal medical alphanumeric codes.', 'a0000000-0000-0000-0000-000000000001', NOW())
ON CONFLICT (id) DO NOTHING;

-- Level 2
INSERT INTO public.concepts (id, name, description, parent_id, created_at)
VALUES 
    ('a0000000-0000-0000-0000-000000000004', 'Medical Prefixes', 'Found at beginning of words to modify meaning.', 'a0000000-0000-0000-0000-000000000002', NOW()),
    ('a0000000-0000-0000-0000-000000000005', 'Medical Suffixes', 'Found at end of words.', 'a0000000-0000-0000-0000-000000000002', NOW()),
    ('a0000000-0000-0000-0000-000000000006', 'ICD-10-CM', 'International Classification of Diseases.', 'a0000000-0000-0000-0000-000000000003', NOW()),
    ('a0000000-0000-0000-0000-000000000007', 'CPT Coding', 'Current Procedural Terminology.', 'a0000000-0000-0000-0000-000000000003', NOW())
ON CONFLICT (id) DO NOTHING;


-- 2. Concept Relationships
INSERT INTO public.concept_relationships (source_id, target_id, type, created_at)
VALUES
    ('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'prerequisite', NOW()), 
    ('a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007', 'related', NOW())
ON CONFLICT (source_id, target_id, type) DO NOTHING;


-- 3. Batches
-- ID: b0000000-0000-0000-0000-000000000001
INSERT INTO public.batches (id, name, roadmap_id, start_date, status, max_students, current_students, created_at, updated_at)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Augmedix RCM - Batch A', '172580f4-1209-4e31-9841-21c939175a61', NOW(), 'active', 50, 3, NOW(), NOW())
ON CONFLICT (id) DO UPDATE 
SET current_students = 3;


-- 4. Student Batch Assignments
-- Mukit
INSERT INTO public.student_batch_assignments (student_id, batch_id, status, enrollment_date, progress_percentage, completed_weeks, xp_points, created_at)
SELECT '95595c17-d5dd-4449-96d6-1699977f27c3', 'b0000000-0000-0000-0000-000000000001', 'active', NOW(), 35, 2, 1250, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.student_batch_assignments 
    WHERE student_id = '95595c17-d5dd-4449-96d6-1699977f27c3' AND batch_id = 'b0000000-0000-0000-0000-000000000001'
);

-- Uttam
INSERT INTO public.student_batch_assignments (student_id, batch_id, status, enrollment_date, progress_percentage, completed_weeks, xp_points, created_at)
SELECT 'fc4ffbf1-0b68-40d3-92c1-fdb46def4cd0', 'b0000000-0000-0000-0000-000000000001', 'active', NOW(), 10, 0, 350, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.student_batch_assignments 
    WHERE student_id = 'fc4ffbf1-0b68-40d3-92c1-fdb46def4cd0' AND batch_id = 'b0000000-0000-0000-0000-000000000001'
);

-- Raied
INSERT INTO public.student_batch_assignments (student_id, batch_id, status, enrollment_date, progress_percentage, completed_weeks, xp_points, created_at)
SELECT '50103e4f-a176-4998-af73-ba1beb45ae8d', 'b0000000-0000-0000-0000-000000000001', 'active', NOW(), 85, 5, 4500, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.student_batch_assignments 
    WHERE student_id = '50103e4f-a176-4998-af73-ba1beb45ae8d' AND batch_id = 'b0000000-0000-0000-0000-000000000001'
);


-- 5. Live Sessions
INSERT INTO public.live_sessions (id, batch_id, title, description, start_time, duration_minutes, platform, session_type, target_audience, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Clinic: Medical Terminology Basics', 'Targeted support for those stuck on Module 1.', NOW() + INTERVAL '1 day', 45, 'google_meet', 'clinic', '{"min_level": 1, "max_level": 2}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_sessions (id, batch_id, title, description, start_time, duration_minutes, platform, session_type, target_audience, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Workshop: Advanced ICD-10 Case Studies', 'Deep dive into complex coding scenarios.', NOW() + INTERVAL '3 days', 90, 'zoom', 'workshop', '{"min_level": 3, "max_level": 6}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- 6. User Sessions
-- (Optional inserts here)


-- 7. Practice Decks
INSERT INTO public.practice_decks (id, title, description, roadmap_id, is_public, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'RCM Foundations', 'Core concepts of Revenue Cycle Management', '172580f4-1209-4e31-9841-21c939175a61', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- 8. Practice Cards
INSERT INTO public.practice_cards (id, deck_id, concept_id, card_type, order_index, content, created_at)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'quiz', 0, '{"question": "What does the prefix ''Brady-'' mean?", "options": ["Fast", "Slow", "High", "Low"], "correctAnswer": "Slow", "explanation": "Brady- means slow, as in Bradycardia (slow heart rate)."}'::json, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.practice_cards (id, deck_id, concept_id, card_type, order_index, content, created_at)
VALUES
    ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'quiz', 1, '{"question": "What does the suffix ''-itis'' indicate?", "options": ["Removal", "Pain", "Inflammation", "Study of"], "correctAnswer": "Inflammation", "explanation": "Itis denotes inflammation, e.g., Tonsillitis."}'::json, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.practice_cards (id, deck_id, concept_id, card_type, order_index, content, created_at)
VALUES
    ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', 'text', 2, '{"front": "What is the purpose of CPT codes?", "back": "To describe medical, surgical, and diagnostic services and procedures."}'::json, NOW())
ON CONFLICT (id) DO NOTHING;


-- 9. Student Concept Mastery
-- FIX: check constraint (mastery_level <= 1.0)
-- 2.8 -> 0.9 (High mastery)
INSERT INTO public.student_concept_mastery (student_id, concept_id, mastery_level, streak_count, last_practiced_at, next_review_date, created_at, updated_at)
VALUES
    ('95595c17-d5dd-4449-96d6-1699977f27c3', 'a0000000-0000-0000-0000-000000000004', 0.9, 3, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', NOW(), NOW())
ON CONFLICT (student_id, concept_id) DO UPDATE
SET streak_count = 3, next_review_date = NOW() + INTERVAL '5 days', mastery_level = 0.9;

-- FIX: check constraint (mastery_level <= 1.0)
-- 2.5 -> 0.7 (Medium mastery)
INSERT INTO public.student_concept_mastery (student_id, concept_id, mastery_level, streak_count, last_practiced_at, next_review_date, created_at, updated_at)
VALUES
    ('95595c17-d5dd-4449-96d6-1699977f27c3', 'a0000000-0000-0000-0000-000000000005', 0.7, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour', NOW(), NOW())
ON CONFLICT (student_id, concept_id) DO UPDATE
SET next_review_date = NOW() - INTERVAL '1 hour', mastery_level = 0.7;

COMMIT;
