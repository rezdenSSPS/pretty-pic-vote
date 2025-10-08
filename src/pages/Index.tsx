import { useState, useEffect } from "react";
import { VotingCard } from "@/components/VotingCard";
import { UploadDialog } from "@/components/UploadDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import floralBg from "@/assets/floral-background.jpg";

const STORAGE_KEY = "voting-data";

interface VotingData {
  votes1: number;
  votes2: number;
  image1?: string;
  image2?: string;
}

const Index = () => {
  const [votingData, setVotingData] = useState<VotingData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { votes1: 0, votes2: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votingData));
  }, [votingData]);

  const handleVote1 = () => {
    setVotingData((prev) => ({ ...prev, votes1: prev.votes1 + 1 }));
    toast.success("Vote counted!", { duration: 1500 });
  };

  const handleVote2 = () => {
    setVotingData((prev) => ({ ...prev, votes2: prev.votes2 + 1 }));
    toast.success("Vote counted!", { duration: 1500 });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all votes?")) {
      setVotingData({ votes1: 0, votes2: 0, image1: votingData.image1, image2: votingData.image2 });
      toast.success("Votes reset!");
    }
  };

  const handleUpload = (images: { image1: string; image2: string }) => {
    setVotingData({ votes1: 0, votes2: 0, image1: images.image1, image2: images.image2 });
  };

  const totalVotes = votingData.votes1 + votingData.votes2;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${floralBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Which is Prettier?
            </h1>
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">
            Cast your vote and see the results!
          </p>
          {totalVotes > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Total votes: <span className="font-semibold text-foreground">{totalVotes}</span>
            </p>
          )}
        </header>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-8">
          <VotingCard
            image={votingData.image1 || photo1}
            votes={votingData.votes1}
            onVote={handleVote1}
            isWinning={votingData.votes1 > votingData.votes2}
          />
          <VotingCard
            image={votingData.image2 || photo2}
            votes={votingData.votes2}
            onVote={handleVote2}
            isWinning={votingData.votes2 > votingData.votes1}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <UploadDialog onUpload={handleUpload} />
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Votes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
