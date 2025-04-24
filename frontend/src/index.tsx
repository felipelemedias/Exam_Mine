import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExamMine } from "./screens/ExamMine/ExamMine";
import { AgentChat } from "./screens/AgentChat/AgentChat";
import { LoginScreen } from "./screens/Auth/LoginScreen";
import { RegisterScreen } from "./screens/Auth/RegisterScreen";
import { HistoryScreen } from "./screens/History/HistoryScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppHeader } from "./components/Header/AppHeader";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExamMine />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route 
            path="/agent/exam-analyzer" 
            element={
              <ProtectedRoute>
                <AgentChat />
              </ProtectedRoute>
            } 
          />
          <Route path="/agent/:agentType" element={<AgentChat />} />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <HistoryScreen />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);