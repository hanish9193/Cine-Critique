# CineReview - Movie Review Platform with AI Sentiment Analysis

A modern full-stack movie review platform focused on Indian cinema with AI-powered sentiment analysis. Users can review movies and get real-time sentiment analysis using a custom-trained TensorFlow model.

## Features

- **AI-Powered Sentiment Analysis**: Custom TensorFlow model analyzes review sentiment (liked/disliked)
- **Indian Cinema Focus**: Curated collection of Hindi, Tamil, Telugu, and Kannada movies
- **Interactive Dashboard**: Personal analytics with genre preferences, review streaks, and cinema personality insights
- **Social Authentication**: Secure login with Replit Auth (OpenID Connect)
- **Responsive Design**: Modern cinema-themed dark UI with Tailwind CSS
- **Real-time Updates**: Live sentiment analysis and instant review feedback

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** with custom cinema theme
- **Radix UI** components with shadcn/ui design system
- **TanStack Query** for server state management
- **Vite** for development and build

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database
- **TensorFlow.js** for sentiment analysis
- **Passport.js** with Replit Auth

### Database
- **PostgreSQL** with optimized indexes
- **Session-based authentication** storage
- **Relational data model** with foreign key constraints

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Replit account (for authentication)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cinereview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb cinereview
   
   # Initialize the database with schema and sample data
   psql cinereview < database/init.sql
   ```

4. **Environment Configuration**
   Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/cinereview
   SESSION_SECRET=your-super-secret-session-key-here
   REPL_ID=your-replit-app-id
   ISSUER_URL=https://replit.com/oidc
   REPLIT_DOMAINS=your-domain.replit.app
   NODE_ENV=development
   ```

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   This runs both the frontend (Vite) and backend (Express) servers concurrently.

2. **Database migrations**
   ```bash
   # Push schema changes to database
   npm run db:push
   
   # Generate migrations (if needed)
   npm run db:generate
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
cinereview/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express application
│   ├── services/         # Business logic services
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   ├── replitAuth.ts     # Authentication middleware
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle database schema
├── database/             # Database setup
│   └── init.sql          # Database initialization script
├── images/               # Movie poster images
└── attached_assets/      # AI model files
```

## Key Features Explained

### AI Sentiment Analysis
- Custom-trained TensorFlow model for movie review sentiment
- Context-aware analysis with negation detection
- Confidence scoring and realistic result variation
- Fallback handling for edge cases

### Interactive Dashboard
- **Genre Preferences**: Shows which genres you love/dislike based on sentiment
- **Review Streak**: Tracks consecutive review activity
- **Cinema Personality**: Analyzes your viewing patterns and preferences
- **Activity Timeline**: Recent review history with sentiment indicators
- **Watch Time Estimation**: Calculates estimated viewing hours

### Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL storage
- Protected routes and middleware
- Automatic token refresh handling

## Database Schema

### Core Tables
- **users**: User profiles and authentication data
- **movies**: Movie metadata and information
- **reviews**: User reviews with sentiment analysis results
- **user_preferences**: Liked/disliked movie preferences
- **sessions**: Authentication session storage

### Key Relationships
- Users can review multiple movies (one review per movie)
- Reviews automatically generate user preferences
- Sentiment analysis results stored with confidence scores

## API Endpoints

### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get specific movie

### Reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews/user` - Get user's reviews
- `POST /api/sentiment` - Analyze review sentiment

### Statistics
- `GET /api/stats/user` - Get user statistics

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database initialization script
4. Deploy with your preferred hosting platform

### Production Considerations
- Use connection pooling for database
- Set secure session secrets
- Configure proper CORS settings
- Enable HTTPS for authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create a GitHub issue or contact the development team.