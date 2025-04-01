import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col p-4">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
