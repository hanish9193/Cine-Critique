import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sentimentAnalysisService } from "./services/sentimentAnalysis";
import { movieService } from "./services/movieService";
import { insertReviewSchema, insertUserPreferenceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize sentiment analysis model and movies
  await sentimentAnalysisService.loadModel();
  await movieService.initializeMovies();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Movie routes
  app.get('/api/movies', async (req, res) => {
    try {
      const { language } = req.query;
      
      let movies;
      if (language && typeof language === 'string') {
        movies = await movieService.getMoviesByLanguageWithStats(language);
      } else {
        movies = await movieService.getMoviesWithStats();
      }
      
      res.json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  app.get('/api/movies/:id', async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      const movie = await storage.getMovie(movieId);
      
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      const stats = await storage.getMovieStats(movieId);
      res.json({ ...movie, ...stats });
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log('User ID from auth:', userId);
      console.log('Request body:', req.body);
      
      const reviewData = insertReviewSchema.parse(req.body);
      const reviewWithUser = { ...reviewData, userId };
      
      console.log('Review data with user:', reviewWithUser);
      
      // Check if user already reviewed this movie
      const existingReview = await storage.getUserReviewForMovie(userId, reviewData.movieId);
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this movie" });
      }
      
      const review = await storage.createReview(reviewWithUser);
      
      // Create or update user preference based on sentiment
      const preference = {
        userId,
        movieId: reviewData.movieId,
        liked: reviewData.sentiment === 'positive',
      };
      await storage.createOrUpdatePreference(preference);
      
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews/movie/:id', async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByMovie(movieId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
      res.status(500).json({ message: "Failed to fetch movie reviews" });
    }
  });

  // Sentiment analysis route
  app.post('/api/sentiment', isAuthenticated, async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: "Text is required for sentiment analysis" });
      }
      
      const result = await sentimentAnalysisService.analyzeSentiment(text);
      res.json(result);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      res.status(500).json({ message: "Failed to analyze sentiment" });
    }
  });

  // User preferences routes
  app.get('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // User statistics route
  app.get('/api/stats/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
