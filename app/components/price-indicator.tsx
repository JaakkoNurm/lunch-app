import { cn } from "@/lib/utils"

type PriceIndicatorProps = {
    value: 1 | 2 | 3;
    className?: string;
}

export const PriceIndicator = ({ value, className }: PriceIndicatorProps) => (
  <div className={cn("flex items-center", className)}>
    <span className="sr-only">
      Price level: {value === 1 ? "Inexpensive" : value === 2 ? "Moderate" : "Expensive"}
    </span>
    <div className="flex items-center">
      <span className={cn("text-sm font-medium", value >= 1 ? "text-foreground" : "text-muted-foreground/40")}>
        €
      </span>
      <span className={cn("text-sm font-medium", value >= 2 ? "text-foreground" : "text-muted-foreground/40")}>
        €
      </span>
      <span className={cn("text-sm font-medium", value >= 3 ? "text-foreground" : "text-muted-foreground/40")}>
        €
      </span>
    </div>
  </div>
);
