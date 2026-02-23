import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CommunicationCard, CommunicationCardData } from "./CommunicationCard";

interface SortableCardProps {
  id: string;
  card: CommunicationCardData;
  onRemove: () => void;
}

export function SortableCard({ id, card, onRemove }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CommunicationCard
        card={card}
        size="small"
        onRemove={onRemove}
      />
    </div>
  );
}
