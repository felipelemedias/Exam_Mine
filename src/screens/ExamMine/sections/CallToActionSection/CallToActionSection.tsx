import React from "react";
import { Button } from "../../../../components/ui/button";
import heroImg from "../../../../assets/heroImg.png";

interface CallToActionSectionProps {
  onButtonClick: () => void;
}

export const CallToActionSection = ({
  onButtonClick,
}: CallToActionSectionProps): JSX.Element => {
  return (
    <section className="w-full bg-[#1760c6] py-12 md:py-16 overflow-hidden">
      <div className="container flex flex-col-reverse items-center justify-between px-4 mx-auto md:flex-row md:px-8">
        <div className="flex flex-col items-start w-full gap-4 mt-8 md:w-1/2 md:mt-0">
          <h2 className="font-sans text-white text-3xl md:text-[49px] leading-snug">
            Faça uma
            <br />
            <span className="font-bold">Análise completa</span>
          </h2>
          <p className="font-sans text-white text-sm md:text-[13.9px] max-w-md">
            Envie o PDF do seu exame de sangue e nossa IA traduzirá os resultados médicos em
            informações claras e compreensíveis sobre sua saúde.
          </p>
          <Button
            onClick={onButtonClick}
            className="mt-4 w-[200px] md:w-[229px] h-[48px] md:h-[52px] rounded-full border border-white bg-transparent 
                       font-bold text-[14px] md:text-[15.5px] text-white transition-colors hover:bg-white hover:text-[#1760c6]"
            variant="outline"
          >
            Exame Completo
          </Button>
        </div>

        <div className="flex justify-center w-full md:w-1/2">
          <img
            src={heroImg}
            alt="Ilustração de laboratório"
            className="object-contain w-full h-auto max-w-sm md:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};
