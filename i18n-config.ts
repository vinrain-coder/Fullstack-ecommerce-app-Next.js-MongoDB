export const i18n = {
  locales: [
    { code: "en-US", name: "English (US)", icon: "🇺🇸" },
    { code: "en-KE", name: "English (Kenya)", icon: "🇰🇪" }, // Added English (Kenya)
    { code: "fr", name: "Français", icon: "🇫🇷" },
    { code: "sw", name: "Swahili", icon: "🇰🇪" },
    { code: "ar", name: "العربية", icon: "🇸🇦" },
  ],
  defaultLocale: "en-KE", // Set English (Kenya) as the default locale
};

export const getDirection = (locale: string) => {
  return locale === "ar" ? "rtl" : "ltr";
};
export type I18nConfig = typeof i18n;
export type Locale = I18nConfig["locales"][number];
     
