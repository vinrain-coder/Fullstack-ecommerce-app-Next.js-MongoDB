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

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting();
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name} | ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
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

  const { locale } = params;
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
              {children}
            </ClientProviders>
          </NextIntlClientProvider>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
