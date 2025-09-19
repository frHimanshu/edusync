# Supabase Project Replication Guide

This guide provides comprehensive instructions for replicating your Edu-Sync ERP system from one Supabase project to another, preserving all data, schema, policies, and configurations.

## 🎯 Overview

The replication process will:
- Export schema, data, and storage metadata from source project
- Import everything to target project
- Validate the replication
- Provide step-by-step instructions for completion

## 📋 Prerequisites

### Required Environment Variables

Set these environment variables before running the replication:

```bash
# Source Project (where you're copying FROM)
export SUPABASE_URL_SOURCE="https://your-source-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY_SOURCE="your_source_service_role_key"

# Target Project (where you're copying TO)
export SUPABASE_URL_TARGET="https://your-target-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY_TARGET="your_target_service_role_key"

# Optional: Direct database URLs (if you prefer pg_dump/pg_restore)
export SUPABASE_DB_URL_SOURCE="postgresql://postgres:[password]@db.your-source-project.supabase.co:5432/postgres"
export SUPABASE_DB_URL_TARGET="postgresql://postgres:[password]@db.your-target-project.supabase.co:5432/postgres"
```

### Required Tools

- Node.js 18+
- npm or pnpm
- Access to both Supabase projects
- Supabase CLI (optional, for advanced operations)

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)

#### For Windows:
```cmd
# Set environment variables
set SUPABASE_URL_SOURCE=https://your-source-project.supabase.co
set SUPABASE_SERVICE_ROLE_KEY_SOURCE=your_source_service_role_key
set SUPABASE_URL_TARGET=https://your-target-project.supabase.co
set SUPABASE_SERVICE_ROLE_KEY_TARGET=your_target_service_role_key

# Run the replication script
scripts\run-replication.bat
```

#### For Linux/Mac:
```bash
# Set environment variables
export SUPABASE_URL_SOURCE="https://your-source-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY_SOURCE="your_source_service_role_key"
export SUPABASE_URL_TARGET="https://your-target-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY_TARGET="your_target_service_role_key"

# Make script executable and run
chmod +x scripts/run-replication.sh
./scripts/run-replication.sh
```

### Option 2: Manual Process

1. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Set up inventory functions**:
   - Copy the contents of `scripts/inventory-functions.sql`
   - Run it in both source and target Supabase projects

3. **Run replication**:
   ```bash
   node scripts/supabase-replication.js
   ```

## 📊 What Gets Replicated

### ✅ Included
- **Database Schema**: All tables, views, functions, triggers
- **Data**: All records from public schema tables
- **Row Level Security**: All RLS policies
- **Storage Metadata**: Bucket configurations and object listings
- **Extensions**: List of installed extensions
- **Indexes**: Database indexes and constraints

### ❌ Not Included (Manual Steps Required)
- **Storage Objects**: Actual files need to be uploaded manually
- **Edge Functions**: Need to be deployed separately
- **Secrets**: Environment variables need to be set manually
- **Auth Users**: Need to be created via Supabase Auth API
- **Custom Domains**: Need to be configured separately

## 🔧 Detailed Process

### Step 1: Environment Setup

1. **Create Target Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down the URL and service role key

2. **Set Environment Variables**:
   ```bash
   # Windows
   set SUPABASE_URL_SOURCE=https://abc123.supabase.co
   set SUPABASE_SERVICE_ROLE_KEY_SOURCE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   set SUPABASE_URL_TARGET=https://def456.supabase.co
   set SUPABASE_SERVICE_ROLE_KEY_TARGET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Linux/Mac
   export SUPABASE_URL_SOURCE="https://abc123.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY_SOURCE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   export SUPABASE_URL_TARGET="https://def456.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY_TARGET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

### Step 2: Run Replication

Execute the replication script:
```bash
# Windows
scripts\run-replication.bat

