"use client";

import type { ReactNode } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "primary",
  isLoading = false,
  error,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "primary" | "danger";
  isLoading?: boolean;
  error?: string;
  children?: ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      {children ? <div className="mb-5">{children}</div> : null}
      {error ? <Alert variant="error" className="mb-5">{error}</Alert> : null}
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="button"
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Please wait…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
