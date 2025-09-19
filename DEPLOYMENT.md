# Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository
- Supabase project (optional for demo mode)

### Environment Variables

Set the following environment variables in your Vercel project:

#### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEMO_MODE=false
```

#### Optional Variables
```
NEXT_PUBLIC_APP_NAME=Student Management System
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG=false
```

### Deployment Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at the provided URL

## GitHub Pages Deployment (Demo Mode)

### Prerequisites
- GitHub repository
- GitHub Actions enabled

### Environment Variables for Demo Mode
```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=Student Management System (Demo)
```

### Deployment Steps

1. **Enable GitHub Actions**
   - Go to repository Settings > Actions > General
   - Enable "Allow all actions and reusable workflows"

2. **Set Repository Secrets**
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `NEXT_PUBLIC_DEMO_MODE`: `true`
     - `NEXT_PUBLIC_APP_NAME`: `Student Management System (Demo)`

3. **Deploy**
   - Push to main branch
   - GitHub Actions will automatically deploy to GitHub Pages

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd sms112
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEMO_MODE=false
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Open [http://localhost:3000](http://localhost:3000)

## Demo Mode

When `NEXT_PUBLIC_DEMO_MODE=true`, the application runs without a database:

- All data is mocked
- Authentication is simulated
- No external dependencies required
- Perfect for demonstrations and testing

### Demo Credentials
```
Student: student@demo.com / password123
Faculty: faculty@demo.com / password123
HOD: hod@demo.com / password123
Accountant: accountant@demo.com / password123
Librarian: librarian@demo.com / password123
T&P: tnp@demo.com / password123
Hostel: hostel@demo.com / password123
```

## Production Considerations

### Security
- Use strong, unique secrets
- Enable HTTPS
- Set up proper CORS policies
- Implement rate limiting
- Regular security updates

### Performance
- Enable CDN
- Optimize images
- Use caching strategies
- Monitor performance metrics

### Monitoring
- Set up error tracking (Sentry)
- Monitor uptime
- Track user analytics
- Log important events

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no trailing spaces

3. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure RLS policies are configured

4. **Authentication Issues**
   - Check Supabase auth configuration
   - Verify redirect URLs
   - Check session handling

### Support
- Check application logs
- Review Vercel function logs
- Monitor Supabase logs
- Check browser console for errors
