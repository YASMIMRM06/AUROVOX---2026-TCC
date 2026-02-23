import { useState, useCallback, useEffect } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getPortugueseVoice = useCallback(() => {
    // Priorizar vozes em português brasileiro
    const ptBrVoice = voices.find(
      (voice) =>
        voice.lang.includes("pt-BR") || voice.lang.includes("pt_BR")
    );
    if (ptBrVoice) return ptBrVoice;

    // Fallback para português de Portugal
    const ptVoice = voices.find((voice) => voice.lang.includes("pt"));
    if (ptVoice) return ptVoice;

    // Fallback para primeira voz disponível
    return voices[0];
  }, [voices]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;

      // Cancelar fala anterior se houver
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      const voice = getPortugueseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = "pt-BR";
      utterance.rate = 0.9; // Um pouco mais lento para melhor compreensão
      utterance.pitch = 1.1; // Tom ligeiramente mais alto (mais amigável)
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, getPortugueseVoice]
  );

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
  };
}
