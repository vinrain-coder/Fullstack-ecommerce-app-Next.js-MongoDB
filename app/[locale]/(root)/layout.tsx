import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Suspense } from "react";
import Loader from "@/components/shared/Loader";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={<Loader />}>
        <main className="flex-1 flex flex-col p-4">{children}</main>
      </Suspense>
      <Footer />
    </div>
  );
}
