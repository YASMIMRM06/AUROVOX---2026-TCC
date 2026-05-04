import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, LogOut, Save, Download, Edit, X, User, Brain, MessageCircle, Shield } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  name: string;
  email: string;
  has_tea: boolean;
  tea_level: string | null;
  other_disabilities: string;
  share_enabled: boolean;
  date_of_birth: string | null;
  gender: string | null;
  caregiver_name: string;
  phone: string;
  diagnosis: string;
  preferred_communication: string;
  blood_type: string;
  allergies: string;
  medications: string;
  emergency_contact: string;
  emergency_phone: string;
  address: string;
  institution: string;
  therapist_name: string;
  health_insurance: string;
  sensory_sensitivities: string;
  routine_notes: string;
  weight: string;
  height: string;
}

const defaultProfile: Profile = {
  name: "",
  email: "",
  has_tea: false,
  tea_level: null,
  other_disabilities: "",
  share_enabled: false,
  date_of_birth: null,
  gender: null,
  caregiver_name: "",
  phone: "",
  diagnosis: "",
  preferred_communication: "",
  blood_type: "",
  allergies: "",
  medications: "",
  emergency_contact: "",
  emergency_phone: "",
  address: "",
  institution: "",
  therapist_name: "",
  health_insurance: "",
  sensory_sensitivities: "",
  routine_notes: "",
  weight: "",
  height: "",
};

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Profile>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();

    if (error) {
      toast.error("Erro ao carregar perfil.");
      return;
    }
    const profileData: Profile = {
      ...defaultProfile,
      ...data,
      other_disabilities: data.other_disabilities ?? "",
      caregiver_name: data.caregiver_name ?? "",
      phone: data.phone ?? "",
      diagnosis: data.diagnosis ?? "",
      preferred_communication: data.preferred_communication ?? "",
      blood_type: (data as any).blood_type ?? "",
      allergies: (data as any).allergies ?? "",
      medications: (data as any).medications ?? "",
      emergency_contact: (data as any).emergency_contact ?? "",
      emergency_phone: (data as any).emergency_phone ?? "",
      address: (data as any).address ?? "",
      institution: (data as any).institution ?? "",
      therapist_name: (data as any).therapist_name ?? "",
      health_insurance: (data as any).health_insurance ?? "",
      sensory_sensitivities: (data as any).sensory_sensitivities ?? "",
      routine_notes: (data as any).routine_notes ?? "",
      weight: (data as any).weight ?? "",
      height: (data as any).height ?? "",
    };
    setProfile(profileData);
    setForm(profileData);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name.trim(),
        has_tea: form.has_tea,
        tea_level: form.has_tea ? form.tea_level : null,
        other_disabilities: form.other_disabilities.trim(),
        share_enabled: form.share_enabled,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        caregiver_name: form.caregiver_name.trim(),
        phone: form.phone.trim(),
        diagnosis: form.diagnosis.trim(),
        preferred_communication: form.preferred_communication.trim(),
        blood_type: form.blood_type.trim(),
        allergies: form.allergies.trim(),
        medications: form.medications.trim(),
        emergency_contact: form.emergency_contact.trim(),
        emergency_phone: form.emergency_phone.trim(),
        address: form.address.trim(),
        institution: form.institution.trim(),
        therapist_name: form.therapist_name.trim(),
        health_insurance: form.health_insurance.trim(),
        sensory_sensitivities: form.sensory_sensitivities.trim(),
        routine_notes: form.routine_notes.trim(),
        weight: form.weight.trim(),
        height: form.height.trim(),
      } as any)
      .eq("id", user!.id);

    if (error) {
      console.error("Save error:", error);
      toast.error("Erro ao salvar perfil.");
    } else {
      toast.success("Perfil atualizado com sucesso!");
      setProfile({ ...form });
      setEditing(false);
    }
    setSaving(false);
  };

  // ----------------------------------------------------------
  // EXPORTAÇÃO EM DUAS COLUNAS
  // ----------------------------------------------------------
  const handleExportAsImage = async () => {
    if (!profile) return;
    setExporting(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const width = 1000;
      const padding = 44;
      const colGap = 24;
      const colWidth = (width - padding * 2 - colGap) / 2;

      // ---- Monta seções ----
      type Field = { label: string; value: string };
      type Section = { title: string; fields: Field[] };

      const pessoais: Field[] = [];
      pessoais.push({ label: "Nome", value: profile.name || "—" });
      pessoais.push({ label: "Email", value: profile.email });
      if (profile.date_of_birth) pessoais.push({ label: "Nascimento", value: new Date(profile.date_of_birth + "T12:00:00").toLocaleDateString("pt-BR") });
      if (profile.gender) pessoais.push({ label: "Gênero", value: profile.gender });
      if (profile.phone) pessoais.push({ label: "Telefone", value: profile.phone });
      if (profile.weight) pessoais.push({ label: "Peso", value: profile.weight });
      if (profile.height) pessoais.push({ label: "Altura", value: profile.height });
      if (profile.address) pessoais.push({ label: "Endereço", value: profile.address });
      if (profile.caregiver_name) pessoais.push({ label: "Responsável / Cuidador", value: profile.caregiver_name });

      const emergencia: Field[] = [];
      if (profile.emergency_contact) emergencia.push({ label: "Nome", value: profile.emergency_contact });
      if (profile.emergency_phone) emergencia.push({ label: "Telefone", value: profile.emergency_phone });

      const clinicas: Field[] = [];
      clinicas.push({ label: "TEA", value: profile.has_tea ? `Sim${profile.tea_level ? ` — ${profile.tea_level}` : ""}` : "Não" });
      if (profile.diagnosis) clinicas.push({ label: "Diagnóstico", value: profile.diagnosis });
      if (profile.blood_type) clinicas.push({ label: "Tipo Sanguíneo", value: profile.blood_type });
      if (profile.allergies) clinicas.push({ label: "Alergias", value: profile.allergies });
      if (profile.medications) clinicas.push({ label: "Medicações", value: profile.medications });
      if (profile.health_insurance) clinicas.push({ label: "Plano de Saúde", value: profile.health_insurance });
      if (profile.therapist_name) clinicas.push({ label: "Terapeuta / Médico", value: profile.therapist_name });
      if (profile.institution) clinicas.push({ label: "Escola / Instituição", value: profile.institution });
      if (profile.other_disabilities) clinicas.push({ label: "Obs. clínicas", value: profile.other_disabilities });

      const comunicacao: Field[] = [];
      if (profile.preferred_communication) comunicacao.push({ label: "Método de comunicação", value: profile.preferred_communication });
      if (profile.sensory_sensitivities) comunicacao.push({ label: "Sensibilidades sensoriais", value: profile.sensory_sensitivities });
      if (profile.routine_notes) comunicacao.push({ label: "Rotina / Observações", value: profile.routine_notes });

      // ---- Divide em duas colunas ----
      // Coluna esquerda: Dados Pessoais + Emergência
      // Coluna direita: Informações Clínicas + Comunicação
      const leftSections: Section[] = [
        { title: "📋 DADOS PESSOAIS", fields: pessoais },
        ...(emergencia.length > 0 ? [{ title: "🚨 CONTATO DE EMERGÊNCIA", fields: emergencia }] : []),
      ];
      const rightSections: Section[] = [
        { title: "🏥 INFORMAÇÕES CLÍNICAS", fields: clinicas },
        ...(comunicacao.length > 0 ? [{ title: "💬 COMUNICAÇÃO", fields: comunicacao }] : []),
      ];

      // ---- Calcula altura de cada coluna ----
      const headerH = 110;
      const footerH = 50;
      const sectionTitleH = 44;
      const fieldH = 44;
      const sectionGap = 12;

      const calcColH = (sections: Section[]) => {
        let h = 0;
        for (const sec of sections) {
          h += sectionTitleH + sec.fields.length * fieldH + sectionGap;
        }
        return h;
      };

      const leftH = calcColH(leftSections);
      const rightH = calcColH(rightSections);
      const contentH = Math.max(leftH, rightH);
      const totalH = headerH + contentH + footerH + padding * 2 + 20;

      canvas.width = width;
      canvas.height = totalH;

      // ---- Fundo ----
      const grad = ctx.createLinearGradient(0, 0, 0, totalH);
      grad.addColorStop(0, "#f0f4f8");
      grad.addColorStop(1, "#e8ecf1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, totalH);

      // ---- Barra topo ----
      const barGrad = ctx.createLinearGradient(0, 0, width, 0);
      barGrad.addColorStop(0, "#6ba3d6");
      barGrad.addColorStop(1, "#89c4e8");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 0, width, 6);

      // ---- Cabeçalho ----
      ctx.fillStyle = "#3a5a7c";
      ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
      ctx.fillText("AUROVOX", padding, padding + 36);

      ctx.fillStyle = "#6ba3d6";
      ctx.font = "15px system-ui, sans-serif";
      ctx.fillText("Prontuário de Comunicação Portátil", padding, padding + 60);

      // Data de exportação no canto direito do header
      ctx.fillStyle = "#8ea8be";
      ctx.font = "12px system-ui, sans-serif";
      const dateStr = `Exportado em ${new Date().toLocaleDateString("pt-BR")}`;
      const dateW = ctx.measureText(dateStr).width;
      ctx.fillText(dateStr, width - padding - dateW, padding + 36);

      // Linha divisória
      ctx.strokeStyle = "rgba(107, 163, 214, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, headerH + padding - 14);
      ctx.lineTo(width - padding, headerH + padding - 14);
      ctx.stroke();

      // ---- Linha divisória central entre colunas ----
      const colDivX = padding + colWidth + colGap / 2;
      ctx.strokeStyle = "rgba(107, 163, 214, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(colDivX, headerH + padding);
      ctx.lineTo(colDivX, headerH + padding + contentH);
      ctx.stroke();
      ctx.setLineDash([]);

      // ---- Função para renderizar uma coluna ----
      const renderCol = (sections: Section[], startX: number) => {
        let y = headerH + padding;

        for (const section of sections) {
          // Título da seção
          ctx.fillStyle = "#4a8a9e";
          ctx.font = "bold 13px system-ui, sans-serif";
          ctx.fillText(section.title, startX, y + 18);

          ctx.strokeStyle = "rgba(74, 138, 158, 0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(startX, y + 26);
          ctx.lineTo(startX + colWidth, y + 26);
          ctx.stroke();

          y += sectionTitleH;

          for (const field of section.fields) {
            // Label
            ctx.fillStyle = "#7a9ab5";
            ctx.font = "bold 10px system-ui, sans-serif";
            ctx.fillText(field.label.toUpperCase(), startX + 6, y + 4);

            // Valor (truncado para caber na coluna)
            ctx.fillStyle = "#2c4a5e";
            ctx.font = "14px system-ui, sans-serif";
            const maxChars = Math.floor(colWidth / 7.5);
            const truncated = field.value.length > maxChars
              ? field.value.substring(0, maxChars - 3) + "..."
              : field.value;
            ctx.fillText(truncated, startX + 6, y + 22);
            y += fieldH;
          }

          y += sectionGap;
        }
      };

      // Renderiza as duas colunas
      renderCol(leftSections, padding);
      renderCol(rightSections, padding + colWidth + colGap);

      // ---- Rodapé ----
      ctx.fillStyle = "#8ea8be";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(
        `AUROVOX — Comunicação para todos que precisam de voz • ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
        padding,
        totalH - 18
      );

      // Barra rodapé
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, totalH - 4, width, 4);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `aurovox-perfil-${profile.name.replace(/\s+/g, "-").toLowerCase() || "usuario"}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success("Ficha exportada como imagem!");
      }, "image/png");
    } catch {
      toast.error("Erro ao exportar imagem.");
    }
    setExporting(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const updateForm = (field: keyof Profile, value: any) => setForm({ ...form, [field]: value });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full bg-card border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <img src="/favicon.png" alt="AUROVOX" className="w-9 h-9 rounded-2xl" />
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Meu Perfil</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full space-y-4 pb-8">
        <div ref={profileCardRef} className="bg-card rounded-3xl border border-border p-5 md:p-8 shadow-lg space-y-5">
          {/* Profile header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile.name || "Sem nome"}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2 rounded-xl">
                <Edit className="w-4 h-4" /> Editar
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-5">
              {/* DADOS PESSOAIS */}
              <SectionTitle icon={<User className="w-4 h-4" />} title="Dados Pessoais" />

              <FieldInput label="Nome completo" value={form.name} onChange={(v) => updateForm("name", v)} placeholder="Nome completo" max={100} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldInput label="Data de Nascimento" value={form.date_of_birth || ""} onChange={(v) => updateForm("date_of_birth", v || null)} type="date" />
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Gênero</label>
                  <div className="flex gap-1.5">
                    {["Masculino", "Feminino", "Outro"].map((g) => (
                      <ChipButton key={g} label={g} active={form.gender === g} onClick={() => updateForm("gender", g)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* PESO E ALTURA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldInput label="Peso (kg)" value={form.weight} onChange={(v) => updateForm("weight", v)} placeholder="Ex: 65 kg" max={10} />
                <FieldInput label="Altura (cm)" value={form.height} onChange={(v) => updateForm("height", v)} placeholder="Ex: 170 cm" max={10} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldInput label="Telefone" value={form.phone} onChange={(v) => updateForm("phone", v)} placeholder="(00) 00000-0000" max={20} />
                <FieldInput label="Responsável / Cuidador" value={form.caregiver_name} onChange={(v) => updateForm("caregiver_name", v)} placeholder="Nome do responsável" max={100} />
              </div>

              <FieldInput label="Endereço" value={form.address} onChange={(v) => updateForm("address", v)} placeholder="Rua, número, bairro, cidade" max={200} />

              {/* EMERGÊNCIA */}
              <SectionTitle icon={<Shield className="w-4 h-4" />} title="Contato de Emergência" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldInput label="Nome do contato" value={form.emergency_contact} onChange={(v) => updateForm("emergency_contact", v)} placeholder="Nome" max={100} />
                <FieldInput label="Telefone de emergência" value={form.emergency_phone} onChange={(v) => updateForm("emergency_phone", v)} placeholder="(00) 00000-0000" max={20} />
              </div>

              {/* CLÍNICAS */}
              <SectionTitle icon={<Brain className="w-4 h-4" />} title="Informações Clínicas" />

              <div className="flex items-center justify-between p-3.5 bg-muted rounded-2xl">
                <div>
                  <label className="font-semibold text-foreground text-sm">Possui TEA*?</label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">*TEA = Transtorno do Espectro Autista</p>
                </div>
                <Switch checked={form.has_tea} onCheckedChange={(checked) => updateForm("has_tea", checked)} />
              </div>

              {form.has_tea && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Grau do TEA</label>
                  <div className="flex gap-1.5">
                    {["Nível 1", "Nível 2", "Nível 3"].map((level) => (
                      <ChipButton key={level} label={level} active={form.tea_level === level} onClick={() => updateForm("tea_level", level)} />
                    ))}
                  </div>
                </div>
              )}

              <FieldInput label="Diagnóstico / Condição" value={form.diagnosis} onChange={(v) => updateForm("diagnosis", v)} placeholder="Ex: Apraxia da Fala, Disartria, Paralisia Cerebral" max={200} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tipo Sanguíneo</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                      <ChipButton key={bt} label={bt} active={form.blood_type === bt} onClick={() => updateForm("blood_type", bt)} />
                    ))}
                  </div>
                </div>
                <FieldInput label="Plano de Saúde" value={form.health_insurance} onChange={(v) => updateForm("health_insurance", v)} placeholder="Nome do plano" max={100} />
              </div>

              <FieldInput label="Alergias" value={form.allergies} onChange={(v) => updateForm("allergies", v)} placeholder="Ex: Dipirona, Amendoim, Látex" max={300} />
              <FieldInput label="Medicações em uso" value={form.medications} onChange={(v) => updateForm("medications", v)} placeholder="Ex: Risperidona 1mg, Ritalina 10mg" max={300} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldInput label="Terapeuta / Médico" value={form.therapist_name} onChange={(v) => updateForm("therapist_name", v)} placeholder="Nome do profissional" max={100} />
                <FieldInput label="Escola / Instituição" value={form.institution} onChange={(v) => updateForm("institution", v)} placeholder="Nome da escola ou centro" max={100} />
              </div>

              <FieldTextarea label="Observações clínicas" value={form.other_disabilities} onChange={(v) => updateForm("other_disabilities", v)} placeholder="Impedimentos da fala, comorbidades ou observações importantes" max={500} />

              {/* COMUNICAÇÃO */}
              <SectionTitle icon={<MessageCircle className="w-4 h-4" />} title="Comunicação e Comportamento" />

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Método de comunicação preferido</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Pictogramas", "Texto", "Gestos", "Libras", "Dispositivo AAC*", "Misto"].map((m) => (
                    <ChipButton key={m} label={m} active={form.preferred_communication === m} onClick={() => updateForm("preferred_communication", m)} />
                  ))}
                  <p className="w-full text-[10px] text-muted-foreground mt-1">*AAC = Comunicação Aumentativa e Alternativa</p>
                </div>
              </div>

              <FieldTextarea label="Sensibilidades sensoriais" value={form.sensory_sensitivities} onChange={(v) => updateForm("sensory_sensitivities", v)} placeholder="Ex: Sons altos, luzes fortes, texturas específicas" max={300} />
              <FieldTextarea label="Rotina / Observações comportamentais" value={form.routine_notes} onChange={(v) => updateForm("routine_notes", v)} placeholder="Ex: Necessita de rotina visual, acalma-se com música" max={500} />

              {/* Compartilhamento */}
              <div className="flex items-center justify-between p-3.5 bg-muted rounded-2xl">
                <div>
                  <label className="font-semibold text-foreground text-sm">Permitir compartilhamento</label>
                  <p className="text-xs text-muted-foreground">Permite exportar perfil como imagem</p>
                </div>
                <Switch checked={form.share_enabled} onCheckedChange={(checked) => updateForm("share_enabled", checked)} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl h-12 font-bold gap-2">
                  <Save className="w-5 h-5" /> {saving ? "Salvando..." : "Salvar Perfil"}
                </Button>
                <Button variant="outline" onClick={() => { setEditing(false); setForm(profile); }} className="rounded-xl h-12 gap-2">
                  <X className="w-5 h-5" /> Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Dados Pessoais */}
              <ViewSection title="Dados Pessoais">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.date_of_birth && <InfoCard label="Nascimento" value={new Date(profile.date_of_birth + "T12:00:00").toLocaleDateString("pt-BR")} />}
                  {profile.gender && <InfoCard label="Gênero" value={profile.gender} />}
                  {profile.weight && <InfoCard label="Peso" value={profile.weight} />}
                  {profile.height && <InfoCard label="Altura" value={profile.height} />}
                  {profile.phone && <InfoCard label="Telefone" value={profile.phone} />}
                  {profile.caregiver_name && <InfoCard label="Responsável" value={profile.caregiver_name} />}
                </div>
                {profile.address && <InfoCard label="Endereço" value={profile.address} />}
              </ViewSection>

              {/* Emergência */}
              {(profile.emergency_contact || profile.emergency_phone) && (
                <ViewSection title="Contato de Emergência">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.emergency_contact && <InfoCard label="Nome" value={profile.emergency_contact} />}
                    {profile.emergency_phone && <InfoCard label="Telefone" value={profile.emergency_phone} />}
                  </div>
                </ViewSection>
              )}

              {/* Clínicas */}
              <ViewSection title="Informações Clínicas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoCard label="TEA" value={profile.has_tea ? `Sim${profile.tea_level ? ` — ${profile.tea_level}` : ""}` : "Não"} />
                  {profile.blood_type && <InfoCard label="Tipo Sanguíneo" value={profile.blood_type} />}
                  {profile.health_insurance && <InfoCard label="Plano de Saúde" value={profile.health_insurance} />}
                  {profile.therapist_name && <InfoCard label="Terapeuta" value={profile.therapist_name} />}
                  {profile.institution && <InfoCard label="Escola / Instituição" value={profile.institution} />}
                </div>
                {profile.diagnosis && <InfoCard label="Diagnóstico" value={profile.diagnosis} />}
                {profile.allergies && <InfoCard label="Alergias" value={profile.allergies} />}
                {profile.medications && <InfoCard label="Medicações" value={profile.medications} />}
                {profile.other_disabilities && <InfoCard label="Observações" value={profile.other_disabilities} />}
              </ViewSection>

              {/* Comunicação */}
              {(profile.preferred_communication || profile.sensory_sensitivities || profile.routine_notes) && (
                <ViewSection title="Comunicação e Comportamento">
                  {profile.preferred_communication && <InfoCard label="Método de comunicação" value={profile.preferred_communication} />}
                  {profile.sensory_sensitivities && <InfoCard label="Sensibilidades sensoriais" value={profile.sensory_sensitivities} />}
                  {profile.routine_notes && <InfoCard label="Rotina / Observações" value={profile.routine_notes} />}
                </ViewSection>
              )}

              <InfoCard label="Compartilhamento" value={profile.share_enabled ? "Ativado" : "Desativado"} />
            </div>
          )}

          {/* Botão exportar */}
          {!editing && (
            <Button onClick={handleExportAsImage} disabled={exporting} variant="outline" className="w-full rounded-xl h-12 font-bold gap-2">
              <Download className="w-5 h-5" /> {exporting ? "Gerando ficha..." : "Exportar Ficha como Imagem"}
            </Button>
          )}
        </div>

        {!editing && (
          <Button onClick={handleLogout} variant="destructive" className="w-full rounded-xl h-12 font-bold gap-2">
            <LogOut className="w-5 h-5" /> Sair da Conta
          </Button>
        )}
      </main>
    </div>
  );
}

// --- Sub-components ---

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-3 border-t border-border">
      <span className="text-primary">{icon}</span>
      <h3 className="font-bold text-foreground text-xs uppercase tracking-widest">{title}</h3>
    </div>
  );
}

function ViewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3.5 bg-muted rounded-2xl">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-foreground font-bold mt-0.5 text-sm">{value}</p>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, max, type }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; max?: number; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <Input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={max} className="rounded-xl" />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, placeholder, max }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; max?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={max}
        rows={2}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder={placeholder}
      />
    </div>
  );
}

function ChipButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-xl font-semibold text-xs transition-all ${
        active ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {label}
    </button>
  );
}