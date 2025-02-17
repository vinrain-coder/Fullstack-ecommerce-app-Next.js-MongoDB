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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 max-w-7xl mx-auto">
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
          </ul>
        </div>

        {/* Column 4: Social Media Links */}
        <div>
          <h3 className="font-bold mb-4">Follow us</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="https://www.instagram.com/yourprofile"
                target="_blank"
                className="hover:text-gray-300 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 40 48"
                >
                  <radialGradient
                    id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                    cx="19.38"
                    cy="42.035"
                    r="44.899"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stop-color="#fd5"></stop>
                    <stop offset=".328" stop-color="#ff543f"></stop>
                    <stop offset=".348" stop-color="#fc5245"></stop>
                    <stop offset=".504" stop-color="#e64771"></stop>
                    <stop offset=".643" stop-color="#d53e91"></stop>
                    <stop offset=".761" stop-color="#cc39a4"></stop>
                    <stop offset=".841" stop-color="#c837ab"></stop>
                  </radialGradient>
                  <path
                    fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                    d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                  ></path>
                  <radialGradient
                    id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                    cx="11.786"
                    cy="5.54"
                    r="29.813"
                    gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stop-color="#4168c9"></stop>
                    <stop
                      offset=".999"
                      stop-color="#4168c9"
                      stop-opacity="0"
                    ></stop>
                  </radialGradient>
                  <path
                    fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                    d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                  ></path>
                  <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                  <path
                    fill="#fff"
                    d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                  ></path>
                </svg>
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="https://www.facebook.com/yourprofile"
                target="_blank"
                className="hover:text-gray-300 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#039be5"
                    d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                  ></path>
                </svg>
                Facebook
              </Link>
            </li>

            <li>
              <Link
                href="https://www.tiktok.com/@yourprofile"
                target="_blank"
                className="hover:text-gray-300 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <linearGradient
                    id="dYJkfAQNfP2dCzgdw4ruIa_fdfLpA6fsXN2_gr1"
                    x1="23.672"
                    x2="23.672"
                    y1="6.365"
                    y2="42.252"
                    gradientTransform="translate(.305 -.206)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stop-color="#4c4c4c"></stop>
                    <stop offset="1" stop-color="#343434"></stop>
                  </linearGradient>
                  <path
                    fill="url(#dYJkfAQNfP2dCzgdw4ruIa_fdfLpA6fsXN2_gr1)"
                    d="M40.004,41.969L8.031,42c-1.099,0.001-1.999-0.897-2-1.996L6,8.031	c-0.001-1.099,0.897-1.999,1.996-2L39.969,6c1.099-0.001,1.999,0.897,2,1.996L42,39.969C42.001,41.068,41.103,41.968,40.004,41.969z"
                  ></path>
                  <path
                    fill="#ec407a"
                    fill-rule="evenodd"
                    d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011	c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413	c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413V20.607L29.208,20.607z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561L30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1	c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391	C17.213,29.127,17.972,30.274,19.079,30.832z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    fill="#fff"
                    fill-rule="evenodd"
                    d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157	c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923V28.79c-0.007,1.867-1.523,3.379-3.393,3.379	c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391	c0.359,0,0.705,0.056,1.03,0.159v-3.19c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183	c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63L28.034,19.63z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    fill="#81d4fa"
                    fill-rule="evenodd"
                    d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848	C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019	c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338	c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069	c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183	C14.374,24.749,17.611,21.463,21.635,21.38z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                TikTok
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
          <div className="text-center text-sm text-gray-400">
            {site.address} | {site.phone}
          </div>
        </div>
      </div>
    </footer>
  );
}
