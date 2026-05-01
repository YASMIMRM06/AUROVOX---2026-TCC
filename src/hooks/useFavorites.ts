import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("favorite_cards")
      .select("card_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setFavoriteIds(new Set(data.map((f: any) => f.card_id)));
    }
    setLoading(false);
  };

  const toggleFavorite = useCallback(async (cardId: string) => {
    if (!user) {
      toast.error("Faça login para favoritar cards.");
      return;
    }

    const isFav = favoriteIds.has(cardId);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(cardId);
      else next.add(cardId);
      return next;
    });

    if (isFav) {
      const { error } = await supabase
        .from("favorite_cards")
        .delete()
        .eq("user_id", user.id)
        .eq("card_id", cardId);

      if (error) {
        // Revert
        setFavoriteIds((prev) => new Set(prev).add(cardId));
        toast.error("Erro ao remover favorito.");
      }
    } else {
      const { error } = await supabase
        .from("favorite_cards")
        .insert({ user_id: user.id, card_id: cardId });

      if (error) {
        // Revert
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(cardId);
          return next;
        });
        toast.error("Erro ao favoritar.");
      }
    }
  }, [user, favoriteIds]);

  const isFavorite = useCallback((cardId: string) => favoriteIds.has(cardId), [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite, loading };
}
