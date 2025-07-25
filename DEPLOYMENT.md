# CineReview Deployment Guide

This guide covers deploying CineReview to various platforms with PostgreSQL database.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Replit account for authentication

## Local Development Setup

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser --interactive
sudo -u postgres createdb cinereview

# Initialize database
psql cinereview < database/init.sql
```

**Option B: Cloud PostgreSQL (Recommended)**
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available)  
- **Railway**: https://railway.app (PostgreSQL addon)
- **AWS RDS**: https://aws.amazon.com/rds/
- **Google Cloud SQL**: https://cloud.google.com/sql

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=generate-a-long-random-string
REPL_ID=your-replit-app-id
REPLIT_DOMAINS=your-domain.com
```

### 3. Install and Run

```bash
npm install
npm run dev
```

## Production Deployment

### Vercel Deployment

1. **Prepare for Vercel**
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/**/*",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ]
   }
   ```

2. **Deploy**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Railway Deployment

1. **Connect Repository**
   - Go to https://railway.app
   - Connect your GitHub repository
   - Add PostgreSQL service

2. **Environment Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SESSION_SECRET=your-session-secret
   REPL_ID=your-replit-id
   REPLIT_DOMAINS=your-railway-domain.railway.app
   NODE_ENV=production
   ```

3. **Deploy**
   - Railway automatically builds and deploys on git push

### Heroku Deployment

1. **Prepare Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login and create app
   heroku login
   heroku create your-app-name
   
   # Add PostgreSQL addon
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Configure Environment**
   ```bash
   heroku config:set SESSION_SECRET=your-session-secret
   heroku config:set REPL_ID=your-replit-id
   heroku config:set REPLIT_DOMAINS=your-app-name.herokuapp.com
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   
   # Initialize database
   heroku pg:psql < database/init.sql
   ```

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository
   - Add PostgreSQL database

2. **Configure Build**
   ```yaml
   # .do/app.yaml
   name: cinereview
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/cinereview
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: DATABASE_URL
       scope: RUN_TIME
       value: ${db.DATABASE_URL}
     - key: SESSION_SECRET
       scope: RUN_TIME
       value: your-session-secret
   databases:
   - name: db
     engine: PG
     version: "13"
   ```

### AWS Deployment (EC2 + RDS)

1. **Setup RDS PostgreSQL**
   ```bash
   # Create RDS instance via AWS Console
   # Note the endpoint and credentials
   ```

2. **Setup EC2 Instance**
   ```bash
   # Connect to EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone and setup project
   git clone your-repo-url
   cd cinereview
   npm install
   npm run build
   ```

3. **Process Manager (PM2)**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start server/index.js --name cinereview
   pm2 startup
   pm2 save
   ```

4. **Nginx Reverse Proxy**
   ```nginx
   # /etc/nginx/sites-available/cinereview
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Migration in Production

```bash
# For existing deployments, run migrations
npm run db:push

# Or manually execute SQL updates
psql $DATABASE_URL < database/migration.sql
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Yes | Secret for session encryption | Long random string |
| `REPL_ID` | Yes | Replit application ID | From Replit settings |
| `REPLIT_DOMAINS` | Yes | Allowed domains for auth | `app.railway.app` |
| `NODE_ENV` | No | Environment mode | `production` |
| `PORT` | No | Server port | `5000` |
| `ISSUER_URL` | No | OIDC issuer URL | `https://replit.com/oidc` |

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure session secrets
- [ ] Configure proper CORS origins
- [ ] Use connection pooling for database
- [ ] Enable rate limiting
- [ ] Validate all input data
- [ ] Use environment variables for secrets
- [ ] Regular security updates

## Monitoring

### Health Check Endpoint
```javascript
// Add to server/routes.ts
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging
- Use structured logging (Winston, Pino)
- Log errors and important events
- Set up log aggregation (CloudWatch, Papertrail)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: connect ECONNREFUSED
   ```
   - Check DATABASE_URL format
   - Verify database is running
   - Check firewall/security groups

2. **Authentication Error**
   ```
   Error: Invalid client
   ```
   - Verify REPL_ID is correct
   - Check REPLIT_DOMAINS matches deployment URL
   - Ensure SESSION_SECRET is set

3. **Build Errors**
   ```
   Module not found
   ```
   - Run `npm install` 
   - Check Node.js version (18+)
   - Clear node_modules and reinstall

### Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use connection pooling

For additional support, please refer to the main README.md or create an issue in the repository.