import React, { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FileUpload } from "../../components/Chat/FileUpload";
import { ChatInterface } from "../../components/Chat/ChatInterface";
import { analyzeExam } from "../../services/api";
import { Message } from "../../types/chat";

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou o assistente Exam Mine. Por favor, faça upload do seu exame em PDF para que eu possa analisá-lo.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      // Add message showing the file being uploaded
      const uploadMsg: Message = {
        id: Date.now().toString(),
        content: `Arquivo selecionado: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, uploadMsg]);
      console.log("File selected:", file.name);
      
      // Show processing message
      const processingMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Processando seu exame... Isso pode levar alguns segundos.",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, processingMsg]);
      setIsUploading(true);
      
      // Call API to analyze the exam
      console.log("Starting exam analysis");
      setIsAnalyzing(true);
      const result = await analyzeExam(file);
      setIsAnalyzing(false);
      console.log("Exam analysis completed");
      
      // Add response to chat
      const responseMsg: Message = {
        id: Date.now().toString(),
        content: result.analysis,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev.filter(msg => msg.id !== processingMsg.id), responseMsg]);
      
    } catch (error) {
      console.error("Error analyzing exam:", error);
      
      // Add error message to chat
      const errorMsg: Message = {
        id: Date.now().toString(),
        content: "Desculpe, houve um erro ao analisar seu exame. Por favor, tente novamente.",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
      
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
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
            <div className="ml-8 font-semibold text-sm text-[#1760c6]">
              Voltar
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-6">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-6 shadow-lg">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#375375] mb-2">
                Análise de Exames com IA
              </h1>
              <p className="text-[#677788]">
                Faça upload do seu exame em PDF e receba uma análise detalhada.
              </p>
            </div>

            <ChatInterface messages={messages} />

            <div className="mt-6 flex items-center justify-center">
              <FileUpload
                ref={fileInputRef}
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                acceptedFileTypes=".pdf"
              />

              <Button
                onClick={triggerFileUpload}
                className="w-full max-w-sm bg-[#1760c6] hover:bg-[#1253af] mt-4"
                disabled={isUploading || isAnalyzing}
              >
                {isUploading
                  ? "Enviando arquivo..."
                  : isAnalyzing
                  ? "Analisando exame..."
                  : "Enviar Exame para Análise"}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};