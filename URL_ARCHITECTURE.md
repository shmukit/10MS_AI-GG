# URL Architecture for 10MS SheSTEM Project

## Base URL Structure
```
https://shestem.10minuteschool.com/  (Production)
http://localhost:5173/               (Local Development)
```

## Public Routes (No Authentication Required)

### Landing & Authentication
- `/` - Landing page / Home
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset
- `/verify-email` - Email verification

## Protected Routes (Authentication Required)

### Student Routes
- `/student/dashboard` - Student main dashboard
- `/student/roadmap` - Learning roadmap view
- `/student/roadmap/:roadmapSlug` - Specific roadmap (slug-based)
- `/student/profile` - Student profile (with inline edit)
- `/student/community` - Community page (serves as batch page)

### Mentor Routes (Tab-based Dashboard)
- `/mentor/dashboard` - Mentor main dashboard with tabs:
  - Dashboard overview
  - Roadmap management (create/edit roadmaps, add weeks/tasks)
  - Students & batches management
  - Notice management
- `/mentor/profile` - Mentor profile (with inline edit)



## External Community
- **WhatsApp Groups** - Batch-specific discussions
- **Discord Server** - Platform-wide community
- **Emergency Contact** - Direct mentor communication

## API Routes
```
/api/v1/
├── auth/
│   ├── login
│   ├── signup
│   ├── logout
│   ├── refresh
│   └── verify
├── users/
│   ├── profile
│   ├── update
│   └── delete
├── roadmaps/
│   ├── list
│   ├── create
│   ├── update
│   └── delete
├── batches/
│   ├── list
│   ├── create
│   ├── update
│   └── delete
├── tasks/
│   ├── list
│   ├── create
│   ├── update
│   └── delete
├── progress/
│   ├── track
│   ├── update
│   └── analytics
├── notices/
│   ├── list
│   ├── create
│   ├── update
│   └── delete

```

## URL Parameters

### Dynamic Segments
- `:userId` - User identifier
- `:roadmapSlug` - Roadmap slug (e.g., 'python-basics', 'data-structures')
- `:batchId` - Batch identifier
- `:taskId` - Task identifier
- `:noticeId` - Notice identifier

### Query Parameters
- `?page=1` - Pagination
- `?limit=20` - Results limit
- `?search=python` - Search term
- `?filter=active` - Filter by status
- `?sort=created_at` - Sort by field
- `?order=desc` - Sort order
- `?tag=beginner` - Filter by tag
- `?status=completed` - Filter by completion status

## Route Guards & Permissions

### Student Access
- Can access: `/student/*`, `/profile`
- Cannot access: `/mentor/*`

### Mentor Access (Admin Functions)
- Can access: `/mentor/*`, `/profile`
- Full access to all student data and system management
- Can create/edit roadmaps, batches, and notices

## Breadcrumb Structure
```
Home > Student Dashboard > Roadmap > Python Basics
Home > Mentor Dashboard > Roadmap Management
Home > Mentor Dashboard > Students & Batches
```

## SEO-Friendly URLs
- Use descriptive, readable URLs
- Include relevant keywords
- Keep URLs short and meaningful
- Use hyphens for word separation
- Avoid special characters

## Example URLs
```
https://shestem.10minuteschool.com/student/roadmap/python-basics
https://shestem.10minuteschool.com/mentor/dashboard
https://shestem.10minuteschool.com/student/community
https://shestem.10minuteschool.com/student/profile
```

## Local Development URLs
```
http://localhost:5173/student/dashboard
http://localhost:5173/mentor/roadmap
http://localhost:5173/student/batch
```

## Production Deployment Notes
- All routes should be accessible via direct URL
- Implement proper 404 handling for invalid routes
- Use React Router for client-side routing
- Consider implementing server-side rendering for SEO
- Set up proper redirects for old URLs if migrating
