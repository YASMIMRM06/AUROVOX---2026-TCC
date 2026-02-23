import { Bot } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-card border-b border-border px-6 py-4 safe-area-top">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-muted-foreground bg-muted-foreground">
            <Bot className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              AUROVOX
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Comunicação Suplementar e Alternativa
            </p>
          </div>
        </div>
      </div>
    </header>);

}