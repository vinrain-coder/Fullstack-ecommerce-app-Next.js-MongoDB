import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
