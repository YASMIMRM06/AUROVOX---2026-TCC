import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

export interface CommunicationCardData {
  id: string;
  label: string;
  icon: string;
  category: "actions" | "feelings" | "objects" | "places" | "people" | "food" | "animals";
  audioText?: string;
}

interface CommunicationCardProps {
  card: CommunicationCardData;
  isSelected?: boolean;
  isFavorite?: boolean;
  size?: "normal" | "small";
  onClick?: () => void;
  onRemove?: () => void;
  onToggleFavorite?: () => void;
}

const categoryColors: Record<string, string> = {
  actions: "category-actions",
  feelings: "category-feelings",
  objects: "category-objects",
  places: "category-places",
  people: "category-people",
  food: "category-food",
  animals: "category-animals",
};

const categoryBorderColors: Record<string, string> = {
  actions: "border-orange-300",
  feelings: "border-pink-300",
  objects: "border-blue-300",
  places: "border-green-300",
  people: "border-purple-300",
  food: "border-amber-300",
  animals: "border-teal-300",
};

export function CommunicationCard({
  card,
  isSelected = false,
  isFavorite = false,
  size = "normal",
  onClick,
  onRemove,
  onToggleFavorite,
}: CommunicationCardProps) {
  const isSmall = size === "small";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-3 cursor-pointer transition-all duration-200 select-none",
        "hover:scale-105 hover:shadow-lg",
        "active:scale-95",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",
        categoryColors[card.category],
        categoryBorderColors[card.category],
        isSelected && "ring-4 ring-primary shadow-lg scale-105 border-primary",
        isSmall ? "p-3 min-w-[80px] min-h-[80px]" : "p-4 min-w-[120px] min-h-[120px]"
      )}
      aria-label={card.label}
      aria-pressed={isSelected}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform"
          aria-label={`Remover ${card.label}`}
        >
          ×
        </button>
      )}
      {onToggleFavorite && !isSmall && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            "absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all",
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground/40 hover:text-red-400"
          )}
          aria-label={isFavorite ? `Remover ${card.label} dos favoritos` : `Favoritar ${card.label}`}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      )}
      <span
        className={cn(
          "flex items-center justify-center mb-2",
          isSmall ? "text-3xl" : "text-5xl"
        )}
        role="img"
        aria-hidden="true"
      >
        {card.icon}
      </span>
      <span
        className={cn(
          "font-bold text-center leading-tight text-foreground",
          isSmall ? "text-sm" : "text-base"
        )}
      >
        {card.label}
      </span>
    </button>
  );
}
