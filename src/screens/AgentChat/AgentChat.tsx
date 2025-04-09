import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FileUpload } from "../../components/Chat/FileUpload";
import { ChatInterface } from "../../components/Chat/ChatInterface";
import { TextInput } from "../../components/Chat/TextInput";
import { analyzeExam, getMedicationInfo, getMedicationPrices, askGeneralQuestion } from "../../services/api";
import { Message } from "../../types/chat";
import { AgentType, AGENTS } from "../../types/agents";
import { ClipLoader } from "react-spinners";

export const AgentChat: React.FC = () => {
  const { agentType } = useParams<{ agentType: string }>();
  const navigate = useNavigate();
  
  // Validate agent type
  const currentAgentType = Object.values(AgentType).includes(agentType as AgentType) 
    ? agentType as AgentType 
    : AgentType.EXAM_ANALYZER;
  
  const agent = AGENTS[currentAgentType];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: agent.initialMessage,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update messages when agent changes
  useEffect(() => {
    setMessages([
      {
        id: "1",
        content: agent.initialMessage,
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setIsProcessing(false);
  }, [agentType, agent.initialMessage]);

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
      setIsProcessing(true);
      
      // Call API to analyze the exam
      console.log("Starting exam analysis");
      const result = await analyzeExam(file);
      console.log("Exam analysis completed");
      
      // Add response to chat
      const responseMsg: Message = {
        id: Date.now().toString(),
        content: result.analysis,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => 
        [...prev.filter(msg => msg.id !== processingMsg.id), responseMsg]
      );
      
    } catch (error: any) {
      console.error("Error analyzing exam:", error);
      
      // Extract error message from response if possible
      let errorMessage = "Houve um erro ao analisar seu exame. Por favor, tente novamente.";
      
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Add error message to chat
      const errorMsg: Message = {
        id: Date.now().toString(),
        content: `Erro: ${errorMessage}`,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev.filter(msg => 
        msg.id !== (Date.now() + 1).toString()), errorMsg]);
      
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    try {
      // Add user message to chat
      const userMsg: Message = {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMsg]);
      console.log("Text input submitted:", text);
      
      // Show processing message
      const processingMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Processando sua solicitação...",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, processingMsg]);
      setIsProcessing(true);
      
      // Call appropriate API based on agent type
      let result;
      console.log(`Processing request for agent: ${currentAgentType}`);
      
      if (currentAgentType === AgentType.MEDICATION_INFO) {
        result = await getMedicationInfo(text);
        console.log("Medication info response received");
      } else if (currentAgentType === AgentType.MEDICATION_PRICES) {
        result = await getMedicationPrices(text);
        console.log("Medication prices response received");
      } else if (currentAgentType === AgentType.GENERAL_QUESTION) {
        result = await askGeneralQuestion(text);
        console.log("General question response received");
      }
      
      // Add response to chat
      const responseContent = result.information || result.prices || result.answer || "Não foi possível obter uma resposta.";
      
      const responseMsg: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => 
        [...prev.filter(msg => msg.id !== processingMsg.id), responseMsg]
      );
      
      // Clear input
      setInputValue("");
      
    } catch (error: any) {
      console.error("Error processing request:", error);
      
      // Extract error message from response if possible
      let errorMessage = "Houve um erro ao processar sua solicitação. Por favor, tente novamente.";
      
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Add error message to chat
      const errorMsg: Message = {
        id: Date.now().toString(),
        content: `Erro: ${errorMessage}`,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev.filter(msg => 
        msg.id !== (Date.now() + 1).toString()), errorMsg]);
      
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBackClick = () => {
    console.log("Back button clicked, navigating to home page");
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-white shadow-[0px_2px_10px_#00507d14]">
        <div className="flex items-center justify-between h-full px-8">
          <div className="flex items-center h-[45px] cursor-pointer" onClick={handleBackClick}>
            <div className="w-[39px] h-[45px] bg-[url(/group-34.png)] bg-[100%_100%]" />
            <div className="ml-6 text-[14.6px] whitespace-nowrap font-['Archivo',Helvetica]">
              <span className="text-[#565656]">Exam </span>
              <span className="font-bold text-[#565656]">Mine</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="ml-8 font-semibold text-sm text-[#1760c6] cursor-pointer hover:underline"
              onClick={handleBackClick}
            >
              Voltar
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-6">
        <div className="container px-4 mx-auto">
          <Card className="max-w-4xl p-6 mx-auto shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8">
                <img
                  className="object-contain w-full h-full"
                  alt="Agent icon"
                  src={agent.icon}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#375375] mb-1">
                  {agent.name}
                </h1>
                <p className="text-[#677788]">
                  {agent.description}
                </p>
              </div>
            </div>

            <ChatInterface messages={messages} />

            <div className="mt-6">
              {agent.inputType === "file" && (
                <>
                  <FileUpload
                    ref={fileInputRef}
                    onFileUpload={handleFileUpload}
                    isUploading={isProcessing}
                    acceptedFileTypes={agent.fileTypes || ""}
                  />

                  <Button
                    onClick={triggerFileUpload}
                    className={`w-full max-w-sm ${agent.color} hover:opacity-90 text-white mt-4`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <ClipLoader size={16} color="#ffffff" />
                        <span>Processando...</span>
                      </div>
                    ) : (
                      agent.buttonText
                    )}
                  </Button>
                </>
              )}

              {agent.inputType === "text" && (
                <TextInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSubmit={() => handleTextSubmit(inputValue)}
                  placeholder={agent.inputPlaceholder || ""}
                  buttonText={agent.buttonText}
                  buttonColor={agent.color}
                  isProcessing={isProcessing}
                  disabled={isProcessing}
                />
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};