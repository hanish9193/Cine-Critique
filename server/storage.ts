import {
  users,
  movies,
  reviews,
  userPreferences,
  type User,
  type UpsertUser,
  type Movie,
  type Review,
  type UserPreference,
  type InsertMovie,
  type InsertReview,
  type InsertUserPreference,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Movie operations
  getAllMovies(): Promise<Movie[]>;
  getMoviesByLanguage(language: string): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByUser(userId: string): Promise<(Review & { movie: Movie })[]>;
  getReviewsByMovie(movieId: number): Promise<(Review & { user: User })[]>;
  getUserReviewForMovie(userId: string, movieId: number): Promise<Review | undefined>;
  
  // User preference operations
  createOrUpdatePreference(preference: InsertUserPreference): Promise<UserPreference>;
  getUserPreferences(userId: string): Promise<(UserPreference & { movie: Movie })[]>;
  
  // Statistics
  getUserStats(userId: string): Promise<{
    totalReviews: number;
    positiveReviews: number;
    negativeReviews: number;
    avgRating: number;
  }>;
  getMovieStats(movieId: number): Promise<{
    totalReviews: number;
    positiveReviews: number;
    negativeReviews: number;
    avgRating: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Movie operations
  async getAllMovies(): Promise<Movie[]> {
    return await db.select().from(movies).orderBy(desc(movies.rating));
  }

  async getMoviesByLanguage(language: string): Promise<Movie[]> {
    return await db
      .select()
      .from(movies)
      .where(eq(movies.language, language))
      .orderBy(desc(movies.rating));
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie;
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const [newMovie] = await db.insert(movies).values(movie).returning();
    return newMovie;
  }

  // Review operations
  async createReview(review: InsertReview & { userId: string }): Promise<Review> {
    console.log('Creating review with data:', review);
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewsByUser(userId: string): Promise<(Review & { movie: Movie })[]> {
    return await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        movieId: reviews.movieId,
        content: reviews.content,
        rating: reviews.rating,
        sentiment: reviews.sentiment,
        sentimentConfidence: reviews.sentimentConfidence,
        createdAt: reviews.createdAt,
        movie: movies,
      })
      .from(reviews)
      .innerJoin(movies, eq(reviews.movieId, movies.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByMovie(movieId: number): Promise<(Review & { user: User })[]> {
    return await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        movieId: reviews.movieId,
        content: reviews.content,
        rating: reviews.rating,
        sentiment: reviews.sentiment,
        sentimentConfidence: reviews.sentimentConfidence,
        createdAt: reviews.createdAt,
        user: users,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.movieId, movieId))
      .orderBy(desc(reviews.createdAt));
  }

  async getUserReviewForMovie(userId: string, movieId: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.movieId, movieId)));
    return review;
  }

  // User preference operations
  async createOrUpdatePreference(preference: InsertUserPreference): Promise<UserPreference> {
    // First try to find existing preference
    const existing = await db
      .select()
      .from(userPreferences)
      .where(
        and(
          eq(userPreferences.userId, preference.userId),
          eq(userPreferences.movieId, preference.movieId)
        )
      );

    if (existing.length > 0) {
      // Update existing preference
      const [result] = await db
        .update(userPreferences)
        .set({ liked: preference.liked })
        .where(
          and(
            eq(userPreferences.userId, preference.userId),
            eq(userPreferences.movieId, preference.movieId)
          )
        )
        .returning();
      return result;
    } else {
      // Insert new preference
      const [result] = await db
        .insert(userPreferences)
        .values(preference)
        .returning();
      return result;
    }
  }

  async getUserPreferences(userId: string): Promise<(UserPreference & { movie: Movie })[]> {
    return await db
      .select({
        id: userPreferences.id,
        userId: userPreferences.userId,
        movieId: userPreferences.movieId,
        liked: userPreferences.liked,
        createdAt: userPreferences.createdAt,
        movie: movies,
      })
      .from(userPreferences)
      .innerJoin(movies, eq(userPreferences.movieId, movies.id))
      .where(eq(userPreferences.userId, userId));
  }

  // Statistics
  async getUserStats(userId: string): Promise<{
    totalReviews: number;
    positiveReviews: number;
    negativeReviews: number;
    avgRating: number;
  }> {
    const [stats] = await db
      .select({
        totalReviews: count(),
        positiveReviews: sql<number>`sum(case when sentiment = 'positive' then 1 else 0 end)`,
        negativeReviews: sql<number>`sum(case when sentiment = 'negative' then 1 else 0 end)`,
        avgRating: sql<number>`avg(rating)`,
      })
      .from(reviews)
      .where(eq(reviews.userId, userId));

    return {
      totalReviews: stats.totalReviews,
      positiveReviews: Number(stats.positiveReviews) || 0,
      negativeReviews: Number(stats.negativeReviews) || 0,
      avgRating: Number(stats.avgRating) || 0,
    };
  }

  async getMovieStats(movieId: number): Promise<{
    totalReviews: number;
    positiveReviews: number;
    negativeReviews: number;
    avgRating: number;
  }> {
    const [stats] = await db
      .select({
        totalReviews: count(),
        positiveReviews: sql<number>`sum(case when sentiment = 'positive' then 1 else 0 end)`,
        negativeReviews: sql<number>`sum(case when sentiment = 'negative' then 1 else 0 end)`,
        avgRating: sql<number>`avg(rating)`,
      })
      .from(reviews)
      .where(eq(reviews.movieId, movieId));

    return {
      totalReviews: stats.totalReviews,
      positiveReviews: Number(stats.positiveReviews) || 0,
      negativeReviews: Number(stats.negativeReviews) || 0,
      avgRating: Number(stats.avgRating) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
