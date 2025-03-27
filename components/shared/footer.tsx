"use client";
import {
  ChevronUp,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSettingStore from "@/hooks/use-setting-store";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { i18n } from "@/i18n-config";
import XIcon from "@/public/icons/x.png";
import Tiktok from "@/public/icons/tiktok.png";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    setting: { site },
  } = useSettingStore();
  const { locales } = i18n;
  const locale = useLocale();
  const t = useTranslations();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent("Hello, ShoePedi!");

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "#";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "#";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 max-w-7xl mx-auto">
        {/* Column 1: Get to Know Us */}
        <div>
          <h3 className="font-bold mb-4">{t("Footer.Get to Know Us")}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/FAQs" className="hover:text-gray-300">
                {t("Footer.FAQs")}
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-gray-300">
                {t("Footer.Blogs")}
              </Link>
            </li>
            <li>
              <Link href="/page/about-us" className="hover:text-gray-300">
                {t("Footer.About name", { name: site.name })}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={20} />
              <span>Mon - Sat | 9:00 AM - 7:00 PM</span>
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
              <Link
                href="/page/become-affiliate"
                className="hover:text-gray-300"
              >
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
            <li>
              <Link
                href="/page/shoe-size-guide"
                className="hover:text-gray-300"
              >
                {t("Footer.Size Guide (Shoes)")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Media Links */}
        <div>
          <h3 className="font-bold mb-4">Follow us</h3>
          <ul className="flex items-center gap-3 flex-wrap">
            <li>
              <Link
                href={instagramUrl}
                target="_blank"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <Instagram size={20} className="text-pink-400" />
              </Link>
            </li>
            <li>
              <Link
                href={facebookUrl}
                target="_blank"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <Facebook size={20} className="text-blue-500" />
              </Link>
            </li>

            <li>
              <Link
                href={twitterUrl}
                target="_blank"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <Image
                  src={XIcon}
                  alt="x.com"
                  width={16}
                  height={16}
                  className="bg-white rounded-sm"
                />
              </Link>
            </li>

            <li>
              <Link
                href={tiktokUrl}
                target="_blank"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <Image
                  src={Tiktok}
                  alt="Tiktok"
                  width={24}
                  height={24}
                  className="rounded-sm"
                />
              </Link>
            </li>
          </ul>
          <div className="my-2">
            <Link
              href="mailto:info@shoepedi.co.ke"
              className="hover:text-gray-300 flex items-center gap-1"
            >
              <Mail size={20} className="text-gray-500" />
              info@shoepedi.co.ke
            </Link>
          </div>
          <div className="my-2">
            <Link
              href={whatsappLink}
              target="_blank"
              className="hover:text-gray-300 flex items-center gap-1"
            >
              <MessageCircle size={20} className="text-green-500" />
              Ask on WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 flex flex-wrap items-center justify-center md:justify-between gap-y-4">
          {/* Logo and Language Selection */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
            <Link href="/">
              <Image
                src={site.logo}
                alt={`${site.name} logo`}
                width={48}
                height={48}
                unoptimized
                className="w-12 h-auto"
              />
            </Link>
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
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
            <Link
              href="/page/conditions-of-use"
              className="hover:text-gray-300"
            >
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
          <div className="flex flex-col items-center md:items-start text-sm text-gray-400">
            <div className="text-center">{site.address}</div>
            <div className="text-center">{site.phone}</div>
          </div>

          {/* Copyright */}
          <div className="text-center w-full">{site.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
