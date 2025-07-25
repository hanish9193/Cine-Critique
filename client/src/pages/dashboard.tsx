import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Calendar, TrendingUp, Activity, Heart, Film, Clock, Award, Eye } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Review, Movie } from "@shared/schema";

type ReviewWithMovie = Review & { movie: Movie };

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

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

  const { data: userStats } = useQuery<{
    totalReviews: number;
    positiveReviews: number;
    negativeReviews: number;
    avgRating: number;
  }>({
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

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper functions for filtering and analysis
  const filterReviewsByTimeframe = (reviews: ReviewWithMovie[]) => {
    if (!reviews || selectedTimeframe === 'all') return reviews;
    
    const now = new Date();
    const cutoff = new Date();
    
    if (selectedTimeframe === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (selectedTimeframe === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    }
    
    return reviews.filter(review => new Date(review.createdAt || '') >= cutoff);
  };

  const getGenreDistribution = () => {
    if (!userReviews) return [];
    const genreCount: Record<string, { count: number; sentiment: 'positive' | 'negative' | 'mixed' }> = {};
    
    userReviews.forEach(review => {
      const genres = review.movie.genre.split(',').map(g => g.trim());
      genres.forEach(genre => {
        if (!genreCount[genre]) {
          genreCount[genre] = { count: 0, sentiment: 'mixed' };
        }
        genreCount[genre].count++;
        
        // Determine dominant sentiment for this genre
        const genreReviews = userReviews.filter(r => 
          r.movie.genre.includes(genre)
        );
        const positive = genreReviews.filter(r => r.sentiment === 'positive').length;
        const total = genreReviews.length;
        
        if (positive / total > 0.7) genreCount[genre].sentiment = 'positive';
        else if (positive / total < 0.3) genreCount[genre].sentiment = 'negative';
        else genreCount[genre].sentiment = 'mixed';
      });
    });
    
    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 6);
  };

  const getRecentActivity = () => {
    if (!userReviews) return [];
    return [...userReviews]
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 4);
  };

  const getReviewStreak = () => {
    if (!userReviews || userReviews.length === 0) return 0;
    
    const sortedReviews = [...userReviews].sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    );
    
    let streak = 1;
    const today = new Date();
    let currentDate = new Date(sortedReviews[0].createdAt || '');
    
    for (let i = 1; i < sortedReviews.length; i++) {
      const reviewDate = new Date(sortedReviews[i].createdAt || '');
      const daysDiff = Math.floor((currentDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        streak++;
        currentDate = reviewDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getMostReviewedLanguage = () => {
    if (!userReviews) return 'N/A';
    const languageCount: Record<string, number> = {};
    
    userReviews.forEach(review => {
      const lang = review.movie.language;
      languageCount[lang] = (languageCount[lang] || 0) + 1;
    });
    
    return Object.entries(languageCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  };

  const sentimentRatio = userStats ? 
    userStats.totalReviews > 0 ? (userStats.positiveReviews / userStats.totalReviews) * 100 : 0 
    : 0;

  return (
    <div className="min-h-screen bg-[var(--cinema-dark)] text-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold mb-4">Your Cinema Journey</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover insights about your movie taste and review patterns with AI-powered analytics.
          </p>
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex gap-2">
            {(['all', 'week', 'month'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={selectedTimeframe === timeframe 
                  ? "bg-[var(--cinema-gold)] text-black"
                  : "border-gray-600 text-gray-300 hover:bg-[var(--cinema-gray)]"
                }
              >
                <Clock className="w-4 h-4 mr-1" />
                {timeframe === 'all' ? 'All Time' : `Past ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[var(--cinema-gray)] to-[var(--cinema-dark)] border-gray-700 hover:border-[var(--cinema-gold)] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Reviews Written</p>
                  <p className="text-3xl font-bold text-[var(--cinema-gold)]">
                    {userStats?.totalReviews || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total contributions</p>
                </div>
                <Film className="text-[var(--cinema-gold)] w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--cinema-gray)] to-[var(--cinema-dark)] border-gray-700 hover:border-green-500 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Movies Liked</p>
                  <p className="text-3xl font-bold text-green-400">
                    {userStats?.positiveReviews || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Positive sentiment</p>
                </div>
                <Heart className="text-green-400 w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--cinema-gray)] to-[var(--cinema-dark)] border-gray-700 hover:border-red-500 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Review Streak</p>
                  <p className="text-3xl font-bold text-[var(--cinema-gold)]">
                    {getReviewStreak()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Reviews in sequence</p>
                </div>
                <TrendingUp className="text-[var(--cinema-gold)] w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--cinema-gray)] to-[var(--cinema-dark)] border-gray-700 hover:border-blue-500 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Top Language</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {getMostReviewedLanguage()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Most reviewed</p>
                </div>
                <Award className="text-blue-400 w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Genre Preferences */}
          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-playfair font-bold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-[var(--cinema-gold)]" />
                Genre Preferences
              </h3>
              
              {getGenreDistribution().length > 0 ? (
                <div className="space-y-4">
                  {getGenreDistribution().map(([genre, data]) => (
                    <div key={genre} className="bg-[var(--cinema-dark)] rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{genre}</span>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            data.sentiment === 'positive' ? 'bg-green-600' :
                            data.sentiment === 'negative' ? 'bg-red-600' : 'bg-gray-600'
                          } text-white`}
                        >
                          {data.count} reviews
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        {data.sentiment === 'positive' ? (
                          <ThumbsUp className="w-4 h-4 text-green-400 mr-2" />
                        ) : data.sentiment === 'negative' ? (
                          <ThumbsDown className="w-4 h-4 text-red-400 mr-2" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <span className="text-sm text-gray-400">
                          {data.sentiment === 'positive' ? 'You love this genre!' :
                           data.sentiment === 'negative' ? 'Not your favorite' : 'Mixed feelings'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Start reviewing movies to see your genre preferences!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[var(--cinema-gray)] border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-playfair font-bold mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-[var(--cinema-gold)]" />
                Recent Activity
              </h3>
              
              {getRecentActivity().length > 0 ? (
                <div className="space-y-4">
                  {getRecentActivity().map((review) => (
                    <div key={review.id} className="bg-[var(--cinema-dark)] rounded-lg p-4 border border-gray-600 hover:border-[var(--cinema-gold)] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white truncate">{review.movie.title}</h4>
                        <span className="text-sm text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(review.createdAt!)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {review.sentiment === 'positive' ? (
                            <ThumbsUp className="w-4 h-4 text-green-400 mr-2" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-red-400 mr-2" />
                          )}
                          <span className="text-sm text-gray-300">
                            {review.sentiment === 'positive' ? 'Liked' : 'Disliked'}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {review.movie.language}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity. Start reviewing movies!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Analysis Insights */}
        {userStats && userStats.totalReviews > 0 && (
          <Card className="bg-[var(--cinema-gray)] border-gray-700 mt-8">
            <CardContent className="p-6">
              <h3 className="text-2xl font-playfair font-bold mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-[var(--cinema-gold)]" />
                Your Cinema Personality
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[var(--cinema-dark)] rounded-lg border border-gray-600">
                  <div className="text-3xl font-bold text-[var(--cinema-gold)] mb-2">
                    {sentimentRatio.toFixed(0)}%
                  </div>
                  <p className="text-gray-400 text-sm">Positivity Rate</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {sentimentRatio > 70 ? "You're an optimistic viewer!" :
                     sentimentRatio > 50 ? "You have balanced taste" :
                     "You're a critical reviewer"}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-[var(--cinema-dark)] rounded-lg border border-gray-600">
                  <div className="text-3xl font-bold text-[var(--cinema-gold)] mb-2">
                    {Math.round((userStats.totalReviews * 120) / 60)}h
                  </div>
                  <p className="text-gray-400 text-sm">Watch Time Est.</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on reviewed movies
                  </p>
                </div>
                
                <div className="text-center p-4 bg-[var(--cinema-dark)] rounded-lg border border-gray-600">
                  <div className="text-3xl font-bold text-[var(--cinema-gold)] mb-2">
                    {getGenreDistribution().length}
                  </div>
                  <p className="text-gray-400 text-sm">Genres Explored</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Diverse movie taste
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}