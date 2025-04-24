const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin with fallback for local development
let firebaseInitialized = true;
try {
  // Initialize Firebase Admin SDK
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        "type": "service_account",
        "project_id": "exam-mine"
        // In production, this would have proper service account credentials
      };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "exam-mine"
  });
  
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  firebaseInitialized = false;
}

// Create database reference only if Firebase initialized successfully
const db = firebaseInitialized ? admin.firestore() : null;

// Create Express app
const app = express();
const port = process.env.PORT || 8000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create a form parser middleware for parsing form data without file upload
const formParser = multer().none();

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  // Skip token verification if Firebase is not initialized
  if (!firebaseInitialized) {
    console.warn("Firebase not initialized, skipping token verification");
    req.user = { uid: "test-uid", email: "test@example.com" };
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'No authentication token provided' });
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
};

// Helper to safely save interaction to Firestore
const saveInteraction = async (userData, agentType, question, answer) => {
  if (!firebaseInitialized || !db) {
    console.warn("Firebase not initialized, skipping interaction save");
    return;
  }
  
  try {
    await db.collection('interactions').add({
      uid: userData.uid,
      user_email: userData.email,
      agent_type: agentType,
      question: question,
      answer: answer,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Interaction saved for user ${userData.email}, agent ${agentType}`);
  } catch (error) {
    console.error('Error saving interaction:', error);
  }
};

// Routes that don't require authentication
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Exam Mine API' });
});

// IMPORTANT: These are now Express routes that match what the frontend is calling
// Handler for analyzing exam
app.post('/agents/analyze-exam', verifyFirebaseToken, upload.single('file'), async (req, res) => {
  try {
    console.log("Received exam analysis request");
    
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }
    
    // Log file details
    console.log(`File uploaded: ${req.file.originalname}, size: ${req.file.size} bytes`);
    
    // Create a unique session ID
    const sessionId = Date.now().toString();
    
    // Mock analysis - in a real implementation, you would:
    // 1. Extract text from the PDF
    // 2. Use an AI service to analyze it
    
    // Simulate processing time
    console.log("Processing exam file...");
    
    // Mock analysis response
    const analysisResponse = `## ✅ Resumo geral do exame

Este é um hemograma completo, com análise de células sanguíneas e marcadores bioquímicos básicos.

## 📊 Principais resultados

- **Hemoglobina**: 14.2 g/dL (normal)
- **Leucócitos**: 6.500/mm³ (normal)
- **Plaquetas**: 230.000/mm³ (normal)
- **Glicose**: 92 mg/dL (normal)
- **Colesterol total**: **210 mg/dL** (levemente elevado)

## ⚠️ Alertas e observações

O colesterol total está ligeiramente acima do valor de referência (< 200 mg/dL), mas não representa um risco imediato.

## 💡 Possíveis causas ou hipóteses

O colesterol elevado pode estar relacionado a fatores dietéticos, sedentarismo ou predisposição genética.

## 🩺 Recomendações gerais

É recomendável adotar uma alimentação mais equilibrada, rica em fibras e pobre em gorduras saturadas. A prática regular de atividades físicas também é importante para o controle do colesterol.

Esta análise não substitui a consulta com um profissional de saúde. Procure orientação médica presencial para interpretação completa e conduta adequada.`;

    // Save interaction to Firestore if user is authenticated
    await saveInteraction(
      req.user,
      'exam-analyzer',
      `Upload do arquivo: ${req.file.originalname}`,
      analysisResponse
    );
    
    console.log("Exam analysis complete, sending response");
    res.json({
      session_id: sessionId,
      analysis: analysisResponse
    });
    
  } catch (error) {
    console.error('Error processing exam:', error);
    res.status(500).json({ detail: 'Error processing exam: ' + error.message });
  }
});

// Handler for exam follow-up questions
app.post('/agents/exam-question', verifyFirebaseToken, express.json(), async (req, res) => {
  try {
    console.log("Received exam follow-up question");
    const { question, session_id } = req.body;
    
    if (!question || !session_id) {
      return res.status(400).json({ detail: 'Question and session ID are required' });
    }
    
    console.log(`Question: "${question}" for session: ${session_id}`);
    
    // Mock response - in a real implementation, you would retrieve the exam data and use an AI service
    const answerResponse = `Com base no seu exame, posso responder que ${question}

Os valores de referência para o colesterol total são:
- Desejável: abaixo de 200 mg/dL
- Limítrofe: entre 200 e 239 mg/dL
- Elevado: acima de 240 mg/dL

Seu valor de 210 mg/dL está na faixa limítrofe, o que sugere atenção, mas não representa um risco imediato para a saúde. É recomendável adotar hábitos alimentares mais saudáveis e praticar exercícios físicos regularmente para reduzir esses níveis.

Esta resposta não substitui a consulta com um profissional de saúde.`;
    
    // Save interaction to Firestore if user is authenticated
    await saveInteraction(
      req.user,
      'exam-follow-up', 
      question,
      answerResponse
    );
    
    console.log("Sending exam follow-up response");
    res.json({ answer: answerResponse });
    
  } catch (error) {
    console.error('Error processing exam question:', error);
    res.status(500).json({ detail: 'Error processing exam question: ' + error.message });
  }
});

// Handler for medication info - no authentication required
app.post('/agents/medication-info', formParser, async (req, res) => {
  try {
    console.log("Received medication info request", req.body);
    
    const medication_name = req.body.medication_name;
    
    if (!medication_name) {
      return res.status(400).json({ detail: 'Medication name is required' });
    }
    
    console.log(`Looking up info for: ${medication_name}`);
    
    // Mock response - in a real implementation, you would scrape websites and use an AI service
    const infoResponse = `# ${medication_name}

## Descrição geral e propósito
Este medicamento é comumente utilizado para o tratamento de diversos sintomas, incluindo dores de cabeça, febre e inflamações.

## Princípios ativos principais
Contém componentes ativos que ajudam a reduzir a dor e a inflamação no corpo.

## Indicações de uso
Indicado para alívio temporário de dores leves a moderadas e redução de febre.

## Contraindicações
Não deve ser utilizado por pessoas com hipersensibilidade aos componentes da fórmula ou com histórico de reações alérgicas a medicamentos similares.

## Efeitos colaterais comuns
Pode causar desconforto estomacal, náuseas e, em casos raros, reações alérgicas.

## Interações medicamentosas relevantes
Pode interagir com anticoagulantes, aumentando o risco de sangramentos. Consulte um médico se estiver tomando outros medicamentos.

## Dosagem típica
A dosagem comum para adultos é de 1 comprimido a cada 6-8 horas, não excedendo 4 comprimidos em 24 horas.

## Precauções especiais
Use com cautela em pacientes com problemas hepáticos, renais ou gastrointestinais. Não é recomendado para uso prolongado sem supervisão médica.

Esta informação tem caráter educativo e não substitui a orientação de um profissional de saúde ou a bula oficial do medicamento.`;
    
    console.log("Sending medication info response");
    res.json({ information: infoResponse });
    
  } catch (error) {
    console.error('Error getting medication info:', error);
    res.status(500).json({ detail: 'Error getting medication info: ' + error.message });
  }
});

// Handler for medication prices - no authentication required
app.post('/agents/medication-prices', formParser, async (req, res) => {
  try {
    console.log("Received medication prices request", req.body);
    
    const medication_name = req.body.medication_name;
    
    if (!medication_name) {
      return res.status(400).json({ detail: 'Medication name is required' });
    }
    
    console.log(`Looking up prices for: ${medication_name}`);
    
    // Mock response - in a real implementation, you would scrape websites and use an AI service
    const pricesResponse = `# Preços para ${medication_name}

## Faixa de preços
O preço deste medicamento varia entre R$ 12,90 e R$ 45,50, dependendo da versão (genérico, similar ou referência) e da farmácia.

## Preço médio aproximado
O preço médio encontrado é de R$ 28,70.

## Diferenças entre versões
- **Genérico**: Entre R$ 12,90 e R$ 19,50
- **Similar**: Entre R$ 20,00 e R$ 30,00
- **Referência**: Entre R$ 35,00 e R$ 45,50

## Sugestões para economizar
- Compare preços em diferentes farmácias antes de comprar
- Verifique programas de desconto oferecidos pelos fabricantes
- Considere a versão genérica, que é mais barata e tem a mesma eficácia
- Procure farmácias populares, que oferecem preços subsidiados

## Onde encontrar os melhores preços
As melhores ofertas foram encontradas nas redes Drogasil, Pague Menos e Droga Raia.

Os preços podem variar de acordo com a região e período de consulta.

## Links para Compra
1. [${medication_name} Genérico 20mg](https://www.example.com) - R$ 12,90
2. [${medication_name} Similar 20mg](https://www.example.com) - R$ 22,50
3. [${medication_name} Referência 20mg](https://www.example.com) - R$ 39,90`;
    
    console.log("Sending medication prices response");
    res.json({ prices: pricesResponse });
    
  } catch (error) {
    console.error('Error getting medication prices:', error);
    res.status(500).json({ detail: 'Error getting medication prices: ' + error.message });
  }
});

// Handler for general health questions - requires authentication
app.post('/agents/general-question', verifyFirebaseToken, express.json(), async (req, res) => {
  try {
    console.log("Received general health question");
    
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ detail: 'Question is required' });
    }
    
    console.log(`Question: "${question}"`);
    
    // Mock response - in a real implementation, you would use an AI service
    const answerResponse = `Em relação à sua pergunta: "${question}"

É importante entender que diversas condições de saúde podem apresentar sintomas semelhantes. Alterações no estilo de vida, como uma alimentação equilibrada, prática regular de exercícios físicos e redução do estresse, podem ajudar a melhorar sua saúde geral.

Recomendo consultar um profissional de saúde para uma avaliação adequada, diagnóstico preciso e tratamento personalizado.

Esta informação tem caráter geral e educativo, não substituindo a consulta com um profissional de saúde qualificado.`;
    
    // Save interaction to Firestore if user is authenticated
    await saveInteraction(
      req.user,
      'general-question', 
      question,
      answerResponse
    );
    
    console.log("Sending general question response");
    res.json({ answer: answerResponse });
    
  } catch (error) {
    console.error('Error processing general question:', error);
    res.status(500).json({ detail: 'Error processing general question: ' + error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Firebase status: ${firebaseInitialized ? 'Initialized' : 'Not initialized'}`);
});