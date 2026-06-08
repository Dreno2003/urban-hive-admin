"use client"

import { cn } from "@/shared/lib/utils"
import { Logo } from "../ui/logo"





interface SiteFooterBannerProps {
  variant?: 'yellow' | 'maroon'
}
export function SiteFooterBanner({ variant = 'yellow' }: SiteFooterBannerProps) {
  return (
    <section className={cn(" h-[422px] flex items-center relative overflow-hidden  py-20 lg:py-28 ", variant === 'yellow' ? 'bg-supporting-yellow-500' : 'bg-[#622544]')}>
      {/* Pattern Overlay */}

      <div className='container-wrapper w-full'>

        <div
          className="hidden md:block absolute inset-0 opacity-95 pointer-events-none"
          style={{
            backgroundImage: variant === 'yellow' ? `url('/images/landing-page-images/yellow-pattern-lg.svg')` : "url('/images/landing-page-images/purple-pattern-sm.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: 'cover',
            // backgroundSize: '180px 180px',
            backgroundPosition: 'center'
          }}
          aria-hidden
        />


        <div
          className="md:hidden  rotate-180 scale-[340%] absolute inset-0 opacity-95 pointer-events-none"
          style={{
            backgroundImage: variant === 'yellow' ? `url('/images/landing-page-images/yellow-pattern-sm.svg')` : "url('/images/landing-page-images/purple-pattern-sm.svg')",

            // backgroundImage: "url('/images/landing-page-images/yellow-pattern-sm.svg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            // backgroundSize: '180px 180px',
            backgroundPosition: ''
          }}
          aria-hidden
        />


        <div className="   relative z-30 ">

          <Logo variant={variant === 'yellow' ? 'black' : 'white'} className='w-[168px]' />
        </div>
      </div>

    </section>
  )
}
