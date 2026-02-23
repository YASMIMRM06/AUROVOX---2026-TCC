import { Volume2, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableCard } from "./SortableCard";
import { CommunicationCardData } from "./CommunicationCard";
import { cn } from "@/lib/utils";

interface PhraseBuilderProps {
  phrase: CommunicationCardData[];
  onPhraseChange: (phrase: CommunicationCardData[]) => void;
  onRemoveCard: (index: number) => void;
  onClear: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

export function PhraseBuilder({
  phrase,
  onPhraseChange,
  onRemoveCard,
  onClear,
  onSpeak,
  isSpeaking,
}: PhraseBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = phrase.findIndex((_, i) => `phrase-${i}` === active.id);
      const newIndex = phrase.findIndex((_, i) => `phrase-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onPhraseChange(arrayMove(phrase, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Área da Frase com Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          className={cn(
            "flex items-center gap-3 p-6 rounded-3xl min-h-[140px] transition-all duration-300",
            "bg-phrase-area border-2 border-dashed border-secondary/40",
            phrase.length === 0 && "justify-center"
          )}
        >
          {phrase.length === 0 ? (
            <p className="text-muted-foreground text-lg font-medium text-center">
              Toque nos cards abaixo para montar sua frase 👇
            </p>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              {phrase.length > 1 && (
                <div className="flex items-center gap-1 text-muted-foreground mr-2">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Arraste para reordenar</span>
                </div>
              )}
              <SortableContext
                items={phrase.map((_, i) => `phrase-${i}`)}
                strategy={horizontalListSortingStrategy}
              >
                {phrase.map((card, index) => (
                  <SortableCard
                    key={`phrase-${index}`}
                    id={`phrase-${index}`}
                    card={card}
                    onRemove={() => onRemoveCard(index)}
                  />
                ))}
              </SortableContext>
            </div>
          )}
        </div>
      </DndContext>

      {/* Botões de Ação */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onClear}
          disabled={phrase.length === 0}
          className={cn(
            "flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-lg transition-all duration-200",
            "bg-muted text-muted-foreground",
            "hover:bg-muted/80 hover:scale-105",
            "active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
          aria-label="Limpar frase"
        >
          <Trash2 className="w-5 h-5" />
          Limpar
        </button>

        <button
          onClick={onSpeak}
          disabled={phrase.length === 0 || isSpeaking}
          className={cn(
            "flex items-center gap-3 px-8 py-5 rounded-full font-bold text-xl shadow-xl transition-all duration-200",
            "bg-secondary text-secondary-foreground",
            "hover:shadow-2xl hover:scale-105",
            "active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            isSpeaking && "animate-soft-pulse"
          )}
          aria-label="Falar frase"
        >
          <Volume2 className={cn("w-7 h-7", isSpeaking && "animate-pulse")} />
          {isSpeaking ? "Falando..." : "Falar"}
        </button>
      </div>
    </div>
  );
}
