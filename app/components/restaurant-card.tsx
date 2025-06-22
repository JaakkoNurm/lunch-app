import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { PriceIndicator } from "./price-indicator";

type RestaurantCardProps = {
  name: string;
  imgBytes: string;
  desc: string;
  menu: {
    mealName: string;
    mealPrice: string;
    diets: string[];
  }[];
  onClick: () => void;
}

export const RestaurantCard = ({ name, imgBytes, desc, menu, onClick }: RestaurantCardProps) => (
  <Card
    className="overflow-hidden h-full transition-all hover:shadow-lg"
    onClick={onClick}
  >
    <div className="flex items-center justify-center h-48 mt-1 w-full">
      <Image
        className="rounded-md"
        src={`data:image/jpeg;base64,${imgBytes}`}
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
  </Card>
);
