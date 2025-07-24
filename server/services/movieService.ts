import { storage } from "../storage";
import type { Movie, InsertMovie } from "@shared/schema";

// Expanded Indian movies database
const SAMPLE_MOVIES: InsertMovie[] = [
  // Hindi Movies
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
    title: "Dangal",
    genre: "Biography, Drama, Sport",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A former wrestler trains his daughters to become world-class wrestlers",
    releaseYear: 2016,
    rating: "8.9",
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
    title: "Lagaan",
    genre: "Drama, Musical, Sport",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Villagers accept a challenge from British officers to play cricket to avoid taxes",
    releaseYear: 2001,
    rating: "8.6",
  },
  {
    title: "Taare Zameen Par",
    genre: "Drama, Family",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A teacher helps a dyslexic child discover his potential",
    releaseYear: 2007,
    rating: "8.4",
  },
  {
    title: "Gully Boy",
    genre: "Drama, Musical",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A street rapper from Mumbai's slums pursues his dream",
    releaseYear: 2019,
    rating: "7.9",
  },
  {
    title: "Article 15",
    genre: "Crime, Drama, Thriller",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A police officer investigates the disappearance of three girls in rural India",
    releaseYear: 2019,
    rating: "8.1",
  },
  {
    title: "Andhadhun",
    genre: "Crime, Thriller, Comedy",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A blind pianist becomes embroiled in a murder mystery",
    releaseYear: 2018,
    rating: "8.2",
  },
  {
    title: "Zindagi Na Milegi Dobara",
    genre: "Adventure, Comedy, Drama",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Three friends on a bachelor trip across Spain",
    releaseYear: 2011,
    rating: "8.2",
  },
  {
    title: "Dil Chahta Hai",
    genre: "Comedy, Drama, Romance",
    language: "hindi",
    posterUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Three friends with different perspectives on love and relationships",
    releaseYear: 2001,
    rating: "8.1",
  },

  // Tamil Movies
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
    title: "Vikram",
    genre: "Action, Crime, Thriller",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Members of a black ops team must track and eliminate a gang of masked murderers",
    releaseYear: 2022,
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
    title: "Kaala",
    genre: "Action, Drama",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A slum lord fights against gentrification and oppression",
    releaseYear: 2018,
    rating: "7.3",
  },
  {
    title: "Enthiran",
    genre: "Action, Romance, Sci-Fi",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A scientist creates an android that becomes self-aware",
    releaseYear: 2010,
    rating: "7.1",
  },
  {
    title: "Asuran",
    genre: "Action, Drama",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A farmer's family faces caste-based violence and seeks justice",
    releaseYear: 2019,
    rating: "8.4",
  },
  {
    title: "96",
    genre: "Drama, Romance",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "Former classmates meet after 22 years at a school reunion",
    releaseYear: 2018,
    rating: "8.5",
  },
  {
    title: "Jai Bhim",
    genre: "Crime, Drama",
    language: "tamil",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A lawyer fights for justice for a tribal woman whose husband disappears",
    releaseYear: 2021,
    rating: "8.8",
  },

  // Telugu Movies
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
    title: "Pushpa",
    genre: "Action, Crime, Drama",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1574263867128-cc3bae07e41e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A laborer rises through the ranks of a red sandalwood smuggling syndicate",
    releaseYear: 2021,
    rating: "7.6",
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
    title: "Baahubali 2",
    genre: "Action, Drama, Fantasy",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "The conclusion of the epic tale of Baahubali",
    releaseYear: 2017,
    rating: "8.2",
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
    title: "Eega",
    genre: "Action, Comedy, Fantasy",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A man reincarnated as a fly seeks revenge on his killer",
    releaseYear: 2012,
    rating: "7.7",
  },
  {
    title: "Rangasthalam",
    genre: "Action, Drama",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A hearing-impaired man fights against corruption in his village",
    releaseYear: 2018,
    rating: "8.2",
  },
  {
    title: "Jersey",
    genre: "Drama, Sport",
    language: "telugu",
    posterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A failed cricketer makes a comeback to fulfill his son's dream",
    releaseYear: 2019,
    rating: "8.6",
  },

  // English/Bollywood Movies with English dialogues
  {
    title: "Queen",
    genre: "Comedy, Drama",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A young woman goes on her honeymoon alone after her wedding is called off",
    releaseYear: 2013,
    rating: "8.2",
  },
  {
    title: "English Vinglish",
    genre: "Comedy, Drama, Family",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A housewife enrolls in an English course to gain confidence",
    releaseYear: 2012,
    rating: "7.8",
  },
  {
    title: "The Lunchbox",
    genre: "Drama, Romance",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A mistaken lunchbox delivery leads to an unlikely friendship",
    releaseYear: 2013,
    rating: "7.8",
  },
  {
    title: "Pink",
    genre: "Crime, Drama, Thriller",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A lawyer defends three young women in a molestation case",
    releaseYear: 2016,
    rating: "8.1",
  },
  {
    title: "Tumhari Sulu",
    genre: "Comedy, Drama",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "A housewife becomes a radio jockey and finds her voice",
    releaseYear: 2017,
    rating: "7.1",
  },
  {
    title: "Shakuntala Devi",
    genre: "Biography, Drama",
    language: "english",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
    description: "The story of the human computer Shakuntala Devi",
    releaseYear: 2020,
    rating: "6.6",
  }
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
