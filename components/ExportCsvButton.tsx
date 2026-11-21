
"use client";

import { Download } from "lucide-react";

export default function ExportCsvButton() {
  function handleExport() {
    const url = new URL(
      "/api/transactions/export",
      window.location.origin
    );

    // Giữ lại bộ lọc đang có trên URL.
    const currentParams = new URLSearchParams(
      window.location.search
    );

    for (const key of ["range", "type", "category", "q"]) {
      const value = currentParams.get(key);

      if (value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }

    window.location.assign(url.toString());
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="
        inline-flex items-center justify-center gap-2
        rounded-xl bg-teal-600 px-4 py-2.5
        text-sm font-semibold text-white
        shadow-sm transition-colors
        hover:bg-teal-700
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-teal-600
      "
    >
      <Download className="h-4 w-4" />
      Xuất CSV
    </button>
  );
}
