"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-row items-center gap-3 animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-lg">Loading, please wait...</p>
      </div>
    </div>
  );
}
