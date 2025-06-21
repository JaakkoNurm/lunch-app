import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { PriceIndicator } from "./price-indicator"
import { CommentSection } from "./comment-section"
import { cn } from "@/app/utils/cn"

type ExpandedCardProps = {
  id: number;
  name: string;
  imgBytes: string;
  desc: string;
  menu: {
    mealName: string;
    mealPrice: string;
    diets: string[];
  }[];
  className?: string;
}

export const ExpandedCard = ({ id, name, imgBytes, desc, menu, className }: ExpandedCardProps) => (
  <Card
    className={cn("w-full max-w-[60%] max-h-[80vh] overflow-y-auto", className)}
  >
    <Image
      className="rounded ml-auto mr-auto mt-4"
      src={`data:image/jpeg;base64,${imgBytes}`}
      alt="restaurant name"
      width={480}
      height={240}
    />
    <CardContent>
      <h2 className="text-2xl font-bold mt-8">
        {name}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {desc}
      </p>
      <p>
        Today's lunch
      </p>
      <ul className="list-disc list-inside mt-2">
        {menu.map((item) => (
          <li key={item.mealName}>
            {item.mealName}: {item.mealPrice}
          </li>
        ))}
      </ul>
      <CommentSection
        restaurantId={id}
        comments={[]}
        onAddComment={(comment) => {}}
        onDeleteComment={(commentId) => {}}
      />
    </CardContent>
    <CardFooter className="px-4 py-3 border-t bg-muted/30">
      <div className="flex justify-between w-full text-sm">
        <PriceIndicator value={2} />
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
          <span className="text-sm font-medium">{3.45.toFixed(1)}</span>
        </div>
      </div>
    </CardFooter>
  </Card>
)