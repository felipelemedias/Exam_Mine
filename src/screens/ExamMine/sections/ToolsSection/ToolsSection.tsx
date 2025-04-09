import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

// Tool card data for mapping
const toolCards = [
  {
    id: 1,
    position: "top-left",
    gradient: "bg-gradient-to-b from-[#1760C6] to-[#5BACED]",
    border: "border-[#1861c733]",
    shadow: "shadow-[0px_18px_24px_#00517e66]",
    icon: "/group-28.png",
    iconWidth: "w-[27px]",
    iconHeight: "h-[22px]",
    iconTop: "top-[5px]",
    iconLeft: "left-[3px]",
    title: "Conselheiro de Saúde",
    heading: "Aconselhamento Personalizado de Saúde com IA",
    description:
      "Receba recomendações específicas sobre estilo de vida e saúde baseadas nos resultados do seu exame, ajudando você a adotar hábitos saudáveis e preventivos de maneira personalizada.",
    image: "/image-2.png",
  },
  {
    id: 2,
    position: "bottom-left",
    gradient: "bg-gradient-to-b from-[#18AA7E] to-[#58E9BE]",
    border: "border-[#1aac80]",
    shadow: "shadow-[0px_8px_28px_#af86f766]",
    icon: "/group-29.png",
    iconWidth: "w-6",
    iconHeight: "h-5",
    iconTop: "top-[7px]",
    iconLeft: "left-1",
    title: "Verificador de Sintomas",
    heading: "Verificador de Sintomas Relacionados ao Exame",
    description:
      "Com base nos resultados do exame, obtenha uma análise de sintomas associados e descubra possíveis condições de saúde que merecem atenção, promovendo um diagnóstico preventivo.",
    image: "/image-1.png",
  },
  {
    id: 3,
    position: "top-right",
    gradient: "bg-gradient-to-b from-[#18AA7E] to-[#58E9BE]",
    border: "border-[#1aac80]",
    shadow: "shadow-[0px_18px_28px_#17ba6e66]",
    icon: "complex",
    title: "Encontrar Medicamento",
    heading: "Comparação de Medicamentos Alternativos",
    description:
      "Encontre medicamentos alternativos mais acessíveis e com a mesma eficácia para tratamentos específicos, possibilitando escolhas econômicas sem comprometer a qualidade do cuidado.",
    image: "/image-3.png",
  },
  {
    id: 4,
    position: "bottom-right",
    gradient: "bg-gradient-to-b from-[#1760C6] to-[#5BACED]",
    border: "border-[#1861c7]",
    shadow: "shadow-[0px_8px_28px_#7685ff66]",
    icon: "/clip-path-group.png",
    iconWidth: "w-8",
    iconHeight: "h-8",
    title: "Rastreador de Saúde",
    heading: "Monitoramento Contínuo de Indicadores de Saúde",
    description:
      "Acompanhe o histórico dos seus exames ao longo do tempo e observe as mudanças nos principais indicadores de saúde, permitindo uma visão mais ampla do progresso e saúde contínua.",
    image: "special",
  },
];

