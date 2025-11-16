'use client';

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Returns a back navigation handler that prefers browser history.
 * Falls back to pushing the provided path (defaulting to /surat-masuk)
 * when there is no previous entry (e.g. preview opened in a new tab).
 */
export function useBackNavigation(defaultFallback = "/surat-masuk") {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useCallback(() => {
    const fromParam = searchParams?.get("from");
    const fallbackPath = fromParam === "surat-masuk" ? "/surat-masuk" : defaultFallback;

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackPath);
  }, [router, searchParams, defaultFallback]);
}
