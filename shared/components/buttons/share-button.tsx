import { useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

interface ShareButtonProps {
    handleShare?: () => void,
    // size: number
}
export function ShareButton({ handleShare }: ShareButtonProps) {
    const [_isCopied, setCopied] = useState(false)


    const ihandleShare = () => {
        if (handleShare) {
            handleShare()
        } else if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <>

            <Button
                onClick={ihandleShare}
                variant={'secondary'}
                className=" flex text-secondary-foreground items-center gap-2 px-4 py-2 text-sm font-semibold  hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
                <Icon name="link2" size={20} className="text-secondary-foreground" />
                <span className='text-secondary-foreground'>Share</span>
            </Button>
        </>
    )
}