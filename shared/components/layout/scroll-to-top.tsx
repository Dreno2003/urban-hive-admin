"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Set scroll restoration to manual to prevent browser's native scroll restoration
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }

    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Handle browser back/forward buttons
    window.addEventListener("popstate", handleScrollToTop);

    return () => {
      window.removeEventListener("popstate", handleScrollToTop);
    };
  }, []);

  useEffect(() => {
    // Force scroll to top on pathname changes (for regular navigation)
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    handleScrollToTop();

    // Use multiple delayed triggers to override Next.js routing / rendering cycle
    const timeoutId = setTimeout(handleScrollToTop, 10);
    const frameId = requestAnimationFrame(handleScrollToTop);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  return null;
}
