import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { PhraseBuilder } from "@/components/PhraseBuilder";
import { CategoryTabs, CategoryType } from "@/components/CategoryTabs";
import { CardGrid } from "@/components/CardGrid";
import { CommunicationCardData } from "@/components/CommunicationCard";
import { AboutSection } from "@/components/AboutSection";
import { defaultCards } from "@/data/communicationCards";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

const Index = () => {
  const [phrase, setPhrase] = useState<CommunicationCardData[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const { speak, isSpeaking, isSupported } = useSpeechSynthesis();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const handleCardClick = useCallback((card: CommunicationCardData) => {
    setPhrase((prev) => [...prev, card]);
    
    if (isSupported) {
      speak(card.label);
    }
  }, [speak, isSupported]);

  const handlePhraseChange = useCallback((newPhrase: CommunicationCardData[]) => {
    setPhrase(newPhrase);
  }, []);

  const handleRemoveCard = useCallback((index: number) => {
    setPhrase((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setPhrase([]);
  }, []);

  const handleSpeak = useCallback(() => {
    if (phrase.length === 0) return;

    const fullText = phrase.map((card) => card.audioText || card.label).join(". ");
    
    if (isSupported) {
      speak(fullText);
      toast.success("Falando a mensagem!", {
        icon: "🔊",
        duration: 2000,
      });
    } else {
      toast.error("Síntese de voz não suportada neste navegador", {
        duration: 3000,
      });
    }
  }, [phrase, speak, isSupported]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Área de Montagem de Frase */}
        <section className="p-4 md:p-6" aria-label="Área de montagem de frase">
          <PhraseBuilder
            phrase={phrase}
            onPhraseChange={handlePhraseChange}
            onRemoveCard={handleRemoveCard}
            onClear={handleClear}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
          />
        </section>

        {/* Navegação por Categorias */}
        <section className="border-t border-b border-border bg-card/50 py-3">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* Grid de Cards */}
        <section 
          className="flex-1 overflow-auto pb-8 safe-area-bottom"
          aria-label="Cards de comunicação"
        >
          <CardGrid
            cards={defaultCards}
            activeCategory={activeCategory}
            selectedCards={phrase.map((p) => p.id)}
            onCardClick={handleCardClick}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        </section>
      </main>

      {/* Sobre o AUROVOX */}
      <AboutSection />

      {/* Aviso de suporte */}
      {!isSupported && (
        <div className="fixed bottom-4 left-4 right-4 bg-accent text-accent-foreground p-4 rounded-2xl text-center font-medium shadow-lg">
          ⚠️ Seu navegador não suporta síntese de voz. A funcionalidade de fala está desabilitada.
        </div>
      )}
    </div>
  );
};

export default Index;
