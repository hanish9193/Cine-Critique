# CineReview - Movie Review Platform with AI Sentiment Analysis

## Overview

CineReview is a modern full-stack movie review platform focused on Indian cinema. The application allows users to review movies and get real-time AI-powered sentiment analysis of their reviews using a custom-trained TensorFlow model. The platform features a cinema-themed UI with a sophisticated color scheme and provides comprehensive movie statistics and user dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.
Review word limit: Increased to 2000 characters for detailed reviews.
Dashboard design: Interactive elements preferred over basic statistics.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom cinema theme variables
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **AI/ML**: TensorFlow.js for sentiment analysis

## Key Components

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Authentication and profile data (Replit Auth integration)
- **Movies**: Movie metadata including title, genre, language, rating
- **Reviews**: User reviews with sentiment analysis results
- **UserPreferences**: User movie preferences and interactions
- **Sessions**: Session storage for authentication

### Authentication System
- Implements Replit Auth with OpenID Connect
- Session-based authentication with PostgreSQL session store
- Middleware for protected routes and user context

### Sentiment Analysis Service
- Custom TensorFlow.js model for review sentiment analysis
- Real-time sentiment scoring (positive/negative with confidence)
- Fallback model implementation for reliability
- Supports batch processing and caching

### Movie Management
- Sample Indian cinema database (Hindi, Tamil, Telugu)
- Movie statistics aggregation (review counts, sentiment ratios)
- Language-based filtering and categorization
- Poster image integration with Unsplash

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **Movie Browsing**: Frontend fetches movies with aggregated statistics via REST API
3. **Review Submission**: 
   - User submits review text and rating
   - Server processes review through sentiment analysis model
   - Results stored with sentiment scores and confidence levels
4. **Real-time Updates**: TanStack Query manages cache invalidation and updates
5. **Dashboard Analytics**: Aggregated user statistics and review history

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@tensorflow/tfjs-node**: AI model execution
- **@radix-ui/***: UI component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM and migrations
- **express**: Web server framework
- **passport**: Authentication middleware

### Development Tools
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety across the stack
- **tsx**: TypeScript execution for development

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling
- Replit Auth for seamless authentication

## Deployment Strategy

### Development Environment
- Uses Vite dev server with HMR for frontend
- tsx for TypeScript execution in development
- Concurrent client and server development with middleware integration

### Production Build
- Frontend: Vite builds to `dist/public` directory
- Backend: esbuild bundles server to `dist/index.js`
- Static file serving from Express in production
- Environment-based configuration for database and auth

### Database Management
- Drizzle Kit for schema migrations
- PostgreSQL with connection pooling
- Environment variable configuration for database URL

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit integration identifier
- `ISSUER_URL`: OpenID Connect provider URL

The architecture emphasizes type safety, modern development practices, and scalable deployment while maintaining a focus on the Indian cinema domain with sophisticated AI-powered features.

## Recent Changes (July 25, 2025)

- **Enhanced Sentiment Analysis**: Improved keyword detection, context analysis, and scoring variation for more realistic results
- **Removed Star Rating System**: Completely eliminated star ratings in favor of AI-determined liked/disliked sentiment
- **Increased Review Word Limit**: Extended from 500 to 2000 characters to allow detailed movie reviews
- **Interactive Dashboard**: Replaced basic statistics with engaging elements including:
  - Genre preference analysis with sentiment indicators
  - Review streak tracking and user activity timeline
  - Cinema personality insights and watch time estimates
  - Interactive timeframe filters and enhanced visual design
- **Database Optimization**: Fixed user preference constraint handling and improved review submission reliability
- **UI Improvements**: Simplified interface to focus on AI-powered sentiment rather than manual ratings