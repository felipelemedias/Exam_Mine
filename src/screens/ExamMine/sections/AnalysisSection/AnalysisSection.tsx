import React from "react";
import { Button } from "../../../../components/ui/button";
import { Check } from "lucide-react";
import analysisIllustration from "../../../../assets/analysis-illustration.png";
import iconMicroscope from "../../../../assets/icon-microscope.png";
import { useNavigate } from "react-router-dom";

const aiFeatures = [
  "Receba respostas claras e confiáveis para suas perguntas sobre exames",
  "Conte com a IA para traduzir termos técnicos em linguagem simples",
  "Oriente-se melhor sobre resultados e próximos passos",
  "Apoio acessível e personalizado para suas dúvidas de saúde",
];

export const AnalysisSection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#e8f0fa] rounded-[36px] py-16 px-6 md:px-12 max-w-[1312px] mx-auto">
      <div className="flex flex-col-reverse items-center gap-8 md:flex-row">
        
        <div className="w-full space-y-6 md:w-1/2">
          <div className="flex items-center gap-2">
            <img
              src={iconMicroscope}
              alt="Microscope icon"
              className="object-contain w-8 h-8"
            />
            <h3 className="font-semibold text-lg text-[#375375]">
              Avaliação de dúvidas com IA
            </h3>
          </div>

          <h2 className="font-bold text-2xl md:text-[32px] text-[#375375] leading-tight">
            Esclareça Suas Dúvidas <br className="hidden md:block" />
            com o Apoio da IA
          </h2>

          <ul className="space-y-4">
            {aiFeatures.map((text, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="mt-1 text-[#1760c6]" size={20} />
                <p className="text-base text-[#375375] leading-relaxed">
                  {text}
                </p>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => navigate("/agent/general-question")}
            className="mt-4 bg-[#1760c6] hover:bg-[#1253af] text-white rounded-full px-6 py-3 text-sm font-semibold"
          >
            Explore Avaliação de Dúvidas
          </Button>
        </div>

        <div className="flex justify-center w-full md:w-1/2">
          <img
            src={analysisIllustration}
            alt="Ilustração de análise médica"
            className="w-full max-w-[490px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};
