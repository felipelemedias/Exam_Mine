import React from "react";
import { Separator } from "../../../../components/ui/separator";

export const NewLaunchesSection = (): JSX.Element => {
  // Tools/features data for the footer
  const tools = [
    { name: "Buscar remédio", id: "search-medicine" },
    { name: "Consultar bula", id: "check-leaflet" },
    { name: "Avaliação de dúvidas com IA", id: "ai-evaluation" },
  ];

  return (
    <div className="w-full">
      <footer className="w-full bg-white border-t border-[#dee8f9]">
        <div className="container mx-auto px-6">
          {/* Main footer content */}
          <div className="py-10">
            <h2 className="text-[41.5px] font-bold text-[#1a1840] font-['Open_Sans',Helvetica]">
              Ferramentas
            </h2>

            <div className="flex flex-wrap mt-4 gap-x-12">
              {tools.map((tool) => (
                <a
                  key={tool.id}
                  href={`#${tool.id}`}
                  className="text-xl font-normal text-[#1a1840] font-['Open_Sans',Helvetica] hover:underline"
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>

          {/* Footer bottom with copyright */}
          <Separator className="bg-[#e8eaf2]" />
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="w-[39px] h-[45px] bg-[url(/group-33.png)] bg-[100%_100%]" />
              <div className="ml-5 text-[14.6px] font-['Archivo',Helvetica]">
                <span className="text-[#565656]">Exam </span>
                <span className="font-bold text-[#565656]">Mine</span>
              </div>
            </div>

            <div className="font-normal text-sm text-[#375375] font-['Inter',Helvetica]">
              © 2024 EXAM MINE.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
