import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { PriceIndicator } from "./price-indicator";

type RestaurantCardProps = {
  name: string;
  imgUrl: string;
  desc: string;
  menu: {
    mealName: string;
    mealPrice: string;
    diets: string[];
  }[];
  onClick: () => void;
}

export const RestaurantCard = ({name, imgUrl, desc, menu, onClick}: RestaurantCardProps) => (
  <Card
    className="overflow-hidden h-full transition-all hover:shadow-lg"
    onClick={onClick}
  >
    <div className="flex items-center justify-center h-48 mt-1 w-full">
      <Image
        className="rounded-md"
        src={`https://www.unica.fi${imgUrl}?preset=medium`}
        alt="restaurant name"
        width={200}
        height={200}
      />
    </div>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">
          {name}
        </h3>
      </div>
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
);
