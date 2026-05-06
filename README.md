# 10MS SheSTEM Application

AI-Enabled Group Guidance Program for 10 Minute School

## 📁 Project Structure

```
.
├── .env.local                 # Environment variables for local development
├── .gitignore                # Git ignore rules
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Dependency lock file
├── tsconfig.json             # TypeScript base configuration
├── 
├── config/                   # Configuration files
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── tsconfig.app.json     # TypeScript app configuration
│   └── tsconfig.node.json    # TypeScript Node configuration
├── eslint.config.js          # ESLint configuration (root level)
├── vite.config.ts            # Vite build tool configuration (root level)
├── 
├── docs/                     # Documentation
│   ├── AI_GG_PROGRAM.md
│   ├── AUTHENTICATION_FIX_DEPLOYMENT_SUMMARY.md
│   ├── COMPREHENSIVE_FIXES_SUMMARY.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   ├── FIXES_AND_IMPROVEMENTS_SUMMARY.md
│   ├── MENTOR_FEATURES.md
│   ├── PROGRESS_CONSISTENCY_FIX_SUMMARY.md
│   ├── STUDENT_FEATURES.md
│   ├── SUPABASE_SETUP.md
│   ├── TASK_COMPLETION_FIX_SUMMARY.md
│   └── URL_ARCHITECTURE.md
├── 
├── docker/                   # Docker configuration
│   ├── docker-compose.yaml   # Docker Compose configuration
│   └── dockerfile           # Docker build instructions
├── 
├── index.html               # Main HTML entry point
├── 
├── scripts/                  # Build and deployment scripts
│   ├── comprehensive_e2e_test.js
│   ├── comprehensive_feature_test_fixed.js
│   ├── deploy.sh            # Deployment script
│   ├── deployment.config.js # Deployment configuration
│   ├── final_comprehensive_test.js
│   ├── nginx.conf           # Nginx configuration
│   ├── test_database_connection.js
│   ├── test_notice_creation.js
│   └── ... (other test scripts)
├── 
├── sql/                      # Database scripts
│   ├── fix_notices_rls_policies.sql
│   ├── fix_production_rls.sql
│   └── ... (other SQL scripts)
├── 
└── src/                      # Application source code
    ├── components/           # React components
    │   ├── Auth/            # Authentication components
    │   ├── Community/       # Community features
    │   ├── Mentor/          # Mentor dashboard components
    │   ├── NoticeBoard/     # Notice board components
    │   ├── Profile/         # User profile components
    │   ├── Roadmap/         # Roadmap components
    │   └── Student/         # Student dashboard components
    ├── config/              # Application configuration
    ├── data/                # Static data files
    ├── lib/                 # Utility libraries
    │   ├── AuthContext.tsx  # Authentication context
    │   ├── cache.ts         # Caching utilities
    │   ├── supabase.ts      # Supabase client
    │   └── useAuth.ts       # Authentication hook
    ├── services/            # API services
    │   ├── database.ts      # Database service
    │   └── progressSync.ts  # Progress synchronization
    ├── App.tsx              # Main application component
    ├── main.tsx             # Application entry point
    └── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Testing
```bash
# Run comprehensive tests
node scripts/final_comprehensive_test.js

# Run database connection test
node scripts/test_database_connection.js

# Run notice creation test
node scripts/test_notice_creation.js
```

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Supabase** for backend services
- **PostgreSQL** database with Row Level Security (RLS)
- **Real-time subscriptions** for live updates

### Key Features
- **Authentication**: Email/password with role-based access
- **Mentor Dashboard**: Notice management, batch management, student tracking
- **Student Dashboard**: Progress tracking, task completion, roadmap navigation
- **Real-time Updates**: Live progress synchronization
- **Responsive Design**: Mobile-first approach

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_AUTH_REDIRECT_URL`: Authentication callback URL

### Build Configuration
- Vite configuration in `config/vite.config.ts`
- TypeScript configuration in `config/tsconfig.*.json`
- ESLint configuration in `config/eslint.config.js`

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:
- **DATABASE_SCHEMA.md**: Complete database schema documentation
- **MENTOR_FEATURES.md**: Mentor dashboard features
- **STUDENT_FEATURES.md**: Student dashboard features
- **DEPLOYMENT.md**: Deployment instructions
- **COMPREHENSIVE_FIXES_SUMMARY.md**: Recent fixes and improvements

## 🧪 Testing

The application includes comprehensive test suites:
- **End-to-end tests**: Full application functionality testing
- **Database tests**: Connection and CRUD operation testing
- **Feature tests**: Individual feature validation
- **Integration tests**: Component integration testing

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -f docker/dockerfile -t shestem-app .

# Run with Docker Compose
docker-compose -f docker/docker-compose.yaml up
```

### Manual Deployment
```bash
# Build for production
npm run build:prod

# Deploy using deployment script
./scripts/deploy.sh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## 📄 License

This project is proprietary to 10 Minute School.

## 🆘 Support

For support and questions, please contact the development team.
