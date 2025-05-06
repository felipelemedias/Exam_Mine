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
import { useAuth } from "../../contexts/AuthContext";
import { AppHeader } from "../../components/Header/AppHeader";

export const ExamMine = (): JSX.Element => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleConnectClick = () => {
    if (authState.isAuthenticated) {
      console.log("Connect button clicked, navigating to exam analysis agent");
      navigate(`/agent/${AgentType.EXAM_ANALYZER}`);
    } else {
      console.log("Connect button clicked, navigating to login");
      navigate("/login");
    }
  };

  return (
    <div className="relative w-full bg-white">
      <AppHeader />

      <div className="pt-20">
        <section className="w-full">
          <CallToActionSection onButtonClick={handleConnectClick} />
        </section>

        <section className="w-full bg-[#050a1e]">
          <div className="mt-10 h-[652px] bg-[#ffffff]">
          <h2 className="text-center text-[40px] font-bold text-[#375375] font-['Inter',Helvetica] leading-[56px] mb-8">
              Descubra nossas outras ferramentas em destaque
            </h2>
            <HeroSection />
          </div>
        </section>

        <section className="w-full">
          <div className="py-12 mx-auto">
            <FeaturesSection />
          </div>
        </section>

        <section className="w-full mb-20">
          <AnalysisSection />
        </section>

        <section className="w-full">
          <ToolsSection />
        </section>

        <section className="w-full">
          <FooterSection />
        </section>

        <section className="w-full">
          <TestimonialsSection />
        </section>
      </div>
    </div>
  );
};