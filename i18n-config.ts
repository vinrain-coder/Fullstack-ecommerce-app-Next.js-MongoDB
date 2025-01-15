export const i18n = {
  locales: [
    { code: "en-US", name: "English", icon: "🇺🇸" },
    { code: "fr", name: "Français", icon: "🇫🇷" },
    { code: "sw", name: "Swahili", icon: "sw" },
    { code: "ar", name: "العربية", icon: "🇸🇦" },
  ],
  defaultLocale: "en-KE",
};

export const getDirection = (locale: string) => {
  return locale === "ar" ? "rtl" : "ltr";
};
export type I18nConfig = typeof i18n;
export type Locale = I18nConfig["locales"][number];
