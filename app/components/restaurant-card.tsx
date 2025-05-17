import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PriceIndicator } from "./price-indicator";

type RestaurantCardProps = {
  name: string;
  desc: string;
  menu: {
    name: string;
    diet: string[];
    recipeId: number;
    iconUrl: string;
  }[];
  onClick: () => void;
}

export const RestaurantCard = ({name, desc, menu, onClick}: RestaurantCardProps) => (
  <Card
    className="overflow-hidden h-full transition-all hover:shadow-lg"
    onClick={onClick}
  >
    <div className="relative h-48 w-full">
      <Image
        src="/restaurant-placeholder.svg"
        alt="restaurant name"
        width={384}
        height={192}
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
