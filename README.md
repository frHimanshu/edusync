# Student Management System (SMS)

A comprehensive web-based student management system built with Next.js, featuring role-based access control and multiple portals for different user types.

## 🚀 Features

### Multi-Portal Architecture
- **Student Portal**: Dashboard, attendance, wallet, documents
- **Faculty Portal**: Attendance marking, announcements, course management
- **HOD Portal**: Department management, KPIs, analytics
- **Accountant Portal**: Student registration, fee management, document handling
- **Librarian Portal**: Book management, issuance tracking, catalog
- **T&P Portal**: Student database, placement management, company relations
- **Hostel Portal**: Room management, student allocation, maintenance

### Key Features
- 🔐 Role-based authentication and authorization
- 📱 Responsive design for all devices
- 🎨 Modern UI with Shadcn/UI components
- 📊 Real-time dashboards and analytics
- 📄 Document management system
- 💰 Fee and wallet management
- 📚 Library management system
- 🏠 Hostel occupancy management
- 🎯 Placement and training management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Shadcn/UI, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel, GitHub Pages
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for production)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sms112
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEMO_MODE=false
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)

## 🎭 Demo Mode

For demonstrations without a database:

```bash
npm run dev:demo
```

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

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### GitHub Pages (Demo Mode)
1. Enable GitHub Actions in repository settings
2. Push to main branch
3. GitHub Actions will automatically deploy to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
sms112/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── student/                  # Student portal
│   ├── faculty/                  # Faculty portal
│   ├── authority/                # Authority portals
│   │   ├── hod/                  # HOD portal
│   │   ├── accounts/             # Accountant portal
│   │   ├── library/              # Librarian portal
│   │   ├── tnp/                  # T&P portal
│   │   └── hostel/               # Hostel portal
│   └── api/                      # API routes
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   ├── layout/                   # Layout components
│   └── ui/                       # UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── public/                       # Static assets
└── styles/                       # Global styles
```

## 🔐 Authentication & Authorization

The system implements role-based access control with the following roles:

- **Student**: Access to personal dashboard, attendance, documents
- **Faculty**: Course management, attendance marking, announcements
- **HOD**: Department oversight, faculty management, analytics
- **Accountant**: Student registration, fee management, document uploads
- **Librarian**: Book catalog, issuance tracking, student search
- **T&P**: Student database, placement drives, company relations
- **Hostel**: Room management, student allocation, maintenance

## 📊 Database Schema

The system uses Supabase with the following main entities:

- **Users**: Authentication and profile information
- **Students**: Student records and academic information
- **Faculty**: Faculty profiles and course assignments
- **Courses**: Course catalog and scheduling
- **Attendance**: Attendance records and tracking
- **Documents**: Document storage and management
- **Fees**: Fee structure and payment tracking
- **Books**: Library catalog and inventory
- **Rooms**: Hostel room management
- **Placements**: Placement records and company information

## 🎨 UI Components

Built with Shadcn/UI components:
- **Layout**: Sidebar, Header, Navigation
- **Forms**: Input, Select, Textarea, Checkbox
- **Data Display**: Table, Card, Badge, Avatar
- **Feedback**: Toast, Alert, Dialog
- **Navigation**: Tabs, Breadcrumb, Pagination

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run dev:demo     # Start development server in demo mode
npm run build        # Build for production
npm run build:demo   # Build for demo deployment
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review the documentation in the `/docs` folder
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with external systems
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] API documentation
- [ ] Automated testing suite

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Shadcn/UI](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons