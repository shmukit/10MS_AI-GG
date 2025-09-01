# Deployment Guide for 10MS SheSTEM

## Overview
This guide explains how to deploy the 10MS SheSTEM application to a specific sub-domain and fix all the identified issues.

## Issues Fixed

### 1. ✅ Sub-domain Configuration
- Updated `vite.config.ts` to support sub-domain configuration
- Created `src/config/environment.ts` for environment-specific settings
- Added `deployment.config.js` for deployment configuration

### 2. ✅ Fixed Duplicate "Student" Text in Navigation
- Removed duplicate "Student" text from the top navigation bar
- Cleaned up the ProfileDropdown component usage

### 3. ✅ Fixed Profile CTA and Weekly Streaks UI
- Updated weekly streaks to use real data instead of dummy data
- Improved streak calculation based on actual progress
- Added fallback UI for when data is not available

### 4. ✅ Fixed Weekly Streaks Dummy Data
- Implemented proper streak calculation based on database progress
- Added completion percentage display for incomplete weeks
- Integrated with actual student progress data

### 5. ✅ Fixed Roadmap Page Error
- Improved error handling in database service
- Added automatic student profile creation if none exists
- Implemented automatic batch assignment for new students
- Added comprehensive logging for debugging

### 6. ✅ Fixed Community Page and Batch Assignment
- Added `getStudentsByBatch` function to database service
- Improved error handling and user feedback
- Implemented automatic batch assignment logic

## Environment Setup

### Required Environment Variables
Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Sub-domain Configuration
VITE_SUBDOMAIN=shestem

# App Configuration
VITE_APP_NAME="10MS SheSTEM"
VITE_APP_VERSION="1.0.0"
```

### Supabase Project Setup
1. Go to your Supabase dashboard
2. Copy the project URL and anon key
3. Ensure the following tables exist:
   - `users`
   - `student_profiles`
   - `batches`
   - `roadmaps`
   - `roadmap_weeks`
   - `roadmap_tasks`
   - `student_progress`
   - `notices`
   - `mentor_profiles`

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Copy `.env.example` to `.env` and fill in your values.

### 3. Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Sub-domain
The application is configured to work with the sub-domain `roadmaps.10minuteschool.com`

### 3. Server Configuration
Ensure your server is configured to:
- Handle React Router (SPA) routing
- Serve static files from the `dist` directory
- Support HTTPS for production

## Database Schema Requirements

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('student', 'mentor', 'admin')),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Student Profiles Table
```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  institute VARCHAR,
  year VARCHAR,
  subject VARCHAR,
  degree VARCHAR,
  batch_id UUID REFERENCES batches(id),
  completed_weeks INTEGER DEFAULT 0,
  progress_percentage NUMERIC DEFAULT 0,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Batches Table
```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  roadmap_id UUID REFERENCES roadmaps(id),
  mentor_id UUID REFERENCES users(id),
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing the Fixes

### 1. Test User Registration
- Register a new user with email `mukit@10minuteschool.com`
- Verify the user is automatically assigned a student profile
- Check that the user is assigned to an available batch

### 2. Test Dashboard
- Login and verify no duplicate "Student" text in navigation
- Check that weekly streaks show real data instead of dummy data
- Verify profile CTA works correctly

### 3. Test Roadmap
- Navigate to `/student/roadmap`
- Verify no "No roadmap found" error
- Check that roadmap data loads correctly

### 4. Test Community
- Navigate to `/student/community`
- Verify batch assignment works
- Check that students and mentors are displayed

## Troubleshooting

### Common Issues

1. **"No roadmap found" Error**
   - Check if user has a student profile
   - Verify batch assignment
   - Check roadmap data in database

2. **Weekly Streaks Not Loading**
   - Verify student progress data exists
   - Check roadmap configuration
   - Review console logs for errors

3. **Batch Assignment Issues**
   - Check if batches exist in database
   - Verify batch status is 'active'
   - Check current_students vs max_students

4. **Database Connection Issues**
   - Verify Supabase environment variables
   - Check network connectivity
   - Review Supabase dashboard for errors

### Debug Mode
Enable debug mode by setting `VITE_DEBUG=true` in your `.env` file. This will show detailed console logs for troubleshooting.

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Verify environment variable configuration
4. Check database table structure and data

## Next Steps

1. **Performance Optimization**
   - Implement data caching
   - Add pagination for large datasets
   - Optimize database queries

2. **Feature Enhancements**
   - Add real-time notifications
   - Implement file uploads
   - Add analytics dashboard

3. **Security Improvements**
   - Implement rate limiting
   - Add input validation
   - Set up proper CORS policies
