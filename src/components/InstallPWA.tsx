import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner after a delay to not interrupt user
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowBanner(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50",
        "bg-card border-2 border-primary/30 rounded-2xl shadow-xl",
        "p-4 flex items-center gap-4",
        "animate-in slide-in-from-bottom-4 duration-300"
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Smartphone className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-sm">
          Instalar AUROVOX
        </h3>
        <p className="text-xs text-muted-foreground">
          Use offline no seu tablet ou celular!
        </p>
      </div>

      <button
        onClick={handleInstall}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-primary text-primary-foreground font-semibold text-sm",
          "hover:scale-105 active:scale-95 transition-transform"
        )}
      >
        <Download className="w-4 h-4" />
        Instalar
      </button>

      <button
        onClick={handleDismiss}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fechar"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
