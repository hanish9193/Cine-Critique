import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { Movie } from "@shared/schema";

interface MovieCardProps {
  movie: Movie & {
    positiveReviews: number;
    negativeReviews: number;
    totalReviews: number;
  };
  onReviewClick: () => void;
}

export default function MovieCard({ movie, onReviewClick }: MovieCardProps) {
  return (
    <Card className="bg-[var(--cinema-dark)] rounded-xl overflow-hidden border border-gray-700 hover:border-[var(--cinema-gold)] transition-all duration-300 transform hover:scale-105">
      <img 
        src={movie.posterUrl || "https://images.unsplash.com/photo-1489599063536-f1b3c0fc71a4"} 
        alt={`${movie.title} movie poster`} 
        className="w-full h-80 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-playfair font-bold mb-2 text-white">{movie.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{movie.genre}</p>
        
        <div className="flex items-center justify-between mb-4">
          <Badge 
            variant="secondary" 
            className="bg-[var(--cinema-gold)] text-black hover:bg-yellow-400"
          >
            {movie.language.charAt(0).toUpperCase() + movie.language.slice(1)}
          </Badge>
          <span className="text-[var(--cinema-gold)] font-semibold">
            {movie.rating}/10
          </span>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <ThumbsUp className="text-[var(--sentiment-positive)] mr-1 w-4 h-4" />
                <span className="text-white">{movie.positiveReviews}</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="text-[var(--sentiment-negative)] mr-1 w-4 h-4" />
                <span className="text-white">{movie.negativeReviews}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onReviewClick}
          className="w-full bg-[var(--cinema-gold)] text-black hover:bg-yellow-400 font-medium"
        >
          Write Review
        </Button>
      </CardContent>
    </Card>
  );
}
