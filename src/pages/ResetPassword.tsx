// ============================================================
// ResetPassword.tsx — Página de Redefinição de Senha
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
    setCheckingToken(false);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        setCheckingToken(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Validações visuais
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (!passwordsMatch) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      if (error.message.includes("expired") || error.message.includes("invalid")) {
        toast.error("Link expirado. Solicite um novo email de recuperação.");
      } else {
        toast.error(error.message);
      }
    } else {
      setSuccess(true);
    }
  };

  // ----------------------------------------------------------
  // TELA: Verificando token
  // ----------------------------------------------------------
  if (checkingToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // ----------------------------------------------------------
  // TELA: Link inválido ou expirado
  // ----------------------------------------------------------
  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="w-full bg-card border-b border-border px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <img src="/favicon.png" alt="AUROVOX" className="w-10 h-10 rounded-2xl" />
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">AUROVOX</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 shadow-lg text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-destructive/10 rounded-full p-5">
                <KeyRound className="w-10 h-10 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Link inválido ou expirado</h2>
              <p className="text-sm text-muted-foreground">
                Este link de recuperação não é mais válido. Links expiram após 1 hora
                ou após serem usados uma vez.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => navigate("/auth")}
                className="w-full rounded-xl h-12 font-bold"
              >
                Solicitar novo link
              </Button>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------
  // TELA: Sucesso
  // ----------------------------------------------------------
  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="w-full bg-card border-b border-border px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <img src="/favicon.png" alt="AUROVOX" className="w-10 h-10 rounded-2xl" />
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">AUROVOX</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 shadow-lg text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-500/10 rounded-full p-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Senha atualizada!</h2>
              <p className="text-sm text-muted-foreground">
                Sua senha foi redefinida com sucesso. Você já pode usar a nova senha para entrar.
              </p>
            </div>

            <Button
              onClick={() => navigate("/profile", { replace: true })}
              className="w-full rounded-xl h-12 font-bold"
            >
              Ir para meu perfil
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------
  // TELA: Formulário de nova senha
  // ----------------------------------------------------------
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <img src="/favicon.png" alt="AUROVOX" className="w-10 h-10 rounded-2xl" />
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">AUROVOX</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Nova Senha</h2>
            <p className="text-muted-foreground mt-2">Escolha uma senha segura para sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo NOVA SENHA */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  maxLength={128}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Checklist de força */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <StrengthItem ok={hasMinLength} label="Pelo menos 6 caracteres" />
                  <StrengthItem ok={hasUpperCase} label="Uma letra maiúscula" />
                  <StrengthItem ok={hasNumber} label="Um número" />
                </div>
              )}
            </div>

            {/* Campo CONFIRMAR SENHA */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  minLength={6}
                  maxLength={128}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="mt-2">
                  <StrengthItem ok={passwordsMatch} label="Senhas coincidem" />
                </div>
              )}
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              disabled={loading || !hasMinLength || !passwordsMatch}
              className="w-full rounded-xl h-12 text-base font-bold gap-2 mt-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
              ) : (
                <>
                  <KeyRound className="w-5 h-5" /> Atualizar Senha
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

// Componente auxiliar de checklist
function StrengthItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${ok ? "text-green-500" : "text-muted-foreground"}`}>
      <div
        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
          ok ? "bg-green-500 border-green-500" : "border-muted-foreground"
        }`}
      >
        {ok && (
          <svg viewBox="0 0 12 12" className="w-2 h-2 fill-white">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {label}
    </div>
  );
}