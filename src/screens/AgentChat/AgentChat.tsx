import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FileUpload } from "../../components/Chat/FileUpload";
import { ChatInterface } from "../../components/Chat/ChatInterface";
import { TextInput } from "../../components/Chat/TextInput";
import { analyzeExam, getMedicationInfo, getMedicationPrices, askGeneralQuestion, askExamQuestion } from "../../services/api";
import { Message } from "../../types/chat";
import { AgentType, AGENTS } from "../../types/agents";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../contexts/AuthContext";
import { AppHeader } from "../../components/Header/AppHeader";
import firebaseService from "../../services/firebase.service";

export const AgentChat: React.FC = () => {
  const { agentType } = useParams<{ agentType: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  // Check if this is the protected exam-analyzer route
  const isProtectedRoute = agentType === AgentType.EXAM_ANALYZER;
  
  // Redirect to login if trying to access protected route without auth
  useEffect(() => {
    if (isProtectedRoute && !authState.isAuthenticated && !authState.loading) {
      navigate('/login');
    }
  }, [isProtectedRoute, authState.isAuthenticated, authState.loading, navigate]);
  
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
  
  // State to store the session ID for the exam-question feature
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [hasUploadedExam, setHasUploadedExam] = useState(false);
  
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
    setCurrentSessionId(null);
    setHasUploadedExam(false);
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
      
      // Store the session ID for follow-up questions
      if (result.session_id) {
        setCurrentSessionId(result.session_id);
        setHasUploadedExam(true);
        console.log("Stored session ID:", result.session_id);
      }
      
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
      
      // Save interaction to Firebase
      if (authState.isAuthenticated) {
        await firebaseService.saveInteraction(
          'exam-analyzer',
          `Upload do arquivo: ${file.name}`,
          result.analysis
        );
      }
      
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
      let responseContent = "";
      console.log(`Processing request for agent: ${currentAgentType}`);
      
      if (currentAgentType === AgentType.EXAM_ANALYZER && hasUploadedExam && currentSessionId) {
        // Special case: this is a follow-up question about the exam
        result = await askExamQuestion(text, currentSessionId);
        responseContent = result?.answer || "Não foi possível obter uma resposta.";
        console.log("Exam follow-up response received");
      } else if (currentAgentType === AgentType.MEDICATION_INFO) {
        result = await getMedicationInfo(text);
        responseContent = result?.information || "Não foi possível obter informações sobre o medicamento.";
        console.log("Medication info response received");
      } else if (currentAgentType === AgentType.MEDICATION_PRICES) {
        result = await getMedicationPrices(text);
        responseContent = result?.prices || "Não foi possível obter preços para o medicamento.";
        console.log("Medication prices response received");
      } else if (currentAgentType === AgentType.GENERAL_QUESTION) {
        result = await askGeneralQuestion(text);
        responseContent = result?.answer || "Não foi possível responder a sua pergunta.";
        console.log("General question response received");
      }
      
      // Add response to chat
      const responseMsg: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => 
        [...prev.filter(msg => msg.id !== processingMsg.id), responseMsg]
      );
      
      // Save interaction to Firebase if authenticated
      if (authState.isAuthenticated && (
        currentAgentType === AgentType.EXAM_ANALYZER ||
        currentAgentType === AgentType.GENERAL_QUESTION
      )) {
        await firebaseService.saveInteraction(
          currentAgentType,
          text,
          responseContent
        );
      }
      
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

  // Determine which input type to show
  const determineInputType = () => {
    // For exam analyzer, show file upload initially, but switch to text input after upload
    if (currentAgentType === AgentType.EXAM_ANALYZER && hasUploadedExam) {
      return "text";
    }
    return agent.inputType;
  };

  // If loading auth state and it's a protected route, show loading
  if (authState.loading && isProtectedRoute) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#1760C6" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Use the AppHeader component */}
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-6">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative w-8 h-8">
                <img
                  className="w-full h-full object-contain"
                  alt="Agent icon"
                  src={agent.icon}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#375375] mb-1">
                  {agent.name}
                </h1>
                <p className="text-[#677788]">
                  {hasUploadedExam && currentAgentType === AgentType.EXAM_ANALYZER 
                    ? "Agora você pode fazer perguntas relacionadas ao seu exame" 
                    : agent.description}
                </p>
              </div>
            </div>

            <ChatInterface messages={messages} />

            <div className="mt-6">
              {determineInputType() === "file" && (
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

              {determineInputType() === "text" && (
                <TextInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSubmit={() => handleTextSubmit(inputValue)}
                  placeholder={hasUploadedExam && currentAgentType === AgentType.EXAM_ANALYZER 
                    ? "Faça uma pergunta sobre seu exame..." 
                    : agent.inputPlaceholder || ""}
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