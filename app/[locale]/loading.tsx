import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function LoadingPage() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="p-6 rounded-lg shadow-md w-1/3 items-center justify-center flex gap-2 animate-pulse">
        <Loader2 className="animate-spin" />
        <span>{t("Loading.Loading")}</span>
      </div>
    </div>
  );
}
