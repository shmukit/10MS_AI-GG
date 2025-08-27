# SQL Scripts for 10MS SheSTEM Project

This folder contains all SQL scripts needed to set up the Revenue Cycle Management Specialist roadmap and related database structures.

## 📋 Execution Order

### 1. Database Setup (if not already done)
```bash
# Run these first to set up the database structure
create_tables.sql          # Creates all database tables
add_test_users.sql         # Adds test users (including Uttam Deb)
hash_password.sql          # Hash passwords for test users
create_mentor_profile.sql  # Creates mentor profile for Uttam Deb
```

### 2. Roadmap Creation
```bash
# Create the main roadmap
create_roadmap.sql         # Creates the Revenue Cycle Management Specialist roadmap
```

### 3. Week Structure
```bash
# Create weeks and tasks in order
create_week1.sql           # Creates Week 1 structure
create_week1_tasks.sql     # Creates all Week 1 tasks (7 tasks)
create_week2.sql           # Creates Week 2 and tasks (5 tasks)
create_week3.sql           # Creates Week 3 and tasks (7 tasks)
create_week4.sql           # Creates Week 4 and tasks (6 tasks)
create_week5.sql           # Creates Week 5 and tasks (4 tasks)
create_week6.sql           # Creates Week 6 and tasks (5 tasks)
```

### 4. Batch and Student Assignment
```bash
# Set up the learning batch
create_batch.sql           # Creates batch and assigns Uttam Deb as mentor
assign_student.sql         # Assigns Mukit to the batch
```

### 5. Content and Notices
```bash
# Add sample content
create_notices.sql         # Creates sample notices for the batch
```

### 6. Verification
```bash
# Verify everything is set up correctly
verify_setup.sql           # Comprehensive verification of all components
verify_mentor_assignment.sql # Specific verification of mentor assignment
```

## 🎯 Quick Setup Command

To run all scripts in the correct order:

```bash
# Navigate to sql_scripts folder
cd sql_scripts

# Run the complete setup (adjust paths as needed)
psql -h your_host -U your_user -d your_database -f create_tables.sql
psql -h your_host -U your_user -d your_database -f add_test_users.sql
psql -h your_host -U your_user -d your_database -f hash_password.sql
psql -h your_host -U your_user -d your_database -f create_mentor_profile.sql
psql -h your_host -U your_user -d your_database -f create_roadmap.sql
psql -h your_host -U your_user -d your_database -f create_week1.sql
psql -h your_host -U your_user -d your_database -f create_week1_tasks.sql
psql -h your_host -U your_user -d your_database -f create_week2.sql
psql -h your_host -U your_user -d your_database -f create_week3.sql
psql -h your_host -U your_user -d your_database -f create_week4.sql
psql -h your_host -U your_user -d your_database -f create_week5.sql
psql -h your_host -U your_user -d your_database -f create_week6.sql
psql -h your_host -U your_user -d your_database -f create_batch.sql
psql -h your_host -U your_user -d your_database -f assign_student.sql
psql -h your_host -U your_user -d your_database -f create_notices.sql
psql -h your_host -U your_user -d your_database -f verify_setup.sql
```

## 📊 Expected Results

After running all scripts, you should have:
- ✅ 1 roadmap with 6 weeks
- ✅ 34 tasks across all weeks
- ✅ 1 active batch with Uttam Deb as mentor
- ✅ 1 student (Mukit) enrolled in the batch
- ✅ Sample notices and content
- ✅ Total of 585 points and 75 estimated hours

## 🔧 Troubleshooting

- **Type errors:** Ensure all empty arrays use `ARRAY[]::text[]`
- **Constraint errors:** Check that task types are valid (`watch`, `read`, `project`, `attend`, `mcq`, `written`)
- **Reference errors:** Ensure scripts are run in the correct order
- **Permission errors:** Verify database user has appropriate privileges

## 📁 File Structure

```
sql_scripts/
├── README.md                    # This file
├── create_tables.sql            # Database schema
├── add_test_users.sql           # Test user creation
├── hash_password.sql            # Password hashing
├── create_mentor_profile.sql    # Mentor profile setup
├── create_roadmap.sql           # Main roadmap creation
├── create_week1.sql             # Week 1 structure
├── create_week1_tasks.sql       # Week 1 tasks
├── create_week2.sql             # Week 2 and tasks
├── create_week3.sql             # Week 3 and tasks
├── create_week4.sql             # Week 4 and tasks
├── create_week5.sql             # Week 5 and tasks
├── create_week6.sql             # Week 6 and tasks
├── create_batch.sql             # Batch creation
├── assign_student.sql           # Student assignment
├── create_notices.sql           # Sample notices
├── verify_setup.sql             # Complete verification
└── verify_mentor_assignment.sql # Mentor verification
```
