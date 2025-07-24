import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Star, Brain, Send, Loader2 } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Movie } from "@shared/schema";

interface ReviewModalProps {
  movieId: number;
  onClose: () => void;
}

interface SentimentResult {
  sentiment: 'positive' | 'negative';
  confidence: number;
  positiveScore: number;
  negativeScore: number;
}

export default function ReviewModal({ movieId, onClose }: ReviewModalProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [reviewText, setReviewText] = useState("");
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);

  // Fetch movie data
  const { data: movie, isLoading: movieLoading } = useQuery<Movie>({
    queryKey: ["/api/movies", movieId],
  });

  // Check if user already reviewed this movie
  const { data: userReviews } = useQuery<Array<{ movieId: number }>>({
    queryKey: ["/api/reviews/user"],
    enabled: isAuthenticated,
  });

  const hasReviewed = userReviews?.some((review) => review.movieId === movieId);

  // Sentiment analysis mutation
  const sentimentMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/sentiment", { text });
      return await response.json();
    },
    onSuccess: (result: SentimentResult) => {
      setSentimentResult(result);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit review mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!sentimentResult) throw new Error("Sentiment analysis required");
      
      // Auto-assign rating based on sentiment and confidence
      const rating = sentimentResult.sentiment === 'positive' 
        ? Math.max(3, Math.round(3 + (sentimentResult.confidence * 2))) // 3-5 stars for positive
        : Math.max(1, Math.round(3 - (sentimentResult.confidence * 2))); // 1-3 stars for negative
      
      const response = await apiRequest("POST", "/api/reviews", {
        movieId,
        content: reviewText,
        rating,
        sentiment: sentimentResult.sentiment,
        sentimentConfidence: sentimentResult.confidence,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/user"] });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyzeSentiment = () => {
    if (!reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review first.",
        variant: "destructive",
      });
      return;
    }
    sentimentMutation.mutate(reviewText);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review.",
        variant: "destructive",
      });
      return;
    }
    if (!sentimentResult) {
      toast({
        title: "Error",
        description: "Please analyze sentiment first.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate();
  };

  if (movieLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--cinema-gold)]"></div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  if (hasReviewed) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="bg-[var(--cinema-gray)] max-w-md w-full border-gray-600">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-playfair font-bold mb-4 text-white">
              Already Reviewed
            </h2>
            <p className="text-gray-300 mb-6">
              You have already reviewed this movie. Each user can only review a movie once.
            </p>
            <Button onClick={onClose} className="bg-[var(--cinema-gold)] text-black hover:bg-yellow-400">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-[var(--cinema-gray)] max-w-2xl w-full border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-playfair font-bold mb-2 text-white">
                Review: {movie.title}
              </h2>
              <p className="text-gray-400">{movie.genre}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Your Review</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full h-32 bg-[var(--cinema-dark)] border-gray-600 text-white placeholder-gray-400 focus:border-[var(--cinema-gold)] resize-none"
                placeholder="Share your thoughts about this movie..."
                maxLength={500}
              />
              <div className="text-sm text-gray-400 mt-1">
                {reviewText.length}/500 characters
              </div>
            </div>

            {/* AI Auto-Rating Info */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">AI Auto-Rating</label>
              <div className="bg-[var(--cinema-dark)] border border-gray-600 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  <Brain className="inline w-4 h-4 mr-2 text-[var(--cinema-gold)]" />
                  The AI will automatically determine the star rating (1-5) based on sentiment analysis of your review.
                </p>
                {sentimentResult && (
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-400 mr-2">Predicted Rating:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const predictedRating = sentimentResult.sentiment === 'positive' 
                          ? Math.max(3, Math.round(3 + (sentimentResult.confidence * 2)))
                          : Math.max(1, Math.round(3 - (sentimentResult.confidence * 2)));
                        return (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < predictedRating
                                ? "text-[var(--cinema-gold)] fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sentiment Analysis Result */}
            {sentimentResult && (
              <div>
                <label className="block text-sm font-medium mb-2 text-white">AI Sentiment Analysis</label>
                <Card className="bg-[var(--cinema-dark)] border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Sentiment:</span>
                      <Badge
                        variant="secondary"
                        className={
                          sentimentResult.sentiment === 'positive'
                            ? 'bg-[var(--sentiment-positive)] text-white'
                            : 'bg-[var(--sentiment-negative)] text-white'
                        }
                      >
                        {sentimentResult.sentiment.charAt(0).toUpperCase() + sentimentResult.sentiment.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Confidence:</span>
                      <span className="text-[var(--cinema-gold)] font-medium">
                        {(sentimentResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Positive</span>
                        <span>Negative</span>
                      </div>
                      <Progress
                        value={sentimentResult.positiveScore * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAnalyzeSentiment}
                disabled={sentimentMutation.isPending || !reviewText.trim()}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                {sentimentMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-4 w-4" />
                )}
                Analyze Sentiment
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={submitMutation.isPending || !sentimentResult}
                className="flex-1 bg-[var(--cinema-gold)] text-black hover:bg-yellow-400"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
