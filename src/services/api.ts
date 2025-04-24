import axios from "axios";
import authService from './authService';

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Include credentials (cookies) in requests
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    // Get the Firebase ID token
    const token = await authService.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error adding auth token to request:", error);
  }
  
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  return config;
});

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.message, error.config?.url);
    return Promise.reject(error);
  }
);

// Fix the API URLs - remove the "api/" prefix
// API functions for each agent
export const analyzeExam = async (file: File) => {
  console.log("Upload initiated for file:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");
  
  // File size validation (client-side)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    console.error("File too large:", file.size, "bytes (max:", MAX_FILE_SIZE, "bytes)");
    throw new Error("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
  }
  
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await api.post("/agents/analyze-exam", formData);
    console.log("Upload completed for file:", file.name);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const askExamQuestion = async (question: string, sessionId: string) => {
  console.log("Exam follow-up question:", question, "for session:", sessionId);
  
  const formData = new FormData();
  formData.append("question", question);
  formData.append("session_id", sessionId);
  
  try {
    const response = await api.post("/agents/exam-question", formData);
    console.log("Exam follow-up question response received");
    return response.data;
  } catch (error) {
    console.error("Error asking exam follow-up question:", error);
    throw error;
  }
};

export const getMedicationInfo = async (medicationName: string) => {
  console.log("Medication info request for:", medicationName);
  
  const formData = new FormData();
  formData.append("medication_name", medicationName);
  
  try {
    const response = await api.post("/agents/medication-info", formData);
    console.log("Medication info response received");
    return response.data;
  } catch (error) {
    console.error("Error getting medication info:", error);
    throw error;
  }
};

export const getMedicationPrices = async (medicationName: string) => {
  console.log("Medication prices request for:", medicationName);
  
  const formData = new FormData();
  formData.append("medication_name", medicationName);
  
  try {
    const response = await api.post("/agents/medication-prices", formData);
    console.log("Medication prices response received");
    return response.data;
  } catch (error) {
    console.error("Error getting medication prices:", error);
    throw error;
  }
};

export const askGeneralQuestion = async (question: string) => {
  console.log("General question request:", question);
  
  const formData = new FormData();
  formData.append("question", question);
  
  try {
    const response = await api.post("/agents/general-question", formData);
    console.log("General question response received");
    return response.data;
  } catch (error) {
    console.error("Error asking general question:", error);
    throw error;
  }
};

// Get user's interaction history from Firebase
export const getUserHistory = async (limit = 50, offset = 0) => {
  console.log("Getting user interaction history");
  
  try {
    const result = await import('./firebase.service').then(module => 
      module.default.getUserInteractions(limit)
    );
    console.log("User history received, entries:", result.interactions?.length || 0);
    return result.interactions || [];
  } catch (error) {
    console.error("Error getting user history:", error);
    throw error;
  }
};

export default api;