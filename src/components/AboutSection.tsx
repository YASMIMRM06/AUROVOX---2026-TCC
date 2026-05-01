import { Heart, MessageCircle, Users, Brain } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-card border-t border-border px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Sobre o AUROVOX
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Um prontuário de comunicação portátil para todos que precisam de voz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<MessageCircle className="w-6 h-6 text-primary" />}
            title="Comunicação é um direito"
            description="Diversos quadros clínicos podem impedir a fala verbal: TEA, Apraxia da Fala, Disartria e lesões cerebrais. O AUROVOX dá voz a todos."
          />
          <InfoCard
            icon={<Brain className="w-6 h-6 text-primary" />}
            title="Prontuário portátil"
            description="Registre observações extras e impedimentos da fala para que profissionais de saúde compreendam se a dificuldade é motora, cognitiva ou sensorial."
          />
          <InfoCard
            icon={<Users className="w-6 h-6 text-primary" />}
            title="Inclusão e acessibilidade"
            description="Ferramenta acessível e de baixo custo que combate o isolamento social de pessoas não-verbalizantes, independente da condição clínica."
          />
          <InfoCard
            icon={<Heart className="w-6 h-6 text-primary" />}
            title="Atendimento humanizado"
            description="Profissionais de saúde e educação podem adaptar o atendimento de forma precisa, compreendendo rapidamente as necessidades de cada pessoa."
          />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-5 bg-muted rounded-2xl">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 className="font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
