"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/Toast";
import { Input, Label } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AvatarUpload from "./AvatarUpload";

export default function ProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Profile"
      description="Update your display name and profile picture."
    >
      {open && user && <ProfileForm key={user.email} user={user} onClose={onClose} />}
    </Modal>
  );
}

function ProfileForm({
  user,
  onClose,
}: {
  user: { name?: string | null; image?: string | null; email?: string | null };
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsUpdating(true);
    await authClient.updateUser(
      { name: name.trim(), image: image.trim() },
      {
        onSuccess: async () => {
          toast.success("Profile updated successfully!");
          await authClient.getSession();
          onClose();
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to update profile.");
        },
      }
    );
    setIsUpdating(false);
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-5 pt-2">
      <AvatarUpload image={image} onImageChange={setImage} />

      <div>
        <Label htmlFor="profile-name">Full Name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <Label>Email Address</Label>
        <Input value={user?.email || ""} disabled readOnly className="cursor-not-allowed bg-surface-muted" />
        <p className="mt-1.5 text-xs text-muted">Email cannot be changed.</p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}