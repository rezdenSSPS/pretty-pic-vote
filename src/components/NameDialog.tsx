import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface NameDialogProps {
  open: boolean;
  onSubmit: (name: string) => void;
}

export const NameDialog = ({ open, onSubmit }: NameDialogProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Welcome!
          </DialogTitle>
          <DialogDescription>
            Please enter your name to start voting. This helps track votes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <Button type="submit" className="w-full" disabled={!name.trim()}>
            Start Voting
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
