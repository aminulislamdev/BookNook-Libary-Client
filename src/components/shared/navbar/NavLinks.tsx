import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  links: { name: string; href: string }[];
};

export default function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="hidden items-center gap-7 lg:flex">
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-2 text-sm font-medium transition-colors",
              active ? "text-brand" : "text-slate-600 hover:text-brand",
            )}
          >
            {link.name}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-brand transition-all duration-200",
                active ? "w-full opacity-100" : "w-0 opacity-0",
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}