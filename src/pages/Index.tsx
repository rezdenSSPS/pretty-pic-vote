import { useState, useEffect } from "react";
import { VotingCard } from "@/components/VotingCard";
import { UploadDialog } from "@/components/UploadDialog";
import { NameDialog } from "@/components/NameDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import floralBg from "@/assets/floral-background.jpg";

interface VotingImage {
  id: string;
  image_url: string;
  vote_count: number;
  uploaded_at: string;
}

const Index = () => {
  const [images, setImages] = useState<VotingImage[]>([]);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [voterName, setVoterName] = useState<string>("");
  const [showNameDialog, setShowNameDialog] = useState(false);

  useEffect(() => {
    const savedVoterId = localStorage.getItem("voter_id");
    const savedVoterName = localStorage.getItem("voter_name");
    
    if (savedVoterId && savedVoterName) {
      setVoterId(savedVoterId);
      setVoterName(savedVoterName);
    } else {
      setShowNameDialog(true);
    }

    fetchImages();
    subscribeToImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("voting_images")
      .select("*")
      .order("vote_count", { ascending: false });

    if (error) {
      toast.error("Failed to load images");
      console.error(error);
    } else {
      setImages(data || []);
    }
  };

  const subscribeToImages = () => {
    const channel = supabase
      .channel("voting-images-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "voting_images",
        },
        () => {
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleNameSubmit = async (name: string) => {
    const { data, error } = await supabase
      .from("voters")
      .insert({ name })
      .select()
      .single();

    if (error) {
      toast.error("Failed to save name");
      console.error(error);
    } else {
      setVoterId(data.id);
      setVoterName(name);
      localStorage.setItem("voter_id", data.id);
      localStorage.setItem("voter_name", name);
      setShowNameDialog(false);
      toast.success(`Welcome, ${name}!`);
    }
  };

  const handleVote = async (imageId: string) => {
    if (!voterId) {
      toast.error("Please enter your name first");
      setShowNameDialog(true);
      return;
    }

    await supabase
      .from("votes")
      .insert({ voter_id: voterId, image_id: imageId });

    const { error: incrementError } = await supabase.rpc("increment_vote_count", {
      image_uuid: imageId,
    });

    if (incrementError) {
      console.error(incrementError);
    } else {
      toast.success("Vote counted!", { duration: 1500 });
    }
  };

  const handleReset = async () => {
    const password = window.prompt("Enter password to reset:");
    if (password !== "Denis") {
      toast.error("Incorrect password!");
      return;
    }

    const { error: votesError } = await supabase.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: imagesError } = await supabase
      .from("voting_images")
      .update({ vote_count: 0 })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (votesError || imagesError) {
      toast.error("Failed to reset");
      console.error(votesError || imagesError);
    } else {
      toast.success("All votes reset!");
    }
  };

  const handleUpload = async (file: File) => {
    if (!voterId) {
      toast.error("Please enter your name first");
      setShowNameDialog(true);
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("voting-images")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Failed to upload image");
      console.error(uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("voting-images")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("voting_images")
      .insert({ image_url: publicUrl });

    if (insertError) {
      toast.error("Failed to add image");
      console.error(insertError);
    } else {
      toast.success("Image added to voting!");
    }
  };

  const totalVotes = images.reduce((sum, img) => sum + img.vote_count, 0);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mb-8">
          {images.map((image) => (
            <VotingCard
              key={image.id}
              image={image.image_url}
              votes={image.vote_count}
              onVote={() => handleVote(image.id)}
              isWinning={image.vote_count === Math.max(...images.map(img => img.vote_count)) && image.vote_count > 0}
            />
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center text-muted-foreground mb-8">
            <p className="text-lg">No images yet. Upload the first one!</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <UploadDialog onUpload={handleUpload} />
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Votes
          </Button>
        </div>

        <NameDialog
          open={showNameDialog}
          onSubmit={handleNameSubmit}
        />
      </div>
    </div>
  );
};

export default Index;