# Linux/Mac
./scripts/run-replication.sh
```

The script will:
1. Validate environment variables
2. Create inventory functions in both projects
3. Export schema, data, and storage metadata
4. Import everything to target project
5. Validate the replication

### Step 3: Complete Manual Steps

After the script completes, you need to:

1. **Run SQL Scripts** in target project:
   ```sql
   -- Run these in order in your TARGET project SQL Editor
   -- 1. Schema creation
   -- Copy contents of scripts/001_comprehensive_schema.sql
   
   -- 2. RLS policies
   -- Copy contents of scripts/002_comprehensive_rls.sql
   
   -- 3. Sample data
   -- Copy contents of scripts/003_comprehensive_seeding.sql
   ```

2. **Create Test Users**:
   ```bash
   # Update environment variables to point to target project
   export NEXT_PUBLIC_SUPABASE_URL="https://your-target-project.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your_target_service_role_key"
   
   # Create test users
   node scripts/create_test_users.js
   ```

3. **Upload Storage Objects** (if needed):
   - Go to Storage in target project
   - Create buckets: `student-documents`, `profile-images`
   - Upload files manually or use Supabase CLI

4. **Update Application**:
   - Update environment variables in your app
   - Deploy to production
   - Test all functionality

## 🔍 Validation

The replication script includes validation that checks:
- Table counts match between source and target
- Data counts match for key tables
- Storage buckets are created
- Basic connectivity to both projects

### Manual Validation Checklist

After replication, verify:

- [ ] All tables exist in target project
- [ ] Data counts match source project
- [ ] RLS policies are active
- [ ] Test users can log in
- [ ] File uploads work
- [ ] All features function correctly

## 🚨 Troubleshooting

### Common Issues

1. **Permission Errors**:
   - Ensure service role keys have full access
   - Check that RLS policies allow service role operations

2. **Missing Tables**:
   - Run the SQL scripts manually in target project
   - Check for any SQL errors in the scripts

3. **Data Import Failures**:
   - Check for foreign key constraints
   - Verify data types match between projects
   - Look for duplicate key violations

4. **Storage Issues**:
   - Create buckets manually in target project
   - Set proper bucket policies
   - Upload files individually if needed

### Debug Mode

Enable debug logging:
```bash
export DEBUG=true
node scripts/supabase-replication.js
```

## 📈 Performance Considerations

### Large Projects

For projects with large amounts of data:

1. **Batch Processing**:
   - The script processes data in batches
   - Monitor memory usage during large imports

2. **Storage Objects**:
   - Large files may need to be uploaded separately
   - Consider using Supabase CLI for bulk uploads

3. **Database Performance**:
   - Import during off-peak hours
   - Monitor database CPU and memory usage

## 🔐 Security Notes

### Important Security Considerations

1. **Service Role Keys**:
   - Never commit service role keys to version control
   - Use environment variables only
   - Rotate keys after replication

2. **Data Privacy**:
   - Ensure target project has appropriate access controls
   - Verify RLS policies are correctly applied
   - Test with different user roles

3. **Network Security**:
   - Use HTTPS for all connections
   - Verify SSL certificates
   - Consider VPN for sensitive data

## 📞 Support

If you encounter issues:

1. **Check Logs**: Review the console output for specific errors
2. **Validate Setup**: Ensure all prerequisites are met
3. **Test Connectivity**: Verify both projects are accessible
4. **Review Documentation**: Check Supabase documentation for specific errors
5. **Create Issue**: Open an issue in the repository with error details

## 🎉 Success!

Once replication is complete:

1. ✅ Your target project has all the schema and data
2. ✅ RLS policies are properly configured
3. ✅ Test users are created and functional
4. ✅ Your application can connect to the new project
5. ✅ All features work as expected

You can now:
- Update your application to use the new project
- Deploy to production
- Decommission the old project (if desired)
- Continue development with the new setup

---

**Replication Complete!** 🚀

Your Edu-Sync ERP system has been successfully replicated to the new Supabase project.
