-- SQL Script to Add Private University Admission Program Roadmap
-- This script adds the 4-week roadmap with all tasks for the Private University Admission Program

-- First, insert the roadmap weeks
INSERT INTO roadmap_weeks (roadmap_id, week_number, title, description, domain) VALUES
-- Week 1: English & Mathematics Foundation
('fde72f6d-5ee0-4f59-ae8e-7ddd08188099', 1, 'English & Mathematics Foundation', 'Foundation building in English grammar, vocabulary, reading comprehension, and core mathematics topics including arithmetic, algebra, geometry, and trigonometry.', 'Foundation Studies'),

-- Week 2: Science & Advanced Mathematics
('fde72f6d-5ee0-4f59-ae8e-7ddd08188099', 2, 'Science & Advanced Mathematics', 'Comprehensive coverage of Physics, Chemistry, Biology, and Higher Mathematics with problem-solving sessions and mock tests.', 'Science & Mathematics'),

-- Week 3: Specialized Tracks & Assessment
('fde72f6d-5ee0-4f59-ae8e-7ddd08188099', 3, 'Specialized Tracks & Assessment', 'Specialized preparation for different university tracks including Business, Architecture, Environmental Science, and comprehensive mock assessments.', 'Specialized Tracks'),

-- Week 4: Final Revision & Assessment
('fde72f6d-5ee0-4f59-ae8e-7ddd08188099', 4, 'Final Revision & Assessment', 'Final revision sessions across all subjects and comprehensive university-style assessment to prepare students for admission tests.', 'Final Preparation');

-- Now insert all the tasks for each week
-- Week 1 Tasks
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, deadline, estimated_hours, points) VALUES
-- Week 1 - Day 1
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Initialization/Orientation Session', 
 'Kick-off: mentor-mentee introduction, program overview, goal-setting, resource walkthrough, soft skill icebreaker', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-01', 
 90, 
 15),

-- Week 1 - Day 2
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Grammar Basics', 
 'Tenses & sentence structure, sentence correction exercises', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=sCiG6rlk2Bc'], 
 '2025-10-02', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Vocabulary Building', 
 'Synonyms, antonyms, word usage, word choice practice', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=jj7Z-QZoiuQ'], 
 '2025-10-02', 
 60, 
 10),

-- Week 1 - Day 3
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Grammar Drill & Practice', 
 'Interactive grammar exercises and error correction', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-03', 
 90, 
 15),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Reading Comprehension', 
 'Skimming, scanning, inference, passage-based questions', 
 'read', 
 ARRAY['https://www.youtube.com/watch?v=M6ZvUdGVOXI'], 
 '2025-10-03', 
 60, 
 10),

-- Week 1 - Day 4
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Essay Writing Skills', 
 'Essay structure, introduction/conclusion, current topics', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=nUq2SG3ZuyQ'], 
 '2025-10-04', 
 60, 
 10),

-- Week 1 - Day 5
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'English Mock Test + Feedback', 
 'Test on grammar, vocabulary, comprehension, essay', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-05', 
 90, 
 20),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Mathematics: Arithmetic', 
 'Ratio, percentage, profit & loss, average, simple interest', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=x-k8iSNr85g&list=PLG4bwc5fquziYryWxgLxAUBEXI4CgL4lm'], 
 '2025-10-05', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Mathematics: Algebra', 
 'Linear & quadratic equations, inequalities, factorization', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=BlhUiV10ZCQ'], 
 '2025-10-05', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Mathematics: Geometry & Mensuration', 
 'Triangles, circles, polygons, volume & surface area', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=0FPCoUiJDGE'], 
 '2025-10-05', 
 60, 
 10),

-- Week 1 - Day 6
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Math Problem Solving Drill', 
 'Mixed topics with timed exercises', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-06', 
 90, 
 15),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Trigonometry Essentials', 
 'Sine, cosine, tangent, Pythagoras theorem', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=WFH_7n7hpHo&t=97s'], 
 '2025-10-07', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 1), 
 'Data Interpretation & Reasoning', 
 'Tables, charts, graphs, logical reasoning questions', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=ckESGMbio9M&list=PLlxE9WKuvDj-EpQRRmi209Ht3RrDKtIa8'], 
 '2025-10-07', 
 60, 
 10);

-- Week 2 Tasks
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, deadline, estimated_hours, points) VALUES
-- Week 2 - Day 1
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Quantitative Mock Test + Discussion', 
 'Full-length test and review', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-08', 
 90, 
 20),

-- Week 2 - Day 2
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Physics: Mechanics & Motion', 
 'Newton''s laws, work-energy, kinematics, force, motion', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=zVRH9d5PW8g'], 
 '2025-10-09', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Physics: Electricity & Magnetism', 
 'Ohm''s law, circuits, fields, EM basics', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=HsLLq6Rm5tU'], 
 '2025-10-09', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Physics: Optics & Waves', 
 'Reflection, refraction, lenses, sound waves', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=UUc44Vg5pCI'], 
 '2025-10-09', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Physics: Modern Physics', 
 'Photoelectric effect, atomic structure, nuclear basics', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=H-FyOpURPXI'], 
 '2025-10-09', 
 60, 
 10),

-- Week 2 - Day 3
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Physics Problem Solving', 
 'Interactive Q&A, past exam questions', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-10', 
 90, 
 15),

