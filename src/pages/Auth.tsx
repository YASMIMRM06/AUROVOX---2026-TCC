// ============================================================
// Auth.tsx — Página de Login, Cadastro e Esqueci a Senha
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

type AuthMode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/profile", { replace: true });
    return null;
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setForgotSent(false);
  };

  // ----------------------------------------------------------
  // LOGIN e CADASTRO
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      if (!name.trim()) {
        toast.error("Por favor, insira seu nome.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres.");
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Cadastro realizado! Verifique seu email para confirmar.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error("Email ou senha inválidos.");
      } else {
        navigate("/profile", { replace: true });
      }
    }

    setLoading(false);
  };

  // ----------------------------------------------------------
  // ESQUECI A SENHA — usa o template customizado do Supabase
  // ----------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Por favor, insira seu email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setForgotSent(true);
    }
  };

  // ----------------------------------------------------------
  // TÍTULOS DINÂMICOS
  // ----------------------------------------------------------
  const title =
    mode === "login" ? "Entrar" :
    mode === "signup" ? "Criar Conta" :
    "Recuperar Senha";

  const subtitle =
    mode === "login" ? "Comunicação para todos que precisam de voz" :
    mode === "signup" ? "Preencha seus dados para se cadastrar" :
    "Informe seu email e enviaremos um link de recuperação";

  // ----------------------------------------------------------
  // RENDERIZAÇÃO
  // ----------------------------------------------------------
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* CABEÇALHO */}
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

          {/* TÍTULO */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>

          {/* ---- MODO: ESQUECI A SENHA — tela de confirmação ---- */}
          {mode === "forgot" && forgotSent ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-primary/10 rounded-full p-5">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Email enviado!</p>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de recuperação para{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Verifique sua caixa de entrada (e a pasta de spam).
                </p>
                <p className="text-xs text-muted-foreground">O link expira em 1 hora.</p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setForgotSent(false)}
                >
                  Reenviar email
                </Button>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Voltar ao login
                </button>
              </div>
            </div>

          ) : mode === "forgot" ? (
            /* ---- MODO: ESQUECI A SENHA — formulário ---- */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  maxLength={255}
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl h-12 text-base font-bold gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                ) : (
                  <>
                    <Mail className="w-5 h-5" /> Enviar link de recuperação
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Voltar ao login
                </button>
              </div>
            </form>

          ) : (
            /* ---- MODO: LOGIN ou CADASTRO ---- */
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      maxLength={100}
                      className="rounded-xl"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    maxLength={255}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Senha
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    maxLength={128}
                    className="rounded-xl"
                  />
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Confirmar Senha
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      required
                      minLength={6}
                      maxLength={128}
                      className="rounded-xl"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl h-12 text-base font-bold gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                  ) : mode === "signup" ? (
                    <>
                      <UserPlus className="w-5 h-5" /> Cadastrar
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" /> Entrar
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <button
                  type="button"
                  onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === "signup" ? "Já tem conta? Entrar" : "Não tem conta? Cadastrar"}
                </button>

                {mode === "login" && (
                  <div>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}