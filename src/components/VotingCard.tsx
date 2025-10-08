import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface VotingCardProps {
  image: string;
  votes: number;
  onVote: () => void;
  isWinning: boolean;
}

export const VotingCard = ({ image, votes, onVote, isWinning }: VotingCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = () => {
    setIsAnimating(true);
    onVote();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/95 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative">
      {isWinning && votes > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          Leading!
        </div>
      )}
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={image}
          alt="Voting option"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-6 text-center space-y-4">
        <div className="text-4xl font-bold text-primary">{votes}</div>
        <p className="text-muted-foreground">votes</p>
        <Button
          onClick={handleVote}
          className={`w-full text-lg py-6 transition-all duration-300 ${
            isAnimating ? "scale-110" : ""
          }`}
          size="lg"
        >
          <Heart className={`mr-2 h-5 w-5 ${isAnimating ? "fill-current animate-ping" : ""}`} />
          Vote for this one
        </Button>
      </div>
    </Card>
  );
};
