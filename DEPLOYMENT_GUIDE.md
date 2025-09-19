# Edu-Sync ERP System - Deployment Guide

This guide provides step-by-step instructions for deploying the Edu-Sync ERP system to production.

## 🚀 Prerequisites

- Supabase account and project
- Vercel account
- GitHub repository (optional, for CI/CD)
- Domain name (optional)

## 📋 Pre-Deployment Checklist

### 1. Database Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Run Database Scripts**:
   Execute the SQL scripts in order in your Supabase SQL Editor:

   ```sql
   -- 1. Schema Creation
   -- Copy and paste contents of scripts/001_comprehensive_schema.sql
   
   -- 2. Security Policies
   -- Copy and paste contents of scripts/002_comprehensive_rls.sql
   
   -- 3. Sample Data
   -- Copy and paste contents of scripts/003_comprehensive_seeding.sql
   
   -- 4. Test Users (Optional)
   -- Copy and paste contents of scripts/004_create_test_users.sql
   ```

3. **Create Test Users**:
   ```bash
   # Set environment variables
   export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   
   # Run the script
   node scripts/create_test_users.js
   ```

### 2. Storage Setup

1. **Create Storage Buckets**:
   In your Supabase dashboard, go to Storage and create these buckets:
   - `student-documents` (for student document uploads)
   - `profile-images` (for user profile pictures)

2. **Set Bucket Policies**:
   ```sql
   -- Allow authenticated users to upload to student-documents
   CREATE POLICY "Users can upload documents" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'student-documents' AND auth.role() = 'authenticated');
   
   -- Allow users to view their own documents
   CREATE POLICY "Users can view own documents" ON storage.objects
   FOR SELECT USING (bucket_id = 'student-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository or upload code

#### Step 2: Configure Environment Variables
In your Vercel project settings, add these environment variables:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional
NEXT_PUBLIC_APP_NAME=Edu-Sync ERP System
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.vercel.app/auth/setup-password
```

#### Step 3: Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for deployment to complete
3. Your app will be available at `https://your-project.vercel.app`

#### Step 4: Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Option 2: Manual Deployment

#### Step 1: Build the Application
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

#### Step 2: Configure Web Server
For production deployment, use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Settings

1. **Configure Auth Settings**:
   - Go to Authentication → Settings
   - Add your production domain to "Site URL"
   - Add redirect URLs for your domain

2. **Update RLS Policies**:
   Ensure all policies are working correctly in production.

### 2. SSL Certificate

If using a custom domain, ensure SSL is configured:
- Vercel automatically provides SSL
- For manual deployment, use Let's Encrypt or your SSL provider

### 3. Performance Optimization

1. **Enable Caching**:
   ```javascript
   // In next.config.mjs
   const nextConfig = {
     images: {
       domains: ['your-supabase-project.supabase.co'],
     },
     experimental: {
       optimizeCss: true,
     },
   }
   ```

2. **Database Indexing**:
   Ensure proper indexes are created for performance.

## 🔍 Testing Deployment

### 1. Functional Testing

Test all major features:
- [ ] User authentication (login/logout)
- [ ] Student dashboard
- [ ] Faculty attendance marking
- [ ] Document uploads
- [ ] Announcements
- [ ] Role-based access control

### 2. Performance Testing

- [ ] Page load times
- [ ] Database query performance
- [ ] File upload functionality
- [ ] Mobile responsiveness

### 3. Security Testing

- [ ] RLS policies working
- [ ] Unauthorized access blocked
- [ ] File upload security
- [ ] API endpoint protection

## 📊 Monitoring and Maintenance

### 1. Set Up Monitoring

1. **Vercel Analytics**:
   - Enable in Vercel dashboard
   - Monitor performance metrics

2. **Supabase Monitoring**:
   - Monitor database performance
   - Set up alerts for errors

3. **Error Tracking**:
   Consider integrating Sentry or similar service.

### 2. Regular Maintenance

1. **Database Maintenance**:
   - Regular backups
   - Performance monitoring
   - Index optimization

2. **Application Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Regular testing

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check Supabase URL and keys
   - Verify redirect URLs
   - Check RLS policies

2. **File Upload Issues**:
   - Verify storage bucket policies
   - Check file size limits
   - Ensure proper CORS settings

3. **Database Connection Issues**:
   - Verify connection string
   - Check network connectivity
   - Review RLS policies

### Debug Mode

Enable debug logging in development:
```env
NEXT_PUBLIC_DEBUG=true
```

## 📈 Scaling Considerations

### 1. Database Scaling

- Monitor query performance
- Add indexes as needed
- Consider read replicas for heavy read workloads

### 2. Application Scaling

- Use Vercel's automatic scaling
- Consider edge functions for global performance
- Implement caching strategies

### 3. Storage Scaling

- Monitor storage usage
- Implement file cleanup policies
- Consider CDN for static assets

## 🔐 Security Best Practices

1. **Environment Variables**:
   - Never commit secrets to version control
   - Use different keys for different environments
   - Rotate keys regularly

2. **Database Security**:
   - Regular security audits
   - Keep RLS policies updated
   - Monitor for suspicious activity

3. **Application Security**:
   - Keep dependencies updated
   - Implement rate limiting
   - Use HTTPS everywhere

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review Supabase and Vercel documentation
3. Create an issue in the repository
4. Contact support if needed

---

**Deployment Complete!** 🎉

Your Edu-Sync ERP system should now be running in production. Remember to:
- Monitor performance regularly
- Keep the system updated
- Backup data regularly
- Test new features before deploying
