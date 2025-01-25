"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitedPages = useRef<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (btnType: string) => {
    if (isLoading) return; // Prevent multiple clicks during navigation
    setIsLoading(true);

    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    // Scroll to top only for newly visited pages
    if (btnType === "next" && !visitedPages.current.has(pageValue)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    visitedPages.current.add(pageValue); // Mark the page as visited

    // Navigate to the new page
    router.push(newUrl, { scroll: false }).finally(() => {
      setIsLoading(false); // Reset loading state after navigation
    });
  };

  const t = useTranslations();

  useEffect(() => {
    // Enable browser scroll restoration for revisited pages
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "auto";
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="lg"
        variant="outline"
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1 || isLoading}
        className="w-24"
      >
        {isLoading && Number(page) <= 1 ? (
          "..."
        ) : (
          <>
            <ChevronLeft /> {t("Search.Previous")}
          </>
        )}
      </Button>
      {t("Search.Page")} {page} {t("Search.of")} {totalPages}
      <Button
        size="lg"
        variant="outline"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages || isLoading}
        className="w-24"
      >
        {isLoading && Number(page) >= totalPages ? (
          "..."
        ) : (
          <>
            {t("Search.Next")} <ChevronRight />
          </>
        )}
      </Button>
    </div>
  );
};

export default Pagination;
