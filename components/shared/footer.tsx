"use client";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSettingStore from "@/hooks/use-setting-store";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { i18n } from "@/i18n-config";
import { Facebook, Instagram, Twitter, TikTok, YouTube } from "lucide-react"; // Import social media icons

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    setting: { site },
  } = useSettingStore();
  const { locales } = i18n;
  const locale = useLocale();
  const t = useTranslations();

  return (
    <footer className="bg-black text-white underline-link">
      {/* Back to Top Button */}
      <div className="w-full">
        <Button
          variant="ghost"
          className="bg-gray-800 w-full rounded-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          {t("Footer.Back to top")}
        </Button>
      </div>

      {/* Main Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">
        {/* Column 1: Get to Know Us */}
        <div>
          <h3 className="font-bold mb-4">{t("Footer.Get to Know Us")}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/careers" className="hover:text-gray-300">
                {t("Footer.Careers")}
              </Link>
            </li>
            <li>
              <Link href="/page/blog" className="hover:text-gray-300">
                {t("Footer.Blog")}
              </Link>
            </li>
            <li>
              <Link href="/page/about-us" className="hover:text-gray-300">
                {t("Footer.About name", { name: site.name })}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Make Money with Us */}
        <div>
          <h3 className="font-bold mb-4">{t("Footer.Make Money with Us")}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/sell" className="hover:text-gray-300">
                {t("Footer.Sell products on", { name: site.name })}
              </Link>
            </li>
            <li>
              <Link href="/page/become-affiliate" className="hover:text-gray-300">
                {t("Footer.Become an Affiliate")}
              </Link>
            </li>
            <li>
              <Link href="/page/advertise" className="hover:text-gray-300">
                {t("Footer.Advertise Your Products")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Let Us Help You */}
        <div>
          <h3 className="font-bold mb-4">{t("Footer.Let Us Help You")}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/shipping" className="hover:text-gray-300">
                {t("Footer.Shipping Rates & Policies")}
              </Link>
            </li>
            <li>
              <Link href="/page/returns-policy" className="hover:text-gray-300">
                {t("Footer.Returns & Replacements")}
              </Link>
            </li>
            <li>
              <Link href="/page/help" className="hover:text-gray-300">
                {t("Footer.Help")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Language Selection */}
          <div className="flex items-center space-x-6">
            <Image
              src="/icons/logo.svg"
              alt={`${site.name} logo`}
              width={48}
              height={48}
              className="w-12"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <Select
              value={locale}
              onValueChange={(value) => {
                router.push(pathname, { locale: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Footer.Select a language")} />
              </SelectTrigger>
              <SelectContent>
                {locales.map((lang, index) => (
                  <SelectItem key={index} value={lang.code}>
                    <span className="text-lg">{lang.icon}</span> {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <Link href="/page/conditions-of-use" className="hover:text-gray-300">
              {t("Footer.Conditions of Use")}
            </Link>
            <Link href="/page/privacy-policy" className="hover:text-gray-300">
              {t("Footer.Privacy Notice")}
            </Link>
            <Link href="/page/help" className="hover:text-gray-300">
              {t("Footer.Help")}
            </Link>
          </div>

          {/* Address and Contact */}
          <div className="text-center text-sm text-gray-400">
            {site.address} | {site.phone}
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6 text-lg mt-4">
            <Link href="https://www.instagram.com/yourprofile" target="_blank" className="hover:text-gray-300">
              <Instagram />
            </Link>
            <Link href="https://www.facebook.com/yourprofile" target="_blank" className="hover:text-gray-300">
              <Facebook />
            </Link>
            <Link href="https://twitter.com/yourprofile" target="_blank" className="hover:text-gray-300">
              <Twitter />
            </Link>
            <Link href="https://www.tiktok.com/@yourprofile" target="_blank" className="hover:text-gray-300">
              <TikTok />
            </Link>
            <Link href="https://www.youtube.com/c/yourprofile" target="_blank" className="hover:text-gray-300">
              <YouTube />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
