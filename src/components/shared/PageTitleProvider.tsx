"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    let title = "BookNook | Home";

    if (pathname === "/") title = "BookNook | Home";
    else if (pathname === "/books") title = "BookNook | All Books";
    else if (pathname === "/login") title = "BookNook | Login";
    else if (pathname === "/register") title = "BookNook | Register";
    else if (pathname === "/add-book") title = "BookNook | Add Book";
    else if (pathname === "/my-books") title = "BookNook | My Books";
    else if (pathname === "/my-borrows") title = "BookNook | My Borrows";
    else if (pathname === "/profile") title = "BookNook | My Profile";
    else if (pathname.startsWith("/books/")) title = "BookNook | Book Details";
    else title = "BookNook | Page Not Found";

    document.title = title;
  }, [pathname]);

  return <>{children}</>;
}