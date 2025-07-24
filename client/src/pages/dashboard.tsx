import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, Edit } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Review, Movie } from "@shared/schema";

type ReviewWithMovie = Review & { movie: Movie };

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: userStats } = useQuery({
    queryKey: ["/api/stats/user"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: userReviews } = useQuery<ReviewWithMovie[]>({
    queryKey: ["/api/reviews/user"],
    retry: false,
    enabled: isAuthenticated,
  });

  // Show loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--cinema-dark)] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--cinema-gold)]"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-[var(--cinema-gold)] fill-current" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[var(--cinema-dark)] text-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold mb-4">Your Movie Dashboard</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your review history and discover insights about your movie preferences.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Reviews</p>
                  <p className="text-3xl font-bold text-[var(--cinema-gold)]">
                    {userStats?.totalReviews || 0}
                  </p>
                </div>
                <Edit className="text-[var(--cinema-gold)] text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Positive Reviews</p>
                  <p className="text-3xl font-bold text-[var(--sentiment-positive)]">
                    {userStats?.positiveReviews || 0}
                  </p>
                </div>
                <ThumbsUp className="text-[var(--sentiment-positive)] text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Negative Reviews</p>
                  <p className="text-3xl font-bold text-[var(--sentiment-negative)]">
                    {userStats?.negativeReviews || 0}
                  </p>
                </div>
                <ThumbsDown className="text-[var(--sentiment-negative)] text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Rating</p>
                  <p className="text-3xl font-bold text-[var(--cinema-gold)]">
                    {userStats?.avgRating ? Number(userStats.avgRating).toFixed(1) : "0.0"}
                  </p>
                </div>
                <Star className="text-[var(--cinema-gold)] text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-playfair font-bold mb-6">Recent Reviews</h3>
              
              {userReviews && userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="bg-[var(--cinema-dark)] rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{review.movie.title}</h4>
                        <span className="text-sm text-gray-400">
                          {formatDate(review.createdAt!)}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex space-x-1 mr-3">
                          {renderStars(review.rating)}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            review.sentiment === 'positive'
                              ? 'bg-[var(--sentiment-positive)] text-white'
                              : 'bg-[var(--sentiment-negative)] text-white'
                          }`}
                        >
                          {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reviews yet. Start reviewing movies to see them here!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences Insights */}
          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-playfair font-bold mb-6">Your Insights</h3>
              
              {userStats && userStats.totalReviews > 0 ? (
                <div className="space-y-6">
                  {/* Sentiment Distribution */}
                  <div>
                    <h4 className="font-medium mb-3">Sentiment Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Positive</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-[var(--sentiment-positive)] h-2 rounded-full"
                              style={{ 
                                width: `${(userStats.positiveReviews / userStats.totalReviews) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {Math.round((userStats.positiveReviews / userStats.totalReviews) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Negative</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-[var(--sentiment-negative)] h-2 rounded-full"
                              style={{ 
                                width: `${(userStats.negativeReviews / userStats.totalReviews) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {Math.round((userStats.negativeReviews / userStats.totalReviews) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h4 className="font-medium mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="bg-[var(--cinema-gold)] text-black rounded-lg p-3 mb-2">
                          <span className="text-lg font-bold">
                            {userStats.totalReviews}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">Total Reviews</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-[var(--cinema-dark)] border border-[var(--cinema-gold)] text-[var(--cinema-gold)] rounded-lg p-3 mb-2">
                          <span className="text-lg font-bold">
                            {Number(userStats.avgRating || 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">Avg Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Start reviewing movies to see your insights!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
