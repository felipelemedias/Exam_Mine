import React from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { AnalysisSection } from "./sections/AnalysisSection/AnalysisSection";
import { CallToActionSection } from "./sections/CallToActionSection/CallToActionSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { ToolsSection } from "./sections/ToolsSection";
import { AgentType } from "../../types/agents";

export const ExamMine = (): JSX.Element => {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    console.log("Connect button clicked, navigating to exam analysis agent");
    navigate(`/agent/${AgentType.EXAM_ANALYZER}`);
  };

  return (
    <div className="relative w-full bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-white shadow-[0px_2px_10px_#00507d14]">
        <div className="flex items-center justify-between h-full px-8">
          <div className="flex items-center h-[45px]">
            <div className="w-[39px] h-[45px] bg-[url(/group-34.png)] bg-[100%_100%]" />
            <div className="ml-6 text-[14.6px] whitespace-nowrap font-['Archivo',Helvetica]">
              <span className="text-[#565656]">Exam </span>
              <span className="font-bold text-[#565656]">Mine</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-[10px]">
              <div 
                className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/agent/${AgentType.MEDICATION_PRICES}`)}
              >
                Buscar remédio
              </div>
              <Separator
                orientation="vertical"
                className="h-[30px] bg-[#e6e6e6]"
              />
              <div 
                className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/agent/${AgentType.MEDICATION_INFO}`)}
              >
                Consultar bula
              </div>
              <Separator
                orientation="vertical"
                className="h-[30px] bg-[#e6e6e6]"
              />
              <div 
                className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/agent/${AgentType.GENERAL_QUESTION}`)}
              >
                Avaliação de dúvidas com IA
              </div>
            </div>
            <div 
              className="ml-8 font-semibold text-sm text-[#1760c6] cursor-pointer hover:underline"
              onClick={handleConnectClick}
            >
              Conecte-se
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20">
        {/* Call To Action Section */}
        <section className="w-full">
          <CallToActionSection onButtonClick={handleConnectClick} />
        </section>

        {/* Hero Section with blue background */}
        <section className="w-full bg-[#050a1e]">
          <div className="h-[852px] bg-[#1760c6]">
            <HeroSection />
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full">
          <div className="mx-auto py-12">
            <h2 className="text-center text-[40px] font-bold text-[#375375] font-['Inter',Helvetica] leading-[56px] mb-8">
              Descubra nossas outras ferramentas em destaque
            </h2>
            <FeaturesSection />
          </div>
        </section>

        {/* Analysis Section */}
        <section className="w-full">
          <AnalysisSection />
        </section>

        {/* Tools Section */}
        <section className="w-full">
          <ToolsSection />
        </section>

        {/* Footer Section */}
        <section className="w-full">
          <FooterSection />
        </section>

        {/* Testimonials Section */}
        <section className="w-full">
          <TestimonialsSection />
        </section>
      </div>
    </div>
  );
};