import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartButton from "./cart-button";
import UserButton from "./user-button";
import ThemeSwitcher from "./theme-switcher";
import LanguageSwitcher from "./language-switcher";
import { useTranslations } from "next-intl";

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations();
  return (
    <div className="flex justify-end">
      <nav className="md:flex gap-3 hidden w-full">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>
      <nav className="md:hidden flex gap-1">
        {!forAdmin && <CartButton />}
        <Sheet>
          <SheetTrigger className="align-middle header-button">
            <MenuIcon className="h-7 w-7" />
          </SheetTrigger>
          <SheetContent className="bg-black text-white flex flex-col items-start">
            <SheetHeader className="w-full">
              <div className="flex items-center justify-between">
                <SheetTitle>{t("Header.Site Menu")}</SheetTitle>
                <SheetDescription></SheetDescription>
              </div>
            </SheetHeader>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <UserButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
