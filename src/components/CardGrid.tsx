import { CommunicationCard, CommunicationCardData } from "./CommunicationCard";
import { CategoryType } from "./CategoryTabs";

interface CardGridProps {
  cards: CommunicationCardData[];
  activeCategory: CategoryType;
  selectedCards: string[];
  onCardClick: (card: CommunicationCardData) => void;
}

export function CardGrid({
  cards,
  activeCategory,
  selectedCards,
  onCardClick,
}: CardGridProps) {
  const filteredCards =
    activeCategory === "all"
      ? cards
      : cards.filter((card) => card.category === activeCategory);

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4"
      role="tabpanel"
      id={`panel-${activeCategory}`}
      aria-label={`Cards da categoria ${activeCategory}`}
    >
      {filteredCards.map((card) => (
        <CommunicationCard
          key={card.id}
          card={card}
          isSelected={selectedCards.includes(card.id)}
          onClick={() => onCardClick(card)}
        />
      ))}
    </div>
  );
}
