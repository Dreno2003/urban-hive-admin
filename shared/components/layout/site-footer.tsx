"use client"
import Link from "next/link";
import { SiteFooterBanner } from "./site-footer-banner";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";

/** 
 * Routes where the SiteFooter should not be displayed.
 * Paths should be specified without the locale prefix (e.g., use "/signup" instead of "/en/signup").
 */
const HIDDEN_FOOTER_ROUTES = [
  "/signup",
  "/signin",
  "/forgot-password",
  // "/reset-password",
  "/s/",
];


const ROUTE_WITH_MAROON_BANNER = [
  '/space',
  '/checkout',
  '/favorites',
  "/settings",
  '/terms',
  '/privacy',
  '/cancellation',
  '/faqs',


]


const ROUTE_WITH_YELLOW_BANNER = [
  '/'
]

const ROUTE_DEEM_BACKGROUND_BANNER = [
  "/settings",
  '/checkout', '/favorites', '/terms',
  '/privacy',
  '/cancellation',
  '/faqs',
]
export function SiteFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isMaroonBanner = ROUTE_WITH_MAROON_BANNER.some((route) => {
    // Normalize path by removing locale prefix (e.g., /en/signup -> /signup)
    const normalizedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
    return normalizedPath.startsWith(route);
  });

  const isYellowBanner = ROUTE_WITH_YELLOW_BANNER.some((route) => {
    // Normalize path by removing locale prefix (e.g., /en/signup -> /signup)
    const normalizedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
    return normalizedPath.startsWith(route);
  });

  const isDeemBackgroundBanner = ROUTE_DEEM_BACKGROUND_BANNER.some((route) => {
    // Normalize path by removing locale prefix (e.g., /en/signup -> /signup)
    const normalizedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
    return normalizedPath.startsWith(route);
  });

  // const isSearchPage = pathname.includes("/s");
  // const isMobile = useIsMobile()

  // Logic to hide footer on specific routes
  const shouldHideFooter = HIDDEN_FOOTER_ROUTES.some((route) => {
    // Normalize path by removing locale prefix (e.g., /en/signup -> /signup)
    const normalizedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
    return normalizedPath.startsWith(route);
  });


  // if(sho)
  if (shouldHideFooter) {
    return null;
  }

  return (
    <div>
      <footer className={cn("flex h-[238px] md:h-[242px] w-full items-center justify-center bg-white", isDeemBackgroundBanner && "bg-gray-50")}>
        <div className="container-wrapper w-full">
          <div className='bg-muted relative -top-7 md:-top-10 w-full h-px' />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex w-full flex-col items-center gap-4d md:flex-row">
              <div className=" flex text-[13px] md:text-sm  flex-wrap items-center md:justify-center gap-4 ">
                <span className="text-secondary-foreground">
                  © {currentYear} The urban hive, Inc.
                </span>
                <Link
                  href="/privacy"
                  className="text-secondary-foreground hover:text-primary-500"
                >
                  Privacy policy
                </Link>

                <div className="size-[3px] shrink-0 rounded-full bg-secondary-foreground" />

                <Link
                  href="/terms"
                  className="text-secondary-foreground hover:text-primary-500"
                >
                  Terms and conditions
                </Link>

                <div className="size-[3px] shrink-0 rounded-full bg-secondary-foreground" />

                <Link
                  href="/cancellation"
                  className="text-secondary-foreground hover:text-primary-500"
                >
                  Cancellation policy
                </Link>

                <div className="size-[3px] shrink-0 rounded-full bg-secondary-foreground" />

                <Link
                  href="/faqs"
                  className="text-secondary-foreground hover:text-primary-500"
                >
                  FAQs
                </Link>
              </div>
            </div>

            <div className="text-[13px] md:text-sm order-3 flex items-center gap-4 md:order-3">
              <Link
                href="#"
                aria-label="Twitter"
                className="text-secondary-foreground hover:text-primary-500"
              >
                Twitter
              </Link>

              <div className="size-[3px] shrink-0 rounded-full bg-secondary-foreground" />

              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-secondary-foreground hover:text-primary-500"
              >
                LinkedIn
              </Link>

              <div className="size-[3px] shrink-0 rounded-full bg-secondary-foreground" />

              <Link
                href="#"
                aria-label="Instagram"
                className="text-secondary-foreground hover:text-primary-500"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <SiteFooterBanner variant={isMaroonBanner ? 'maroon' : isYellowBanner ? 'yellow' : 'yellow'} />
    </div>
  );
}
