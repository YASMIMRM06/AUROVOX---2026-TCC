import { cn } from "@/lib/utils";

export type CategoryType = "all" | "favorites" | "actions" | "feelings" | "objects" | "places" | "people" | "animals" | "food";

interface Category {
  id: CategoryType;
  label: string;
  icon: string;
}

const categories: Category[] = [
  { id: "all", label: "Todos", icon: "🏠" },
  { id: "favorites", label: "Favoritos", icon: "❤️" },
  { id: "actions", label: "Ações", icon: "🏃" },
  { id: "feelings", label: "Sentimentos", icon: "💖" },
  { id: "objects", label: "Objetos", icon: "🎒" },
  { id: "places", label: "Lugares", icon: "🏫" },
  { id: "people", label: "Pessoas", icon: "👨‍👩‍👧" },
  { id: "animals", label: "Animais", icon: "🐾" },
  { id: "food", label: "Comida", icon: "🍎" },
];

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <nav
      className="flex flex-wrap gap-2 p-2 justify-center"
      role="tablist"
      aria-label="Categorias de comunicação"
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          role="tab"
          aria-selected={activeCategory === category.id}
          aria-controls={`panel-${category.id}`}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200",
            "hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <span role="img" aria-hidden="true" className="text-lg">
            {category.icon}
          </span>
          {category.label}
        </button>
      ))}
    </nav>
  );
}
