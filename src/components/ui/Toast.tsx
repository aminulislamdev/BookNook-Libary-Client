"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // ৪ সেকেন্ড পর অটোমেটিক রিমুভ হবে
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toast = useMemo(
    () => ({
      success: (msg: string) => addToast("success", msg),
      error: (msg: string) => addToast("error", msg),
      info: (msg: string) => addToast("info", msg),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* টোস্ট কন্টেইনার */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-9999 flex max-w-md w-full flex-col gap-2.5 pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-all animate-fade-in",
              // ✅ লাইট ও ডার্ক মোডের জন্য কালার
              item.type === "success" &&
              "border-success-border bg-paper/95 text-success shadow-success/10",
              item.type === "error" &&
              "border-danger-border bg-paper/95 text-danger shadow-danger/10",
              item.type === "info" &&
              "border-info-border bg-paper/95 text-info shadow-info/10"
            )}
          >
            <div className="flex items-center gap-3">
              {item.type === "success" && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              )}
              {item.type === "error" && (
                <AlertCircle className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              )}
              {item.type === "info" && (
                <Info className="h-5 w-5 shrink-0 text-info" aria-hidden="true" />
              )}
              <p className="text-sm font-medium leading-snug">{item.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="rounded-lg p-1 text-muted transition hover:bg-surface-muted hover:text-ink"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}