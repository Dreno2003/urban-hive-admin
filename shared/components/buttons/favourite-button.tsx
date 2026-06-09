import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

interface FavouriteButtonProps {
    isLiked: boolean,
    onLikeToggle: () => void,
    // size: number
}
export function FavouriteButton({ isLiked, onLikeToggle, }: FavouriteButtonProps) {
    return (<>

        <Button
            variant={'secondary'}
            size={'icon'}
            onClick={onLikeToggle}
            className=" flex items-center justify-center !p-5.5 text-secondary-foreground hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
        >
            {isLiked ? <Icon
                name="heart3"
                size={20}
                className={`transition-all ${isLiked ? "text-red-500 110" : "text-secondary-foreground"}`}
            /> :
                <Icon
                    name="heart"
                    size={20}
                    className={`transition-all ${isLiked ? "text-primary fill-primary scale-110" : "text-secondary-foreground"}`}
                />}
        </Button>
    </>
    )
}