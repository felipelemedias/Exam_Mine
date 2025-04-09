import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Log requests
api.interceptors.request.use((config) => {
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
  
  try {
    const response = await api.post("/agents/general-question", { question });
    console.log("General question response received");
    return response.data;
  } catch (error) {
    console.error("Error asking general question:", error);
    throw error;
  }
};

export default api;