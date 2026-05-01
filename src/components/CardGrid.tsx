import { CommunicationCard, CommunicationCardData } from "./CommunicationCard";
import { CategoryType } from "./CategoryTabs";

interface CardGridProps {
  cards: CommunicationCardData[];
  activeCategory: CategoryType;
  selectedCards: string[];
  onCardClick: (card: CommunicationCardData) => void;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (cardId: string) => void;
}

export function CardGrid({
  cards,
  activeCategory,
  selectedCards,
  onCardClick,
  favoriteIds,
  onToggleFavorite,
}: CardGridProps) {
  const filteredCards =
    activeCategory === "all"
      ? cards
      : activeCategory === "favorites"
        ? cards.filter((card) => favoriteIds?.has(card.id))
        : cards.filter((card) => card.category === activeCategory);

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4"
      role="tabpanel"
      id={`panel-${activeCategory}`}
      aria-label={`Cards da categoria ${activeCategory}`}
    >
      {filteredCards.length === 0 && activeCategory === "favorites" ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <p className="text-lg font-semibold">Nenhum favorito ainda</p>
          <p className="text-sm mt-1">Toque no ❤️ dos cards para favoritar</p>
        </div>
      ) : (
        filteredCards.map((card) => (
          <CommunicationCard
            key={card.id}
            card={card}
            isSelected={selectedCards.includes(card.id)}
            isFavorite={favoriteIds?.has(card.id)}
            onClick={() => onCardClick(card)}
            onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(card.id) : undefined}
          />
        ))
      )}
    </div>
  );
}
