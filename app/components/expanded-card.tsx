import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PriceIndicator } from "./price-indicator"

type ExpandedCardProps = {
  name: string;
  desc: string;
  menu: {
    name: string;
    diet: string[];
    recipeId: number;
    iconUrl: string;
  }[];
}

export const ExpandedCard = ({ name, desc, menu }: ExpandedCardProps) => (
  <Card
    className="w-full max-w-[60%] max-h-[80vh] overflow-y-auto"
  >
    <Image
      className="rounded ml-auto mr-auto mt-4"
      src="/restaurant-placeholder.svg"
      alt="restaurant name"
      width={480}
      height={240}
    />
    <CardContent>
      <h2 className="text-2xl font-bold mt-8 mb-4">
        {name}
      </h2>
      <p>
        Today's lunch
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {desc}
      </p>
      <ul className="list-disc list-inside mt-4">
        {menu.map((item) => (
          <li key={item.name}>
            {item.name}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="px-4 py-3 border-t bg-muted/30">
      <div className="flex justify-between w-full text-sm">
        <PriceIndicator value={2} />
        <span>reviews</span>
      </div>
    </CardFooter>
  </Card>
)