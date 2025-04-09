import React from "react";
import { Button } from "../../../../components/ui/button";

interface CallToActionSectionProps {
  onButtonClick: () => void;
}

export const CallToActionSection = ({ onButtonClick }: CallToActionSectionProps): JSX.Element => {
  return (
    <section className="w-full max-w-[631px] py-12 md:py-16">
      <div className="flex flex-col items-start gap-5 ml-16">
        <div className="w-full max-w-[565px]">
          <h2 className="font-sans text-[49.2px] text-[#fbfbfb] leading-tight">
            Faça uma
            <br />
            <span className="font-bold">Análise completa</span>
          </h2>
        </div>

        <div className="max-w-[383px] ml-16">
          <p className="font-sans text-white text-[13.9px]">
            Envie o PDF do seu exame de sangue e nossa IA traduzirá os
            resultados médicos em informações claras e compreensíveis sobre sua
            saúde.
          </p>
        </div>

        <Button
          className="mt-2 w-[229px] h-[52px] rounded-[28.1px] border-[0.7px] border-solid border-white bg-transparent font-['Plus_Jakarta_Sans',Helvetica] font-bold text-white text-[15.5px]"
          variant="outline"
          onClick={onButtonClick}
        >
          Exame Completo
        </Button>
      </div>
    </section>
  );
};