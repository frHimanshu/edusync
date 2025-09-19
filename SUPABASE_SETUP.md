# Supabase Setup Guide

This guide will help you set up a complete Supabase project for the Student Management System.

## Prerequisites

- Supabase account (sign up at [supabase.com](https://supabase.com))
- Basic knowledge of SQL and database concepts

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `student-management-system`
   - **Database Password**: Generate a strong password (save it securely)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Configure Project Settings

1. Go to **Settings** > **API**
2. Copy the following values (you'll need them for your environment variables):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option B: Using Supabase Dashboard

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`
3. Run each script by clicking "Run"

## Step 4: Configure Authentication

1. Go to **Authentication** > **Settings**
2. Configure the following settings:

### Site URL
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: Add the following:
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback` (for production)

### Email Settings
- **Enable email confirmations**: Disable for development
- **Enable email change confirmations**: Disable for development

### Provider Settings
- **Enable email provider**: Enable
- **Enable phone provider**: Disable (optional)

## Step 5: Set Up Storage (Optional)

1. Go to **Storage**
2. Create a new bucket called `documents`
3. Configure the bucket:
   - **Public bucket**: No
   - **File size limit**: 10MB
   - **Allowed MIME types**: `application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Step 6: Configure Row Level Security

The RLS policies are already included in the migration files, but you can verify them:

1. Go to **Authentication** > **Policies**
2. Ensure all tables have RLS enabled
3. Verify that the policies are correctly applied

## Step 7: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Demo Mode (set to false for production)
NEXT_PUBLIC_DEMO_MODE=false

# Application Configuration
NEXT_PUBLIC_APP_NAME=Student Management System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Step 8: Create Initial Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Create an admin user:
   - **Email**: `admin@yourdomain.com`
   - **Password**: Generate a strong password
   - **Auto Confirm User**: Yes

4. Go to **SQL Editor** and run:
   ```sql
   UPDATE public.users 
   SET role = 'admin', 
       first_name = 'Admin', 
       last_name = 'User',
       is_first_login = false
   WHERE email = 'admin@yourdomain.com';
   ```

## Step 9: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Try logging in with your admin credentials
4. Verify that you can access the admin dashboard

## Step 10: Production Deployment

### For Vercel Deployment:

1. Go to your Vercel project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEMO_MODE=false`

3. Update your Supabase project settings:
   - **Site URL**: `https://your-vercel-app.vercel.app`
   - **Redirect URLs**: `https://your-vercel-app.vercel.app/auth/callback`

### For GitHub Pages (Demo Mode):

1. Set `NEXT_PUBLIC_DEMO_MODE=true`
2. No Supabase configuration needed

## Database Schema Overview

The database includes the following main entities:

### Core Tables
- **users**: User profiles and authentication
- **departments**: Academic departments
- **students**: Student records
- **faculty**: Faculty records
- **courses**: Course catalog

### Academic Tables
- **course_assignments**: Faculty to course assignments
- **student_enrollments**: Student course enrollments
- **attendance**: Attendance records

### Administrative Tables
- **documents**: Document management
- **wallet_transactions**: Financial transactions
- **announcements**: System announcements

### Library Tables
- **books**: Book catalog
- **book_issuances**: Book lending records

### Hostel Tables
- **rooms**: Room inventory
- **room_allocations**: Student room assignments
- **maintenance_requests**: Maintenance tracking

### T&P Tables
- **companies**: Company information
- **placement_drives**: Placement events
- **student_placements**: Placement records

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access data they're authorized to see
- Role-based access control implemented

### Authentication
- Supabase Auth integration
- Email/password authentication
- Session management
- Password reset functionality

### Data Validation
- Database constraints
- Type safety with custom types
- Foreign key relationships

## Troubleshooting

### Common Issues

1. **RLS Policies Not Working**
   - Check if RLS is enabled on tables
   - Verify policy conditions
   - Test with different user roles

2. **Authentication Issues**
   - Check Site URL and Redirect URLs
   - Verify environment variables
   - Check browser console for errors

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Verify project status

4. **Migration Errors**
   - Check SQL syntax
   - Verify table dependencies
   - Run migrations in correct order

### Getting Help

- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Join Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Check project logs in Supabase dashboard

## Maintenance

### Regular Tasks
- Monitor database performance
- Review and update RLS policies
- Backup database regularly
- Update Supabase dependencies

### Scaling Considerations
- Monitor connection limits
- Consider read replicas for high traffic
- Implement caching strategies
- Optimize queries and indexes

## Backup and Recovery

### Automated Backups
- Supabase provides automated daily backups
- Backups are retained for 7 days (Pro plan: 30 days)

### Manual Backups
```bash
# Using Supabase CLI
supabase db dump --file backup.sql
```

### Restore from Backup
```bash
# Using Supabase CLI
supabase db reset --file backup.sql
```
