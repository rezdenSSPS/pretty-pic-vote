import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadDialogProps {
  onUpload: (images: { image1: string; image2: string }) => void;
}

export const UploadDialog = ({ onUpload }: UploadDialogProps) => {
  const [image1, setImage1] = useState<string>("");
  const [image2, setImage2] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: (img: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!image1 || !image2) {
      toast.error("Please select both images");
      return;
    }
    onUpload({ image1, image2 });
    setOpen(false);
    toast.success("Images uploaded successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload New Pictures
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Your Own Pictures</DialogTitle>
          <DialogDescription>
            Choose two images to compare. Images will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Picture 1</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
              {image1 ? (
                <img src={image1} alt="Preview 1" className="w-full h-48 object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p className="text-sm">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImage1)}
                className="hidden"
                id="image1"
              />
              <label htmlFor="image1" className="cursor-pointer">
                <Button type="button" variant="secondary" className="mt-2" asChild>
                  <span>Choose Image</span>
                </Button>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Picture 2</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
              {image2 ? (
                <img src={image2} alt="Preview 2" className="w-full h-48 object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p className="text-sm">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImage2)}
                className="hidden"
                id="image2"
              />
              <label htmlFor="image2" className="cursor-pointer">
                <Button type="button" variant="secondary" className="mt-2" asChild>
                  <span>Choose Image</span>
                </Button>
              </label>
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full mt-4" size="lg">
          Start Voting
        </Button>
      </DialogContent>
    </Dialog>
  );
};
