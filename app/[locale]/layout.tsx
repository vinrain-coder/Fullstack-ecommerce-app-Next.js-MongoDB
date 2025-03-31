import { Lora } from "next/font/google";
import "../globals.css";
import ClientProviders from "@/components/shared/client-providers";
import { getDirection } from "@/i18n-config";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getSetting } from "@/lib/actions/setting.actions";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
// import ProductToast from "@/components/shared/product/product-toast";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting();

  const title = `${name} | ${slogan}`;
  const imageUrl = `${url}/opengraph-image.jpg`;

  return {
    title: {
      template: `%s | ${name}`,
      default: title,
    },
    description,
    metadataBase: new URL(url),
    openGraph: {
      title,
      description,
      url,
      siteName: name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - ${slogan}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const setting = await getSetting();
  const currencyCookie = (await cookies()).get("currency");
  const currency = currencyCookie ? currencyCookie.value : "KES";

  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={getDirection(locale) === "rtl" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen ${lora.className} antialiased leading-relaxed tracking-wide`}
      >
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientProviders setting={{ ...setting, currency }}>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex flex-col">{children}</main>
                <Footer />
              </div>
            </ClientProviders>
          </NextIntlClientProvider>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
        {/* <ProductToast /> */}
      </body>
    </html>
  );
}
