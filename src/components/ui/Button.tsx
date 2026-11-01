import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "white"
  | "outlineLight";

type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string; // ✅ href প্রপ যোগ করা হলো
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-sm shadow-teal-900/10 hover:bg-brand-dark",
  secondary: "bg-brand-soft text-brand-dark hover:bg-teal-100/80",
  outline: "border border-line bg-white text-ink hover:border-brand/40 hover:text-brand",
  ghost: "text-ink hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  white: "bg-white text-brand-dark shadow-sm hover:bg-brand-soft",
  outlineLight: "border border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  // ✅ যদি href থাকে, তবে Link রেন্ডার করবে
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button; 