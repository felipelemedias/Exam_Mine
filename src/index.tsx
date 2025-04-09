import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExamMine } from "./screens/ExamMine/ExamMine";
import { AgentChat } from "./screens/AgentChat/AgentChat";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExamMine />} />
        <Route path="/agent/:agentType" element={<AgentChat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);