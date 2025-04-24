import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Data for bullet points
const aiFeatures = [
  {
    id: 1,
    text: "Receba respostas claras e confiáveis para suas perguntas sobre exames",
    icon: "/mask-group-18.svg",
  },
  {
    id: 2,
    text: "Conte com a IA para traduzir termos técnicos em linguagem simples",
    icon: "/mask-group-11.svg",
  },
  {
    id: 3,
    text: "Oriente-se melhor sobre resultados e próximos passos",
    icon: "/mask-group-4.svg",
  },
  {
    id: 4,
    text: "Apoio acessível e personalizado para suas dúvidas de saúde",
    icon: "/mask-group-7.svg",
  },
];

export const AnalysisSection = (): JSX.Element => {
  return (
    <section className="w-full py-16 px-4 bg-[#e8f0fa] rounded-[36px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left side - Medical illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[457px] h-[387px]">
            <img
              className="w-full h-full object-contain"
              alt="Medical analysis illustration"
              src="/g756.png"
            />
            {/* We're keeping just the main image and removing the numerous overlapping images 
                to simplify the implementation while maintaining the visual appearance */}
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-1/2 flex flex-col space-y-6">
          {/* Title with icon */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <img
                className="w-full h-full object-contain"
                alt="AI icon"
                src="/g808-1.png"
              />
            </div>
            <h3 className="font-bold text-xl text-[#375375] font-sans">
              Avaliação de dúvidas com IA
            </h3>
          </div>

          {/* Main heading */}
          <h2 className="font-bold text-[32px] text-[#375375] leading-[44px]">
            Esclareça Suas Dúvidas com o Apoio da IA
          </h2>

          {/* Feature list */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-4">
              {aiFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start gap-2">
                  <img
                    className="w-3.5 h-3.5 mt-1.5"
                    alt="Feature icon"
                    src={feature.icon}
                  />
                  <p className="text-base text-[#375375] leading-6">
                    {feature.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button className="w-[251px] h-[42px] bg-[#1760c6] rounded-full text-sm font-semibold">
            Explore Avaliação de Dúvidas
          </Button>
        </div>
      </div>
    </section>
  );
};
