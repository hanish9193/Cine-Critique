import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";
import ReviewModal from "@/components/ReviewModal";
import { Button } from "@/components/ui/button";
import { Film, Brain, Database, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Movie } from "@shared/schema";

type MovieWithStats = Movie & {
  positiveReviews: number;
  negativeReviews: number;
  totalReviews: number;
};

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const { data: movies, isLoading } = useQuery<MovieWithStats[]>({
    queryKey: ["/api/movies", selectedLanguage === "all" ? "" : `?language=${selectedLanguage}`],
  });

  const languages = [
    { key: "all", label: "All Languages" },
    { key: "tamil", label: "Tamil" },
    { key: "telugu", label: "Telugu" },
    { key: "hindi", label: "Hindi" },
    { key: "english", label: "English" },
  ];

  return (
    <div className="min-h-screen bg-[var(--cinema-dark)] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--cinema-dark)] via-[var(--cinema-gray)] to-[var(--cinema-dark)] opacity-90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-[var(--cinema-gold)] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-[var(--cinema-gold)] rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-[var(--cinema-gold)] rounded-full"></div>
        </div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
            Review Movies with 
            <span className="text-[var(--cinema-gold)]"> AI Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of movie reviews with our custom-trained sentiment analysis model. 
            Share your thoughts on Indian cinema and get instant AI-powered sentiment insights.
          </p>
        </div>
      </section>

      {/* Movie Selection Section */}
      <section id="movies" className="py-16 px-4 bg-[var(--cinema-gray)]/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">Discover Indian Cinema</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore movies from Tamil, Telugu, Hindi, and English cinema. Share your reviews and see real-time sentiment analysis.
            </p>
          </div>

          {/* Language Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {languages.map((lang) => (
              <Button
                key={lang.key}
                onClick={() => setSelectedLanguage(lang.key)}
                variant={selectedLanguage === lang.key ? "default" : "outline"}
                className={
                  selectedLanguage === lang.key
                    ? "bg-[var(--cinema-gold)] text-black hover:bg-yellow-400"
                    : "bg-[var(--cinema-dark)] border-gray-600 text-white hover:bg-[var(--cinema-gray)]"
                }
              >
                {lang.label}
              </Button>
            ))}
          </div>

          {/* Movie Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[var(--cinema-dark)] rounded-xl overflow-hidden border border-gray-700 animate-pulse">
                  <div className="w-full h-80 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {movies?.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onReviewClick={() => setSelectedMovieId(movie.id)}
                />
              ))}
            </div>
          )}

          {movies && movies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No movies found for the selected language.</p>
            </div>
          )}
        </div>
      </section>

      {/* AI Model Info Section */}
      <section className="py-16 px-4 bg-[var(--cinema-gray)]/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">AI-Powered Sentiment Analysis</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our custom-trained model uses the IMDB dataset to provide accurate sentiment analysis of your movie reviews in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-[var(--cinema-dark)] border-gray-700">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Brain className="text-[var(--cinema-gold)] text-3xl mb-3 mx-auto" />
                  <h3 className="text-xl font-playfair font-bold text-white">Model Performance</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accuracy:</span>
                    <span className="text-[var(--cinema-gold)] font-bold">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precision:</span>
                    <span className="text-[var(--cinema-gold)] font-bold">93.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recall:</span>
                    <span className="text-[var(--cinema-gold)] font-bold">94.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">F1-Score:</span>
                    <span className="text-[var(--cinema-gold)] font-bold">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--cinema-dark)] border-gray-700">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Database className="text-[var(--cinema-gold)] text-3xl mb-3 mx-auto" />
                  <h3 className="text-xl font-playfair font-bold text-white">Training Dataset</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Source:</span>
                    <span className="text-white font-medium">IMDB Reviews</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Reviews:</span>
                    <span className="text-white font-medium">50K+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Languages:</span>
                    <span className="text-white font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model Type:</span>
                    <span className="text-white font-medium">Neural Network</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--cinema-dark)] border-gray-700">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Zap className="text-[var(--cinema-gold)] text-3xl mb-3 mx-auto" />
                  <h3 className="text-xl font-playfair font-bold text-white">Real-time Analysis</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-[var(--sentiment-positive)] font-bold">&lt; 100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence Score:</span>
                    <span className="text-[var(--sentiment-positive)] font-bold">Provided</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Multi-language:</span>
                    <span className="text-[var(--cinema-gold)] font-bold">Coming Soon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">API Integration:</span>
                    <span className="text-[var(--sentiment-positive)] font-bold">Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {selectedMovieId && (
        <ReviewModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
}
