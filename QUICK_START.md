# CineReview - Quick Start Guide

Get CineReview running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

## Option 1: Local PostgreSQL Setup

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Windows - Download from postgresql.org
```

### 2. Create Database
```bash
# Create database
sudo -u postgres createdb cinereview

# Create user (optional)
sudo -u postgres createuser --interactive
```

### 3. Clone and Setup
```bash
# Clone repository
git clone <your-repo-url>
cd cinereview

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env file
DATABASE_URL=postgresql://postgres:password@localhost:5432/cinereview
SESSION_SECRET=your-super-secret-key-make-it-long-and-random
REPL_ID=your-replit-app-id
REPLIT_DOMAINS=localhost:5000
```

### 4. Initialize Database
```bash
# Run setup script
npm run db:setup

# Or manually
psql cinereview < database/init.sql
```

### 5. Start Development
```bash
npm run dev
```

Open http://localhost:5000 and enjoy! 🎬

## Option 2: Cloud Database (Recommended)

### 1. Get Free PostgreSQL Database

**Neon (Recommended)**
1. Go to https://neon.tech
2. Sign up for free
3. Create new project
4. Copy connection string

**Supabase Alternative**
1. Go to https://supabase.com
2. Create new project
3. Get database URL from settings

### 2. Setup Project
```bash
# Clone and install
git clone <your-repo-url>
cd cinereview
npm install

# Configure environment
cp .env.example .env
```

### 3. Edit .env file
```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/database?sslmode=require
SESSION_SECRET=generate-long-random-string-here
REPL_ID=your-replit-app-id
REPLIT_DOMAINS=your-domain.com
NODE_ENV=development
```

### 4. Initialize and Run
```bash
# Initialize database
npm run db:setup

# Start development
npm run dev
```

## Option 3: Railway One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

1. Click "Deploy on Railway"
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy automatically

## Replit Authentication Setup

### 1. Create Replit App
1. Go to https://replit.com
2. Create new Repl or import project
3. Note your Repl ID from URL

### 2. Configure Auth
```env
REPL_ID=your-replit-id-here
REPLIT_DOMAINS=your-domain.replit.app
```

### 3. Test Authentication
- Visit your app
- Click "Login" 
- Authenticate with Replit
- Start reviewing movies!

## Verification Checklist

- [ ] Database connected successfully
- [ ] Sample movies loaded (12 Indian films)
- [ ] Authentication working
- [ ] Can create reviews
- [ ] Sentiment analysis functioning
- [ ] Dashboard showing analytics

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check database exists
psql -l | grep cinereview
```

### Common Fixes
- **Port already in use**: Kill process or change PORT in .env
- **Database error**: Verify DATABASE_URL format
- **Auth issues**: Check REPL_ID and REPLIT_DOMAINS match

### Getting Help
- Check console for error messages
- Verify all environment variables are set
- Ensure PostgreSQL is running
- Try restarting the development server

## Next Steps

1. **Customize Movies**: Add your favorite Indian films to the database
2. **Style Tweaks**: Modify colors in `client/src/index.css`
3. **Deploy**: Use the DEPLOYMENT.md guide for production
4. **Extend Features**: Add new movie genres or analysis features

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:setup        # Initialize database
npm run db:push         # Push schema changes
npm run db:generate     # Generate migrations

# Type checking
npm run check           # TypeScript validation
```

## Project Structure Quick Reference

```
cinereview/
├── client/src/         # React frontend
├── server/             # Express backend  
├── shared/schema.ts    # Database types
├── database/init.sql   # Database setup
├── .env.example        # Environment template
└── README.md           # Full documentation
```

That's it! You now have a fully functional movie review platform with AI sentiment analysis. Happy reviewing! 🎭