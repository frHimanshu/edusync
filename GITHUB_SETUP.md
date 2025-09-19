# GitHub Repository Setup & Deployment Guide

## 🚀 Quick Start for GitHub Pages Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `edu-sync-erp` or any name you prefer
3. Make it public (required for GitHub Pages)
4. Initialize with README

### 2. Upload Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Edu-Sync ERP System"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main branch

### 4. Set Up Environment Variables (Optional)

For full functionality with Supabase:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### 5. Demo Mode (No Database Required)

The system works in **Demo Mode** without any database setup:

- ✅ All UI components work
- ✅ Navigation between pages
- ✅ Role-based routing
- ✅ Responsive design
- ❌ No data persistence
- ❌ No authentication

### 6. Full Setup with Supabase

To enable full functionality:

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL scripts in `scripts/` folder:
   - `001_comprehensive_schema.sql`
   - `002_comprehensive_rls.sql`
   - `003_comprehensive_seeding.sql`
3. Create test users with `scripts/create_test_users.js`
4. Update environment variables

## 📁 Repository Structure

```
edu-sync-erp/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── app/                        # Next.js 14 App Router
│   ├── demo/                   # Demo page (no database required)
│   ├── student/                # Student portal
│   ├── faculty/                # Faculty portal
│   ├── authority/              # Authority portals
│   └── auth/                   # Authentication pages
├── components/                 # Reusable UI components
├── lib/                        # Utilities and configurations
├── scripts/                    # Database setup scripts
├── public/                     # Static assets
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Export static files (for GitHub Pages)
npm run export
```

## 🌐 Deployment URLs

After deployment, your app will be available at:
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
- **Custom Domain**: Configure in repository settings

## 🎯 Features Available in Demo Mode

### Student Portal
- Dashboard overview
- Attendance tracking UI
- Wallet management UI
- Document management UI
- Announcements UI

### Faculty Portal
- Teaching dashboard
- Attendance marking UI
- Announcement creation UI
- Class management UI

### Authority Portals
- HOD dashboard
- Accountant portal
- Librarian portal
- T&P portal
- Hostel authority portal

## 🔐 Test Credentials (When Supabase is Configured)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Student | student1@edusync.edu | Student123! | First-time login |
| Student | student2@edusync.edu | Student123! | Regular student |
| Faculty | faculty1@edusync.edu | Faculty123! | CS Professor |
| HOD | hod.cse@edusync.edu | Hod123! | Head of CSE |
| Accountant | accountant@edusync.edu | Accountant123! | Financial mgmt |
| Librarian | librarian@edusync.edu | Librarian123! | Library mgmt |
| T&P | tnp@edusync.edu | Tnp123! | Placement officer |
| Hostel | hostel@edusync.edu | Hostel123! | Hostel authority |
| Admin | admin@edusync.edu | Admin123! | System admin |

## 🛠️ Customization

### Change App Name
Update in `next.config.mjs`:
```javascript
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_NAME: 'Your College ERP',
  }
}
```

### Change Colors/Theme
Modify `tailwind.config.ts` and CSS variables in `app/globals.css`

### Add New Features
- Create new pages in `app/` directory
- Add components in `components/` directory
- Update database schema in `scripts/`

## 📱 Mobile Responsive

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- Row Level Security (RLS) policies
- Role-based access control
- Secure authentication
- Protected routes
- Input validation
- XSS protection

## 📊 Analytics (Optional)

Add Google Analytics:
1. Get GA tracking ID
2. Add to environment variables
3. Update `app/layout.tsx`

## 🆘 Troubleshooting

### Build Errors
- Check Node.js version (18+ recommended)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Deployment Issues
- Verify GitHub Actions workflow
- Check environment variables
- Review build logs

### Database Issues
- Verify Supabase connection
- Check RLS policies
- Validate SQL scripts

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Create GitHub issue
4. Check Supabase dashboard

---

**Ready to deploy!** 🚀

Your Edu-Sync ERP system is now ready for GitHub Pages deployment with full demo functionality and easy setup for production use.
