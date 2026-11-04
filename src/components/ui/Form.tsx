import { ChevronDown } from "lucide-react";
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink shadow-sm transition placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block text-sm font-semibold text-ink", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-28 resize-y py-3", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(fieldBase, "h-11 appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-sm text-danger" role="alert">
      {children}
    </p>
  );
}
