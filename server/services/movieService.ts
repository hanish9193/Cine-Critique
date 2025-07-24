import { storage } from "../storage";
import type { Movie, InsertMovie } from "@shared/schema";

// Sample Indian movies data to populate the database
const SAMPLE_MOVIES: InsertMovie[] = [
  {
    title: "Adipurush",
    genre: "Action, Drama, Mythology",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A modern adaptation of the epic Ramayana",
    releaseYear: 2023,
    rating: "7.2",
  },
  {
    title: "RRR",
    genre: "Action, Drama, Historical",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A fictional story about two legendary revolutionaries",
    releaseYear: 2022,
    rating: "8.8",
  },
  {
    title: "Master",
    genre: "Action, Thriller, Crime",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A young professor takes on a juvenile detention center",
    releaseYear: 2021,
    rating: "8.1",
  },
  {
    title: "Dangal",
    genre: "Biography, Drama, Sport",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A former wrestler trains his daughters to become world-class wrestlers",
    releaseYear: 2016,
    rating: "8.9",
  },
  {
    title: "Pushpa",
    genre: "Action, Crime, Drama",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1574263867128-cc3bae07e41e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A laborer rises through the ranks of a red sandalwood smuggling syndicate",
    releaseYear: 2021,
    rating: "7.6",
  },
  {
    title: "Vikram",
    genre: "Action, Crime, Thriller",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Members of a black ops team must track and eliminate a gang of masked murderers",
    releaseYear: 2022,
    rating: "8.4",
  },
  {
    title: "Zindagi Na Milegi Dobara",
    genre: "Adventure, Comedy, Drama",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Three friends on a bachelor trip across Spain",
    releaseYear: 2011,
    rating: "8.2",
  },
  {
    title: "Baahubali",
    genre: "Action, Drama, Fantasy",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A young man learns about his royal heritage and seeks to claim his throne",
    releaseYear: 2015,
    rating: "8.7",
  },
  {
    title: "3 Idiots",
    genre: "Comedy, Drama",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Two friends search for their long-lost companion after graduation",
    releaseYear: 2009,
    rating: "8.4",
  },
  {
    title: "Super Deluxe",
    genre: "Drama, Thriller",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "An anthology of interconnected stories in Chennai",
    releaseYear: 2019,
    rating: "8.3",
  },
  {
    title: "Arjun Reddy",
    genre: "Drama, Romance",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A short-tempered surgeon falls into a path of self-destruction",
    releaseYear: 2017,
    rating: "8.1",
  },
  {
    title: "Queen",
    genre: "Comedy, Drama",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A young woman goes on her honeymoon alone after her wedding is called off",
    releaseYear: 2013,
    rating: "8.2",
  },
];

class MovieService {
  async initializeMovies(): Promise<void> {
    try {
      // Check if movies already exist
      const existingMovies = await storage.getAllMovies();
      
      if (existingMovies.length === 0) {
        console.log("Initializing movie database...");
        
        // Insert sample movies
        for (const movie of SAMPLE_MOVIES) {
          await storage.createMovie(movie);
        }
        
        console.log(`Initialized ${SAMPLE_MOVIES.length} movies in database`);
      }
    } catch (error) {
      console.error("Error initializing movies:", error);
    }
  }

  async getMoviesWithStats(): Promise<(Movie & { 
    positiveReviews: number; 
    negativeReviews: number; 
    totalReviews: number;
  })[]> {
    const movies = await storage.getAllMovies();
    
    const moviesWithStats = await Promise.all(
      movies.map(async (movie) => {
        const stats = await storage.getMovieStats(movie.id);
        return {
          ...movie,
          positiveReviews: stats.positiveReviews,
          negativeReviews: stats.negativeReviews,
          totalReviews: stats.totalReviews,
        };
      })
    );

    return moviesWithStats;
  }

  async getMoviesByLanguageWithStats(language: string): Promise<(Movie & { 
    positiveReviews: number; 
    negativeReviews: number; 
    totalReviews: number;
  })[]> {
    const movies = await storage.getMoviesByLanguage(language);
    
    const moviesWithStats = await Promise.all(
      movies.map(async (movie) => {
        const stats = await storage.getMovieStats(movie.id);
        return {
          ...movie,
          positiveReviews: stats.positiveReviews,
          negativeReviews: stats.negativeReviews,
          totalReviews: stats.totalReviews,
        };
      })
    );

    return moviesWithStats;
  }
}

export const movieService = new MovieService();
