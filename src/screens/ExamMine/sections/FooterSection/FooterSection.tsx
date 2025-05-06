import React from "react";
import { Button } from "../../../../components/ui/button";
// importe o seu arquivo baixado da balança
import scaleIllustration from "../../../../assets/balance.png";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
// useAuth do contexto global de autenticação
import { useAuth } from "../../../../contexts/AuthContext";

const featuresList = [
  "Traduza automaticamente seus exames para uma linguagem acessível, eliminando a necessidade de consultas complexas.",
  "Receba sugestões de cuidados preventivos e monitoramento contínuo da saúde em um só lugar.",
  "Compare preços e consulte informações detalhadas de medicamentos em poucos cliques.",
  "Reduza a ansiedade interpretando rapidamente indicadores médicos complexos.",
  "Obtenha recomendações personalizadas com base nos seus exames de sangue.",
];

export const FooterSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Função que redireciona para análise de exames ou login
  const handleClick = () => {
    if (authState.isAuthenticated) {
      navigate("/agent/exam-analysis");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="bg-[#f0fcf8] rounded-[36px] py-12 px-6 md:px-12">
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="space-y-6">
          <h2 className="text-2xl md:text-xl font-bold text-[#375375]">
            Leve o Exam Mine e tenha tudo o que precisa para interpretar seus exames
          </h2>
          <p className="text-base text-[#375375] leading-relaxed max-w-lg">
            Com o Exam Mine, você tem um assistente de saúde completo, economizando
            tempo e obtendo insights médicos com clareza, que outras ferramentas isoladas
            não conseguem oferecer.
          </p>
          <ul className="space-y-3">
            {featuresList.map((txt, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-1 text-[#1760c6]" size={20} />
                <span className="text-base text-[#375375] leading-tight">{txt}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button
              onClick={handleClick}
              className="flex-1 bg-[#3a7eff] hover:bg-[#336be0] text-white rounded-full"
            >
              Experimente o Exam Mine
            </Button>
            <Button
              variant="outline"
              onClick={handleClick}
              className="flex-1 rounded-full border-[#3a7eff] text-[#3a7eff] hover:bg-[#e8f0fa]"
            >
              Saiba mais sobre nossa tecnologia de análise
            </Button>
          </div>
        </div>

        {/* === COLUNA DA DIREITA: imagem única da balança === */}
        <div className="flex justify-center">
          <img
            src={scaleIllustration}
            alt="Comparação de dicionário médico vs Exam Mine"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </section>
  );
};
