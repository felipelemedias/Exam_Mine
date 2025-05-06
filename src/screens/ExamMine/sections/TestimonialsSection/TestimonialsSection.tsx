import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

export const TestimonialsSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Handle click: redirect to exam analysis or login
  const handleClick = () => {
    if (authState.isAuthenticated) {
      navigate("/agent/exam-analysis");
    } else {
      navigate("/login");
    }
  };

  // Feature tags data
  const featureRows = [
    [
      "Recomendações de saúde personalizadas",
      "Acesso rápido a bulas de medicamentos",
      "Comparação de preços de remédios",
      "Análise de sintomas relacionados",
      "Acesso rápido a dados médicos",
    ],
    [
      "Consulta sobre valores de referência",
      "Monitoramento de saúde contínuo",
      "Redução de consultas desnecessárias",
      "Explicação de indicadores de saúde",
      "Painel intuitivo de resultados",
    ],
    [
      "Decisões informadas de tratamento",
      "Informações médicas claras",
      "Interpretação prática de exames",
      "Apoio ao cuidado médico proativo",
      "Insights para melhorar o estilo de vida",
    ],
    [
      "Autonomia na gestão da saúde",
      "Simplificação de termos médicos",
      "Entendimento fácil de exames",
      "Assistente de saúde personalizado",
      "Promoção de cuidados preventivos",
    ],
    [
      "Tradução de exames para linguagem simples",
      "Análise completa de hemogramas",
      "Sugestões de cuidados preventivos",
      "Sugestões de cuidados preventivos",
    ],
    [
      "Menos ansiedade ao interpretar exames",
      "Análise de sintomas relacionados",
      "Análise completa de hemogramas",
    ],
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute w-full h-full max-w-[1440px] mx-auto">
        <div className="relative w-full h-full">
          <div className="absolute w-full h-[3528px] top-[410px] right-0 bg-[#64d8b7] rounded-full shadow-[0px_0px_0px_400px_#3a7eff] blur-[100px] opacity-20" />
        </div>
      </div>

      {/* Content container */}
      <div className="relative flex flex-col items-center gap-[45px] max-w-[1424px] mx-auto">
        {/* Heading section */}
        <div className="flex flex-col w-full max-w-[1073px] items-center gap-3">
          <h2 className="text-4xl font-bold text-[#375375] text-center leading-[48px] font-sans">
            Nunca mais fique com dúvidas
          </h2>
          <p className="text-base font-normal text-[#677788] text-center leading-6 font-sans">
            O Exam Mine oferece tudo o que você precisa para interpretar e
            compreender seus exames com confiança, fornecendo insights
            acessíveis e recomendações personalizadas para o seu cuidado de
            saúde.
          </p>
        </div>

        {/* Features section */}
        <div className="flex flex-col w-full max-w-[1348px] items-center gap-[33px]">
          <div className="flex flex-col items-center justify-center gap-[32px] w-full">
            {/* Map through feature rows */}
            {featureRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="flex flex-wrap items-center gap-[19px] justify-center w-full"
              >
                {row.map((feature, featureIndex) => (
                  <Card
                    key={`feature-${rowIndex}-${featureIndex}`}
                    className="flex items-center justify-center px-[18px] py-[10px] bg-[#f7fafe] rounded-[7.5px] shadow-[0px_2px_7.5px_#00507d14]"
                  >
                    <span className="text-[13.3px] font-normal text-black text-center leading-[21px] font-sans whitespace-nowrap">
                      {feature}
                    </span>
                  </Card>
                ))}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleClick}
            className="w-full max-w-[505px] h-[45px] bg-[#3a7eff] rounded-[9465px] text-white font-bold text-[15px] leading-[23px] font-sans"
          >
            Saiba mais sobre todos os benefícios do Exam Mine aqui
          </Button>
        </div>
      </div>
    </section>
  );
};
