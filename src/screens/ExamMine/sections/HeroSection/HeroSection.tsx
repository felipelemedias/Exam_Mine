import React from "react";
import { Button } from "../../../../components/ui/button";
import { ArrowBigRight, Check } from "lucide-react";
import heroMedicines from "../../../../assets/heromedicines.png";
import { useNavigate } from "react-router-dom";

export const HeroSection = (): JSX.Element => {
  const navigate = useNavigate();
  const featureList = [
    "Encontre informações sobre medicamentos com facilidade",
    "Compare preços, leia bulas e saiba mais sobre posologia, contraindicações e efeitos colaterais.",
    "Desenvolvido com inteligência artificial avançada para acesso rápido e confiável.",
    "Informações de farmácias e bulas para decisões mais seguras",
  ];

  return (
    <section className="bg-[#e8f0fa] rounded-[36px] py-16 px-10 md:px-12 max-w-[1312px] mx-auto">
      <div className="flex flex-col-reverse items-center gap-8 md:flex-row">
          <div className="flex justify-center w-full md:w-1/2">
            <img
              src={heroMedicines}
              alt="Ilustração de medicamentos"
              className="w-full max-w-[490px] h-auto object-contain"
            />
          </div>
        <div className="flex flex-col w-full gap-4 md:w-1/2">
          <div className="flex items-center gap-2">
            <ArrowBigRight className="text-blue-600" size={24} />
            <h3 className="font-semibold text-lg text-[#375375]">
              Buscar Remédio
            </h3>
          </div>
          <h2 className="font-bold text-3xl md:text-[32px] text-[#375375] leading-snug">
            Mais que uma busca: apoio <br className="hidden md:block" />
            ao seu tratamento e saúde
          </h2>
        
          <ul className="mt-4 space-y-3">
            {featureList.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-1 text-[#1760c6]" size={20} />
                <p className="text-base text-[#375375] leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
          
          <Button className="mt-6 w-max bg-[#1760c6] text-white hover:bg-[#0f4c8a] transition-colors duration-300"
            onClick={() => navigate("/agent/medication-prices")}>
            Explorar Busca de Remédios
          </Button>
        </div>


      </div>
    </section>
  );
};