-- Week 2 - Day 4
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Higher Mathematics', 
 'Calculus basics, matrices, determinants, complex numbers', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=Yddjxj49C_M'], 
 '2025-10-11', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Chemistry: Physical Chemistry', 
 'Atomic structure, chemical bonding, thermodynamics', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=DhIQw0n4HAI&list=PL65T2neerQz9CQFHuwH7sNci6BrB683EE'], 
 '2025-10-11', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Chemistry: Organic Chemistry Basics', 
 'Hydrocarbons, functional groups, reaction types', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=m9jM8lWxrAE'], 
 '2025-10-11', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Chemistry: Inorganic Chemistry', 
 'Periodic table, metals, non-metals, coordination compounds', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=r4H5XjJPn58&t=403s'], 
 '2025-10-11', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Chemistry: Applied Chemistry', 
 'Lab applications, pharmaceuticals, chemical analysis', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=zuUvQN8KXOk'], 
 '2025-10-11', 
 60, 
 10),

-- Week 2 - Day 5
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Chemistry Problem Solving', 
 'Q&A, example problems, past questions', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-12', 
 90, 
 15),

-- Week 2 - Day 6
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Biology: Cell Biology & Genetics', 
 'Cell structure, DNA, RNA, Mendelian genetics', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=8m6hHRlKwxY'], 
 '2025-10-13', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Biology: Human Physiology', 
 'Circulatory, respiratory, nervous systems', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=v_j-LD2YEqg&t=182s'], 
 '2025-10-13', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Biology: Biotechnology Basics', 
 'Genetic engineering, cloning, lab techniques', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=NoyeCMmP5tw'], 
 '2025-10-13', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Biology: Ecology & Evolution', 
 'Ecosystems, biodiversity, evolutionary principles', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=9dAcEBXAFoo'], 
 '2025-10-13', 
 60, 
 10),

-- Week 2 - Day 7
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 2), 
 'Biology Problem Solving', 
 'Interactive Q&A, sample test problems', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-14', 
 90, 
 15);

-- Week 3 Tasks
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, deadline, estimated_hours, points) VALUES
-- Week 3 - Day 1
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Business Workshop', 
 'Quantitative reasoning, essay writing, case practice', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-15', 
 90, 
 15),

-- Week 3 - Day 2
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Architecture Drawing Test', 
 'Perspective drawing, 2D/3D sketching, timed practice', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=BYlW8XC0MlI'], 
 '2025-10-16', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Environmental Science (IUB)', 
 'Mixed topics: Physics, Chemistry, Biology', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=Vm6oUktjGZY'], 
 '2025-10-16', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'English: Critical Reading & Essay Drills', 
 'Essay structure, comprehension strategies', 
 'watch', 
 ARRAY['https://www.youtube.com/watch?v=FGU5Tkh-Rvg'], 
 '2025-10-16', 
 60, 
 10),

-- Week 3 - Day 3
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Mixed Discipline Practice', 
 'Panel Q&A session for all tracks', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-17', 
 90, 
 15),

-- Week 3 - Day 4
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Mock Test 1', 
 'University pattern simulation (Core + Tracks)', 
 'written', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-18', 
 180, 
 25),

-- Week 3 - Day 5
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Mock Test Review', 
 'Detailed feedback, error correction, strategies', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-19', 
 90, 
 15),

-- Week 3 - Day 6
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Mock Test 2', 
 'University pattern simulation for all tracks', 
 'mcq', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-20', 
 180, 
 25),

-- Week 3 - Day 7
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 3), 
 'Final Revision & Tips', 
 'Last-minute strategies, time management, practice drills', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-21', 
 90, 
 15);

-- Week 4 Tasks
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, deadline, estimated_hours, points) VALUES
-- Week 4 - Day 1 (Revision Day)
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'English Revision', 
 'Grammar, vocabulary, essay practice', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Mathematics Revision', 
 'Arithmetic, algebra, geometry, timed exercises', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Science/Engineering Revision', 
 'Physics, higher math key formulae, problem-solving', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Chemistry Revision', 
 'Core concepts, applied examples', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Biology Revision', 
 'Diagrams, terminology, practice questions', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Business Revision', 
 'Quick problem-solving & writing practice', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Architecture Revision', 
 'Quick sketches, timed exercises, perspective drills', 
 'watch', 
 ARRAY['https://10minuteschool.com/admission/'], 
 '2025-10-25', 
 60, 
 10),

-- Week 4 - Day 2 (Final Assessment)
((SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099' AND week_number = 4), 
 'Final Assessment', 
 'Full-length university-style test for all tracks', 
 'attend', 
 ARRAY['https://us04web.zoom.us/j/2223965300?omn=71067932686'], 
 '2025-10-26', 
 90, 
 30);

-- Verification queries to check the data
SELECT 'Roadmap weeks created:' as status, COUNT(*) as count FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099';
SELECT 'Roadmap tasks created:' as status, COUNT(*) as count FROM roadmap_tasks WHERE week_id IN (SELECT id FROM roadmap_weeks WHERE roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099');

-- Show the complete roadmap structure
SELECT 
    rw.week_number,
    rw.title as week_title,
    rw.domain,
    rt.task_name,
    rt.task_type,
    rt.deadline,
    rt.estimated_hours,
    rt.points
FROM roadmap_weeks rw
LEFT JOIN roadmap_tasks rt ON rw.id = rt.week_id
WHERE rw.roadmap_id = 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099'
ORDER BY rw.week_number, rt.deadline;
