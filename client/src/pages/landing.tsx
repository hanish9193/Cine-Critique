import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Play, Star, Brain, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cinema-dark)] via-[var(--cinema-gray)] to-[var(--cinema-dark)]">
      {/* Navigation */}
      <nav className="bg-[var(--cinema-gray)]/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="text-[var(--cinema-gold)] text-2xl" />
              <h1 className="text-2xl font-playfair font-bold text-white">CineReview</h1>
            </div>
            <Button 
              onClick={handleSignIn}
              className="bg-[var(--cinema-gold)] text-black hover:bg-yellow-400 font-semibold"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-[var(--cinema-gold)] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-[var(--cinema-gold)] rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-[var(--cinema-gold)] rounded-full"></div>
        </div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight text-white">
            Review Movies with 
            <span className="text-[var(--cinema-gold)]"> AI Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of movie reviews with our custom-trained sentiment analysis model. 
            Share your thoughts on Indian cinema and get instant AI-powered sentiment insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleSignIn}
              className="bg-[var(--cinema-gold)] text-black px-8 py-4 text-lg hover:bg-yellow-400 font-semibold"
              size="lg"
            >
              <Play className="mr-2" />
              Start Reviewing
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-[var(--cinema-gold)] text-[var(--cinema-gold)] px-8 py-4 text-lg hover:bg-[var(--cinema-gold)] hover:text-black"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-[var(--cinema-gray)]/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4 text-white">Why Choose CineReview?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover the power of AI-driven movie analysis and connect with fellow cinema enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[var(--cinema-dark)] border-gray-700">
              <CardContent className="p-6 text-center">
                <Brain className="text-[var(--cinema-gold)] text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-playfair font-bold mb-2 text-white">AI Sentiment Analysis</h3>
                <p className="text-gray-400">
                  Get instant sentiment analysis of your reviews with our custom-trained model based on IMDB dataset.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--cinema-dark)] border-gray-700">
              <CardContent className="p-6 text-center">
                <Film className="text-[var(--cinema-gold)] text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-playfair font-bold mb-2 text-white">Indian Cinema Focus</h3>
                <p className="text-gray-400">
                  Explore movies from Tamil, Telugu, Hindi, and English cinema all in one platform.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--cinema-dark)] border-gray-700">
              <CardContent className="p-6 text-center">
                <TrendingUp className="text-[var(--cinema-gold)] text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-playfair font-bold mb-2 text-white">Personal Insights</h3>
                <p className="text-gray-400">
                  Track your review history and discover your movie preferences with detailed analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--cinema-gold)] mb-2">94.2%</div>
              <p className="text-gray-300">Model Accuracy</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--cinema-gold)] mb-2">50K+</div>
              <p className="text-gray-300">Training Reviews</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--cinema-gold)] mb-2">&lt;100ms</div>
              <p className="text-gray-300">Response Time</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--cinema-gold)] mb-2">4</div>
              <p className="text-gray-300">Languages Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--cinema-dark)] border-t border-gray-700 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Film className="text-[var(--cinema-gold)] text-2xl" />
                <h3 className="text-xl font-playfair font-bold text-white">CineReview</h3>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered movie review platform for Indian cinema enthusiasts.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Movie Reviews</li>
                <li>Sentiment Analysis</li>
                <li>User Dashboard</li>
                <li>Recommendations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Languages</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Tamil Movies</li>
                <li>Telugu Movies</li>
                <li>Hindi Movies</li>
                <li>English Movies</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <p className="text-gray-400 text-sm">
                Join our community of movie enthusiasts and discover your next favorite film.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 CineReview. All rights reserved. | Powered by AI Sentiment Analysis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
