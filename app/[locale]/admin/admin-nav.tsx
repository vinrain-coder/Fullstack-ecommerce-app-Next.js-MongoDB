"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Pages",
    href: "/admin/web-pages",
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
];

export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const t = useTranslations("Admin");

  return (
    <nav
      className={cn(
        "flex items-center flex-wrap overflow-hidden gap-2 md:gap-4",
        className
      )}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 rounded-lg hover:text-primary active:bg-gray-300 transition duration-200", // Add padding and hover styles
            pathname.includes(item.href)
              ? "font-semibold text-primary"
              : "text-muted-foreground"
          )}
        >
          {t(item.title)}
        </Link>
      ))}
    </nav>
  );
}
