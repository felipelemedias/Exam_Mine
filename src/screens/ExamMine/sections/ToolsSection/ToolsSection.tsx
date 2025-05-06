import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

import iconHealthAdvisor from "../../../../assets/icon-health-advisor.png";
import heroHealthAdvisor from "../../../../assets/hero-health-advisor.png";
import iconSymptomChecker from "../../../../assets/icon-symptom-checker.png";
import heroSymptomChecker from "../../../../assets/hero-symptom-checker.png";
import iconMedicationFinder from "../../../../assets/icon-med-finder.png";
import heroMedicationFinder from "../../../../assets/hero-med-finder.png";
import iconHealthTracker from "../../../../assets/icon-health-tracker.png";
import heroHealthTracker from "../../../../assets/hero-health-tracker.png";
import starsDecor from "../../../../assets/stars-decor.png";

interface Tool {
  id: number;
  title: string;
  heading: string;
  description: string;
  icon: string;
  image: string;
  gradient: string;
}

const tools: Tool[] = [
  {
    id: 1,
    title: "Conselheiro de Saúde",
    heading: "Aconselhamento Personalizado de Saúde com IA",
    description:
      "Receba recomendações específicas sobre estilo de vida e saúde baseadas nos resultados do seu exame, ajudando você a adotar hábitos saudáveis e preventivos de maneira personalizada.",
    icon: iconHealthAdvisor,
    image: heroHealthAdvisor,
    gradient: "from-[#1760C6] to-[#5BACED]",
  },
  {
    id: 2,
    title: "Verificador de Sintomas",
    heading: "Verificador de Sintomas Relacionados ao Exame",
    description:
      "Com base nos resultados do exame, obtenha uma análise de sintomas associados e descubra possíveis condições de saúde que merecem atenção, promovendo um diagnóstico preventivo.",
    icon: iconSymptomChecker,
    image: heroSymptomChecker,
    gradient: "from-[#18AA7E] to-[#58E9BE]",
  },
  {
    id: 3,
    title: "Encontrar Medicamento",
    heading: "Comparação de Medicamentos Alternativos",
    description:
      "Encontre medicamentos alternativos mais acessíveis e com a mesma eficácia para tratamentos específicos, possibilitando escolhas econômicas sem comprometer a qualidade do cuidado.",
    icon: iconMedicationFinder,
    image: heroMedicationFinder,
    gradient: "from-[#18AA7E] to-[#58E9BE]",
  },
  {
    id: 4,
    title: "Rastreador de Saúde",
    heading: "Monitoramento Contínuo de Indicadores de Saúde",
    description:
      "Acompanhe o histórico dos seus exames ao longo do tempo e observe as mudanças nos principais indicadores de saúde, permitindo uma visão mais ampla do progresso e da saúde contínua.",
    icon: iconHealthTracker,
    image: heroHealthTracker,
    gradient: "from-[#1760C6] to-[#5BACED]",
  },
];

export const ToolsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1760C6] to-[#64D8B7]">
      <div className="px-4 mx-auto max-w-7xl">

        <div className="relative mb-12">
          <img
            src={starsDecor}
            alt=""
            aria-hidden="true"
            className="absolute w-40 transform -translate-x-1/2 pointer-events-none select-none -top-6 left-1/4 opacity-80"
          />
          <h2 className="text-4xl font-extrabold leading-tight text-center text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            FUTUROS LANÇAMENTOS:
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className={`border border-white rounded-2xl overflow-hidden bg-gradient-to-b ${tool.gradient} flex flex-col`}
            >
              <CardContent className="flex flex-col flex-1 p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={tool.icon}
                    alt={`${tool.title} icon`}
                    className="flex-shrink-0 w-6 h-6"
                  />
                  <span className="ml-3 font-semibold text-white">
                    {tool.title}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
                  {tool.heading}
                </h3>
                <p className="flex-grow mb-4 leading-relaxed text-white">
                  {tool.description}
                </p>
                <img
                  src={tool.image}
                  alt={tool.heading}
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
