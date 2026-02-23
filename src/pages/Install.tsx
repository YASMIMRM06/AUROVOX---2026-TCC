import { useState, useEffect } from "react";
import { Download, Smartphone, Tablet, Monitor, Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
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
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-card border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AUROVOX</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        {isInstalled ? (
          /* Already Installed */
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground">
              AUROVOX já está instalado!
            </h1>
            <p className="text-lg text-muted-foreground">
              Você pode acessar o app diretamente da tela inicial do seu dispositivo.
            </p>
            <Link
              to="/"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-full",
                "bg-primary text-primary-foreground font-bold text-lg",
                "hover:scale-105 active:scale-95 transition-transform"
              )}
            >
              Abrir AUROVOX
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Installation Instructions */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold text-foreground">
                Instalar AUROVOX
              </h1>
              <p className="text-lg text-muted-foreground">
                Use o AUROVOX offline, como um app nativo!
              </p>
            </div>

            {/* Benefits */}
            <div className="grid gap-4">
              {[
                { icon: "📱", title: "Acesso rápido", desc: "Abra direto da tela inicial" },
                { icon: "📶", title: "Funciona offline", desc: "Sem precisar de internet" },
                { icon: "🚀", title: "Carrega instantâneo", desc: "Performance de app nativo" },
                { icon: "🔔", title: "Tela cheia", desc: "Sem barras do navegador" },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
                >
                  <span className="text-3xl">{benefit.icon}</span>
                  <div>
                    <h3 className="font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Install Button or Instructions */}
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl",
                  "bg-primary text-primary-foreground font-bold text-xl shadow-lg",
                  "hover:scale-105 active:scale-95 transition-transform"
                )}
              >
                <Download className="w-6 h-6" />
                Instalar Agora
              </button>
            ) : isIOS ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground text-center">
                  Como instalar no iPhone/iPad:
                </h2>
                <ol className="space-y-4">
                  {[
                    "Toque no botão de compartilhar (📤)",
                    'Role e toque em "Adicionar à Tela de Início"',
                    'Toque em "Adicionar"',
                  ].map((step, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span className="text-foreground font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="text-center space-y-4 p-6 rounded-2xl bg-muted">
                <p className="text-muted-foreground">
                  Aguarde alguns segundos. O botão de instalação aparecerá automaticamente.
                </p>
                <p className="text-sm text-muted-foreground">
                  Ou acesse pelo menu do navegador → "Instalar app"
                </p>
              </div>
            )}

            {/* Supported Devices */}
            <div className="flex justify-center gap-8 pt-4">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Smartphone className="w-8 h-8" />
                <span className="text-xs">Celular</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Tablet className="w-8 h-8" />
                <span className="text-xs">Tablet</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Monitor className="w-8 h-8" />
                <span className="text-xs">Computador</span>
              </div>
            </div>

            {/* Back to App */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="text-primary font-semibold hover:underline"
              >
                ← Voltar para o AUROVOX
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
