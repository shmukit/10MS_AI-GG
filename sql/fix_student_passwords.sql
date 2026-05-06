-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Correctly update all student passwords to a valid bcrypt hash of "NeverStopLearning!"
UPDATE users 
SET 
  password_hash = crypt('NeverStopLearning!', gen_salt('bf')),
  updated_at = NOW()
WHERE role = 'student';

-- Verify the update for specific reported users
SELECT email, password_hash, role 
FROM users 
WHERE email IN (
  'tasniaahmedchowdhury@gmail.com', 
  'israislamdua@gmail.com',
  'humayra1393@gmail.com'
);
