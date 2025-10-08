import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadDialogProps {
  onUpload: (file: File) => void;
}

export const UploadDialog = ({ onUpload }: UploadDialogProps) => {
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    onUpload(file);
    setOpen(false);
    setImage("");
    setFile(null);
    toast.success("Uploading image...");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload New Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Choose an image to add to the voting options.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
            {image ? (
              <img src={image} alt="Preview" className="w-full h-64 object-cover rounded" />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p className="text-sm">Click to upload</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Button type="button" variant="secondary" className="mt-2" asChild>
                <span>Choose Image</span>
              </Button>
            </label>
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full mt-4" size="lg" disabled={!file}>
          Add to Voting
        </Button>
      </DialogContent>
    </Dialog>
  );
};
