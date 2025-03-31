"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/reset-password");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isAuthPage && <Header />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isAdminPage && !isAuthPage && <Footer />}
    </div>
  );
}