export const ToolsSection = (): JSX.Element => {
  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-[#1760C6] to-[#64D8B7]">
      <div className="relative w-full max-w-[1240px] mx-auto px-4">
        {/* Title Section */}
        <div className="relative mb-16">
          <div className="relative flex justify-center">
            <div className="relative">
              <h2 className="text-[77.8px] font-bold font-['Inter',Helvetica] leading-[72.3px] text-center bg-gradient-to-r from-[rgba(0,255,209,1)] to-[rgba(0,225,255,1)] bg-clip-text text-transparent">
                Novos
                <br />
                Lançamentos
              </h2>
              <img
                className="absolute w-[75px] h-[78px] top-0 left-[90px]"
                alt="Mask group"
                src="/mask-group-8.svg"
              />
            </div>
          </div>
          <img
            className="absolute w-[344px] h-[364px] top-[-140px] left-[-116px]"
            alt="Mask group"
            src="/mask-group-10.svg"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Top Left Card - Health Advisor */}
          <Card
            className={`rounded-[36px] border-2 border-solid ${toolCards[0].border} ${toolCards[0].shadow} ${toolCards[0].gradient} overflow-hidden`}
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-[15px] p-[30px]">
                <div className="flex flex-col items-center gap-5 w-full max-w-[397px]">
                  <div className="relative h-8 flex items-center">
                    <div className="w-8 h-8 relative">
                      <img
                        className={`absolute ${toolCards[0].iconWidth} ${toolCards[0].iconHeight} ${toolCards[0].iconTop} ${toolCards[0].iconLeft}`}
                        alt="Health Advisor Icon"
                        src={toolCards[0].icon}
                      />
                    </div>
                    <div className="ml-[38px] font-['Inter',Helvetica] font-bold text-white text-lg leading-7">
                      {toolCards[0].title}
                    </div>
                  </div>
                  <h3 className="font-['Inter',Helvetica] font-bold text-white text-2xl text-center leading-9">
                    {toolCards[0].heading}
                  </h3>
                </div>
                <p className="font-['Inter',Helvetica] font-normal text-white text-base text-center leading-6">
                  {toolCards[0].description}
                </p>
              </div>
              <div
                className="w-full h-[280px] rounded-[20px] mx-auto mt-4 mb-[30px] max-w-[411px]"
                style={{
                  backgroundImage: `url(${toolCards[0].image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </CardContent>
          </Card>

          {/* Top Right Card - Medication Finder */}
          <Card
            className={`rounded-[36px] border-2 border-solid ${toolCards[2].border} ${toolCards[2].shadow} ${toolCards[2].gradient} overflow-hidden`}
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-[15px] p-[30px]">
                <div className="flex flex-col items-center gap-5 w-full">
                  <div className="relative h-8 flex items-center">
                    <div className="w-8 h-8 relative">
                      <div className="relative w-6 h-6 top-1 left-1">
                        <div className="relative h-6">
                          <img
                            className="absolute w-6 h-[21px] top-0 left-0"
                            alt="Vector"
                            src="/vector-2.svg"
                          />
                          <img
                            className="absolute w-6 h-[21px] top-0 left-0"
                            alt="Vector"
                            src="/vector-5.svg"
                          />
                          <img
                            className="absolute w-6 h-[21px] top-0 left-0"
                            alt="Vector"
                            src="/vector-1.svg"
                          />
                          <img
                            className="absolute w-[5px] h-[5px] top-[9px] left-[17px]"
                            alt="Vector"
                            src="/vector-8.svg"
                          />
                          <img
                            className="absolute w-[17px] h-1.5 top-[18px] left-0"
                            alt="Vector"
                            src="/vector-3.svg"
                          />
                          <img
                            className="absolute w-[17px] h-1 top-[5px] left-1"
                            alt="Group"
                            src="/group-30.png"
                          />
                          <img
                            className="absolute w-3 h-1 top-[11px] left-1"
                            alt="Group"
                            src="/group-31.png"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-[38px] font-['Inter',Helvetica] font-bold text-white text-lg leading-7">
                      {toolCards[2].title}
                    </div>
                  </div>
                  <h3 className="font-['Inter',Helvetica] font-bold text-white text-2xl text-center leading-9">
                    {toolCards[2].heading}
                  </h3>
                </div>
                <p className="font-['Inter',Helvetica] font-normal text-white text-base text-center leading-6 max-w-[491px]">
                  {toolCards[2].description}
                </p>
              </div>
              <div
                className="w-full h-[298px] rounded-[20px] mx-auto mt-4 mb-[30px] max-w-[491px]"
                style={{
                  backgroundImage: `url(${toolCards[2].image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </CardContent>
          </Card>

          {/* Bottom Left Card - Symptom Checker */}
          <Card
            className={`rounded-[36px] border-2 border-solid ${toolCards[1].border} ${toolCards[1].shadow} ${toolCards[1].gradient} overflow-hidden`}
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-[15px] p-[30px]">
                <div className="flex flex-col items-center gap-5 w-full max-w-[304px]">
                  <div className="relative h-8 flex items-center">
                    <div className="w-8 h-8 relative">
                      <img
                        className={`absolute ${toolCards[1].iconWidth} ${toolCards[1].iconHeight} ${toolCards[1].iconTop} ${toolCards[1].iconLeft}`}
                        alt="Symptom Checker Icon"
                        src={toolCards[1].icon}
                      />
                    </div>
                    <div className="ml-[38px] font-['Inter',Helvetica] font-bold text-white text-lg leading-7">
                      {toolCards[1].title}
                    </div>
                  </div>
                  <h3 className="font-['Inter',Helvetica] font-bold text-white text-2xl text-center leading-9">
                    {toolCards[1].heading}
                  </h3>
                </div>
                <p className="font-['Inter',Helvetica] font-normal text-white text-base text-center leading-6">
                  {toolCards[1].description}
                </p>
              </div>
              <div
                className="w-full h-[279px] rounded-[20px] mx-auto mt-4 mb-[30px] max-w-[444px]"
                style={{
                  backgroundImage: `url(${toolCards[1].image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </CardContent>
          </Card>

          {/* Bottom Right Card - Health Tracker */}
          <Card
            className={`rounded-[36px] border-2 border-solid ${toolCards[3].border} ${toolCards[3].shadow} ${toolCards[3].gradient} overflow-hidden`}
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-[15px] p-[30px]">
                <div className="flex flex-col items-center gap-5 w-full max-w-[416px]">
                  <div className="relative h-8 flex items-center">
                    <div className="w-8 h-8 relative bg-[url(/clip-path-group.png)] bg-[100%_100%]" />
                    <div className="ml-[38px] font-['Inter',Helvetica] font-bold text-white text-lg leading-7">
                      {toolCards[3].title}
                    </div>
                  </div>
                  <h3 className="font-['Inter',Helvetica] font-bold text-white text-2xl text-center leading-9">
                    {toolCards[3].heading}
                  </h3>
                </div>
                <p className="font-['Inter',Helvetica] font-normal text-white text-base text-center leading-6">
                  {toolCards[3].description}
                </p>
              </div>
              <div className="relative w-full h-[354px] bg-[url(..//scholar-png.png)] bg-cover bg-center">
                <div className="relative w-[110px] h-[110px] top-[94px] mx-auto bg-white rounded-[55px]">
                  <div className="relative w-[92px] h-[58px] top-[26px] left-[9px]">
                    <div className="flex flex-col w-[92px] h-[58px] items-center relative">
                      <div className="relative w-[36.83px] h-[41.97px] bg-[url(/group-32.png)] bg-[100%_100%]" />
                      <div className="relative w-[69px] h-[18.62px] mb-[-5.73px] text-[12.3px] font-['Archivo',Helvetica] font-normal tracking-[0] leading-[normal]">
                        <span className="text-[#565656]">Exam </span>
                        <span className="font-bold text-[#565656]">Mine</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
