"use client";

import { useRef, useState } from "react";
import { Upload, User, Image as ImageIcon } from "lucide-react";
import { Input, Label } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";

export default function AvatarUpload({
  image,
  onImageChange,
}: {
  image: string;
  onImageChange: (url: string) => void;
}) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload image.");
      }

      onImageChange(data.data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      {/* প্রিভিউ */}
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-slate-100">
        {image ? (
          <Image src={image} alt="Profile" height={80} width={80} className=" object-cover" />
        ) : (
          <User className="h-8 w-8 text-slate-400" />
        )}
      </div>

      {/* ইনপুট এবং আপলোড বাটন */}
      <div className="w-full flex-1 space-y-2">
        <Label htmlFor="profile-image">Photo URL</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="profile-image"
              value={image}
              onChange={(e) => onImageChange(e.target.value)}
              placeholder="https://..."
              className="pl-9"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{isUploading ? "..." : "Upload"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}