import { User, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="w-full bg-card border-b border-border px-6 py-4 safe-area-top">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/favicon.png" alt="AUROVOX" className="w-12 h-12 rounded-2xl shadow-md" />
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              AUROVOX
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Comunicação para todos que precisam de voz
            </p>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button variant="outline" size="sm" className="rounded-xl gap-2">
                <User className="w-4 h-4" /> Perfil
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" /> Sair
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm" className="rounded-xl gap-2">
              <LogIn className="w-4 h-4" /> Entrar
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}