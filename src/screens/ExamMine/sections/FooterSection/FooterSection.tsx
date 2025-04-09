import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const FooterSection = (): JSX.Element => {
  // Feature list data
  const featuresList = [
    {
      icon: "/mask-group-13.svg",
      text: "Traduza automaticamente seus exames para uma linguagem acessível, eliminando a necessidade de consultas complexas.",
    },
    {
      icon: "/mask-group-20.svg",
      text: "Receba sugestões de cuidados preventivos e monitoramento contínuo da saúde em um só lugar.",
    },
    {
      icon: "/mask-group-6.svg",
      text: "Compare preços e consulte informações detalhadas de medicamentos em poucos cliques.",
    },
    {
      icon: "/mask-group-17.svg",
      text: "Reduza a ansiedade interpretando rapidamente indicadores médicos complexos.",
    },
    {
      icon: "/mask-group-9.svg",
      text: "Obtenha recomendações personalizadas com base nos seus exames de sangue.",
    },
  ];

  // Extension features
  const extensionFeatures = [
    {
      text: "Dicionário Médico",
      width: "w-[184px]",
    },
    {
      text: "Pesquisa em sites de saúde",
      width: "w-[263px]",
    },
    {
      text: "Aplicativos de tradução médica",
      width: "w-[297px]",
    },
  ];

  return (
    <div className="w-full h-[653px] bg-[#f0fcf8] rounded-[36px] opacity-[1.0] p-12">
      <div className="relative w-full h-[568px] max-w-[1120px] mx-auto">
        <div className="absolute w-[592px] h-[114px] top-[271px] left-[528px] bg-[url(/figure---browser-extension-png.png)] bg-cover bg-[50%_50%]" />

        <div className="flex flex-col w-[295px] items-center absolute top-[134px] left-[566px] gap-0">
          {extensionFeatures.map((feature, index) => (
            <div key={index} className={`relative ${feature.width} h-[46px]`}>
              <Card className="relative w-full h-[46px] bg-[#f3faff] rounded-[20px] shadow-[0px_1px_4px_#00000040]">
                <CardContent className="p-0">
                  <div className="absolute h-6 top-[11px] left-[15px] font-['Montserrat',Helvetica] font-bold text-black text-base tracking-[0] leading-6 whitespace-nowrap">
                    {feature.text}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex flex-col w-[701px] items-start gap-[25px] absolute top-0 left-0">
          <div className="flex flex-col items-start gap-[30px] relative self-stretch w-full">
            <div className="flex flex-col items-start gap-[26px] relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full">
                <div className="relative w-8 h-8">
                  <div className="h-8">
                    <div className="w-8 h-8">
                      <div className="relative w-[26px] h-[23px] top-1 left-[3px]">
                        <div className="relative h-[23px]">
                          <img
                            className="absolute w-6 h-[19px] top-1 left-[3px]"
                            alt="Vector"
                            src="/vector-4.svg"
                          />
                          <img
                            className="absolute w-6 h-[19px] top-0 left-0"
                            alt="Vector"
                            src="/vector.svg"
                          />
                          <img
                            className="absolute w-6 h-[19px] top-0 left-0"
                            alt="Mask group"
                            src="/mask-group.png"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="font-['Inter',Helvetica] font-bold text-[#375375] text-lg tracking-[0] leading-7 whitespace-nowrap">
                  Leve o Exam Mine e tenha tudo o que precisa para interpretar
                  seus exames
                </div>
              </div>

              <div className="w-[562px] font-['Inter',Helvetica] font-normal text-[#375375] text-xl tracking-[0] leading-6">
                Com o Exam Mine, você tem um assistente de saúde completo,
                economizando tempo e obtendo insights médicos com clareza, que
                outras ferramentas isoladas não conseguem oferecer.
              </div>
            </div>

            <div className="flex flex-col w-[512px] items-start gap-[11px] relative">
              {featuresList.map((feature, index) => (
                <div
                  key={index}
                  className="relative w-full flex items-start gap-[22px]"
                >
                  <img
                    className="w-3.5 h-3.5 mt-[5px]"
                    alt="Feature icon"
                    src={feature.icon}
                  />
                  <div className="font-['Inter',Helvetica] font-normal text-[#375375] text-base tracking-[0] leading-6">
                    {feature.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-[386px] items-start gap-3 relative">
            <Button className="relative w-full h-[42px] bg-[#3a7eff] rounded-full text-white font-semibold text-sm">
              Experimente o Exam Mine
            </Button>
            <Button
              variant="outline"
              className="relative w-full h-[42px] rounded-full border border-solid border-[#3a7eff] text-[#3a7eff] font-semibold text-sm"
            >
              Saiba mais sobre nossa tecnologia de análise
            </Button>
          </div>
        </div>

        <Card className="flex flex-col w-[248px] h-[148px] items-start gap-2.5 px-[37px] py-12 absolute top-[124px] left-[868px] bg-[#f3faff] rounded-[20px] shadow-[0px_1px_4px_#00000040]">
          <CardContent className="p-0">
            <div className="relative w-[175.4px] h-[51px]">
              <div className="absolute w-[45px] h-[51px] top-0 left-0 bg-[url(/group-27.png)] bg-[100%_100%]" />
              <div className="absolute top-[19px] left-[74px] text-[16.6px] whitespace-nowrap font-['Archivo',Helvetica] font-normal text-transparent tracking-[0] leading-[normal]">
                <span className="text-[#565656]">Exam </span>
                <span className="font-bold text-[#565656]">Mine</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
