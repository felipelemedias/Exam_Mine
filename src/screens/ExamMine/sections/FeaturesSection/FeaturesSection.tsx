import React from "react";
import { Button } from "../../../../components/ui/button";
import { ArrowBigRight, Check } from "lucide-react";
import consultarBulaImg from "../../../../assets/consultarBula.png";
import { useNavigate } from "react-router-dom";

export const FeaturesSection = (): JSX.Element => {
  const navigate = useNavigate();
  const features = [
    "Acesse informações detalhadas e atualizadas sobre medicamentos",
    "Saiba mais sobre posologia, contraindicações e efeitos colaterais",
    "Dados confiáveis para um uso seguro e informado",
    "Inclui bulas de diversos medicamentos",
  ];

  return (
    <section className="bg-[#f0fcf8] rounded-[36px] py-16 px-6 md:px-12 max-w-[1312px] mx-auto my-8">
      <div className="flex flex-col-reverse items-center gap-8 md:flex-row">
        <div className="w-full space-y-8 md:w-1/2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8">
              <ArrowBigRight className="text-[#64d8b7]" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-[#375375]">
              Consultar bula
            </h3>
          </div>

          <h2 className="text-2xl md:text-[32px] font-bold text-[#375375] leading-tight">
            Consulte Bulas de Medicamentos <br className="hidden md:block" />
            de Forma Rápida e Completa
          </h2>

          <ul className="space-y-4">
            {features.map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-1 text-[#64d8b7]" size={20} />
                <p className="text-base text-[#375375] leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => navigate("/agent/medication-info")}
            className="mt-4 bg-[#64d8b7] hover:bg-[#50c6a5] text-white rounded-full px-6 py-3 text-sm font-semibold"
          >
            Explore a Consulta de Bula
          </Button>
        </div>

        <div className="flex justify-center w-full md:w-1/2">
          <img
            src={consultarBulaImg}
            alt="Ilustração Consultar Bula"
            className="w-full max-w-[543px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};
