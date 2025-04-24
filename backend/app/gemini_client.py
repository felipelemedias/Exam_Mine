import google.generativeai as genai
import os
import logging
from dotenv import load_dotenv
from .scrapers import MedicationInfoScraper, MedicationPriceScraper

# Load environment variables
load_dotenv()

# Set up logger
logger = logging.getLogger("exam-analyzer-api")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# Configure the Gemini API with the key
genai.configure(api_key=GEMINI_API_KEY)

# Define the fully qualified model name with generation config
# Use the correct model name format
MODEL_NAME = "models/gemini-1.5-pro"

# In-memory storage for exam data - this will map session_id to exam content
# In a production system, you'd likely use a database or Redis instead
exam_storage = {}

def get_available_models():
    """
    Get a list of available models from the Gemini API
    """
    try:
        logger.info("Listing available Gemini models")
        models = genai.list_models()
        model_names = [model.name for model in models]
        logger.info(f"Available models: {model_names}")
        return model_names
    except Exception as e:
        logger.error(f"Error listing Gemini models: {str(e)}")
        return []

def analyze_exam(exam_content, session_id=None):
    """
    Agent 1: Send exam content to Gemini API for analysis
    
    Args:
        exam_content (str): Extracted text content from the exam PDF
        session_id (str, optional): Session ID to store exam content for follow-up questions
        
    Returns:
        str: Analysis results from Gemini
    """
    logger.info(f"Initializing Gemini model for exam analysis using model: {MODEL_NAME}")
    
    try:
        # Ensure exam_content is properly encoded as UTF-8
        if not isinstance(exam_content, str):
            logger.warning("Converting exam_content to string with UTF-8 encoding")
            exam_content = str(exam_content).encode('utf-8', 'ignore').decode('utf-8')
        
        # Store exam content for future reference if session_id is provided
        if session_id:
            # Ensure session_id is properly encoded as UTF-8
            safe_session_id = str(session_id).encode('utf-8', 'ignore').decode('utf-8')
            logger.info(f"Storing exam content for session: {safe_session_id}")
            exam_storage[safe_session_id] = exam_content
        
        # Initialize the Gemini model with the correct model name format
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Create prompt for analysis - ensuring UTF-8 encoding
        prompt = f"""
        Você é um assistente médico especializado em interpretação de exames.

        Analise o conteúdo a seguir e responda seguindo exatamente esta estrutura de seções:

        ✅ Resumo geral do exame
        Dê um panorama inicial sobre o que foi avaliado no exame.

        📊 Principais resultados
        Liste os principais marcadores do exame com breves explicações. Destaque os valores alterados com ênfase.

        ⚠️ Alertas e observações
        Se houver valores críticos, explique-os aqui com clareza e sem alarmismo.

        💡 Possíveis causas ou hipóteses
        Sugira causas prováveis para os resultados alterados, mas sem dar diagnóstico.

        🩺 Recomendações gerais
        Dê orientações claras sobre como o paciente pode seguir com o caso (ex: procurar médico, mudar hábitos, etc).

        Instruções obrigatórias para a IA:

        Use emojis nos títulos exatamente como está acima.

        Utilize negrito para nomes dos exames e valores numéricos importantes.

        Escreva de forma leve, gentil e didática.

        Não pule nenhum dos 5 blocos.

        Ao final, inclua a seguinte observação: "Esta análise não substitui a consulta com um profissional de saúde. Procure orientação médica presencial para interpretação completa e conduta adequada."

        EXAME:
        {exam_content}
        """
        
        # Ensure prompt is properly encoded UTF-8
        prompt = str(prompt).encode('utf-8', 'ignore').decode('utf-8')
        logger.info("Sending exam analysis request to Gemini API")
        
        # Use the generate_content method with safety settings
        generation_config = {
            "temperature": 0.4,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
        
        response = model.generate_content(
            contents=prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        logger.info("Received exam analysis response from Gemini API")
        
        # Return the response text, ensuring it's UTF-8 encoded
        response_text = ""
        if hasattr(response, 'text'):
            response_text = response.text
        elif hasattr(response, 'parts'):
            # For newer API versions that might use parts
            response_text = ''.join(part.text for part in response.parts)
        else:
            # Fallback to string representation
            response_text = str(response)
        
        # Ensure the response is properly encoded UTF-8
        response_text = str(response_text).encode('utf-8', 'ignore').decode('utf-8')
            
        return response_text
        
    except Exception as e:
        logger.error(f"Error in Gemini API request for exam analysis: {str(e)}")
        # Try to provide more helpful error information
        error_message = str(e)
        if "not found" in error_message.lower() and "model" in error_message.lower():
            available_models = get_available_models()
            error_message += f". Available models: {available_models}"
        
        raise Exception(f"Failed to analyze exam with Gemini API: {error_message}")

def analyze_and_answer(question, session_id):
    """
    Unified function that combines exam analysis with follow-up questions.
    Maintains context of the previously analyzed exam.
    
    Args:
        question (str): User's follow-up question about the exam
        session_id (str): Session ID to retrieve the stored exam content
        
    Returns:
        str: Answer to the question based on the exam context
    """
    # Ensure session_id is properly encoded as UTF-8
    safe_session_id = str(session_id).encode('utf-8', 'ignore').decode('utf-8')
    # Ensure question is properly encoded as UTF-8
    safe_question = str(question).encode('utf-8', 'ignore').decode('utf-8')
    
    logger.info(f"Processing follow-up question for session {safe_session_id}: {safe_question}")
    
    try:
        # Retrieve the stored exam content for this session
        exam_content = exam_storage.get(safe_session_id)
        
        if not exam_content:
            logger.warning(f"No exam content found for session {safe_session_id}")
            return "Não foi possível encontrar o exame associado a esta sessão. Por favor, envie o exame novamente."
        
        # Initialize the Gemini model with the correct model name format
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Create prompt that combines the exam content with the follow-up question
        prompt = f"""
        Você é um assistente médico especializado em interpretação de exames.
        
        O usuário enviou o seguinte exame médico:
        
        {exam_content}
        
        Agora o usuário fez a seguinte pergunta sobre esse exame:
        
        "{safe_question}"
        
        Instruções:
        
        1. Responda apenas com base nas informações contidas no exame.
        2. Se a pergunta se referir a um marcador ou valor específico, destaque esse valor em negrito e explique seu significado.
        3. Se a pergunta for sobre uma condição médica relacionada, explique como os valores no exame podem ou não estar associados.
        4. Use linguagem clara, didática e acessível, evitando termos técnicos desnecessários.
        5. Não dê diagnósticos definitivos, apenas explicações e interpretações dos dados disponíveis.
        6. Se a pergunta não puder ser respondida com os dados do exame, indique isso claramente.
        
        Sua resposta deve ser escrita de forma leve, gentil e didática, sem causar alarme desnecessário.
        """
        
        # Ensure prompt is properly encoded UTF-8
        prompt = str(prompt).encode('utf-8', 'ignore').decode('utf-8')
        logger.info("Sending follow-up question to Gemini API")
        
        # Use the generate_content method with configuration
        generation_config = {
            "temperature": 0.4,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        response = model.generate_content(
            contents=prompt,
            generation_config=generation_config
        )
        
        logger.info("Received follow-up question response from Gemini API")
        
        # Return the response text, ensuring it's UTF-8 encoded
        response_text = ""
        if hasattr(response, 'text'):
            response_text = response.text
        elif hasattr(response, 'parts'):
            # For newer API versions that might use parts
            response_text = ''.join(part.text for part in response.parts)
        else:
            # Fallback to string representation
            response_text = str(response)
        
        # Ensure the response is properly encoded UTF-8
        response_text = str(response_text).encode('utf-8', 'ignore').decode('utf-8')
            
        return response_text
        
    except Exception as e:
        logger.error(f"Error in Gemini API request for follow-up question: {str(e)}")
        raise Exception(f"Failed to answer follow-up question: {str(e)}")

def search_medication_info(medication_name):
    """
    Agent 2: Search for medication information using web scraping + Gemini
    
    Args:
        medication_name (str): Name of the medication to look up
        
    Returns:
        str: Information about the medication
    """
    # Ensure medication_name is properly encoded as UTF-8
    safe_medication_name = str(medication_name).encode('utf-8', 'ignore').decode('utf-8')
    logger.info(f"Searching medication info for: {safe_medication_name}")
    
    try:
        # Step 1: Scrape medication information from web sources
        scraper = MedicationInfoScraper()
        scraped_info = scraper.search(safe_medication_name)
        
        # Log the scraped content (shortened for log readability)
        content_preview = ""
        if scraped_info.get("content"):
            content = str(scraped_info.get("content")).encode('utf-8', 'ignore').decode('utf-8')
            content_preview = content[:200] + "..." if len(content) > 200 else content
            
        source = str(scraped_info.get("source", "Unknown")).encode('utf-8', 'ignore').decode('utf-8')
        logger.info(f"Scraped info for {safe_medication_name}, content preview: {content_preview}")
        logger.info(f"Source: {source}")
        
        # Step 2: Use Gemini to enhance and format the information
        model = genai.GenerativeModel(MODEL_NAME)
        
        # If we have scraped content, use it as the basis for Gemini's response
        if scraped_info.get("content"):
            # Ensure content is properly encoded UTF-8
            content = str(scraped_info.get("content")).encode('utf-8', 'ignore').decode('utf-8')
            source = str(scraped_info.get("source", "Unknown")).encode('utf-8', 'ignore').decode('utf-8')
            
            prompt = f"""
            Você é um assistente especializado em informações sobre medicamentos.
            
            Abaixo estão informações coletadas de uma fonte confiável sobre o medicamento "{safe_medication_name}".
            Por favor, reformate e organize estas informações em uma resposta clara e didática.
            
            Inclua as seguintes seções:
            
            1. Descrição geral e propósito do medicamento
            2. Princípios ativos principais
            3. Indicações de uso
            4. Contraindicações
            5. Efeitos colaterais comuns
            6. Interações medicamentosas relevantes (se disponível)
            7. Dosagem típica (se disponível)
            8. Precauções especiais
            
            Informações coletadas:
            {content}
            
            Fonte: {source}
            
            Observação: Esta informação tem caráter educativo e não substitui a orientação de um profissional de saúde ou a bula oficial do medicamento.
            """
        else:
            # Fallback to using Gemini for information generation if scraping failed
            prompt = f"""
            Você é um assistente especializado em informações sobre medicamentos.
            
            Forneça informações detalhadas sobre o medicamento "{safe_medication_name}" em português.
            Inclua as seguintes informações:
            
            1. Descrição geral e propósito do medicamento
            2. Princípios ativos principais
            3. Indicações de uso
            4. Contraindicações
            5. Efeitos colaterais comuns
            6. Interações medicamentosas relevantes
            7. Dosagem típica (adulto e infantil, se aplicável)
            8. Precauções especiais
            
            Sua resposta deve ser informativa, mas também acessível para pacientes sem conhecimento médico avançado.
            
            Importante: Indique claramente que esta informação tem caráter educativo e não substitui a orientação de um profissional de saúde ou a bula oficial do medicamento.
            """
        
        # Ensure prompt is properly encoded UTF-8
        prompt = str(prompt).encode('utf-8', 'ignore').decode('utf-8')
        logger.info(f"Sending medication info to Gemini for formatting: {safe_medication_name}")
        
        # Use the generate_content method with configuration
        generation_config = {
            "temperature": 0.4,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        response = model.generate_content(
            contents=prompt,
            generation_config=generation_config
        )
        
        logger.info(f"Received medication info response from Gemini API: {safe_medication_name}")
        
        # Get the formatted response
        formatted_response = ""
        if hasattr(response, 'text'):
            formatted_response = response.text
        elif hasattr(response, 'parts'):
            formatted_response = ''.join(part.text for part in response.parts)
        else:
            formatted_response = str(response)
        
        # Ensure the response is properly encoded UTF-8
        formatted_response = str(formatted_response).encode('utf-8', 'ignore').decode('utf-8')
            
        # If we have a source, append it to the response
        if scraped_info.get("source"):
            source = str(scraped_info.get("source")).encode('utf-8', 'ignore').decode('utf-8')
            formatted_response += f"\n\nFonte: {source}"
        
        return formatted_response
        
    except Exception as e:
        logger.error(f"Error in medication info processing: {str(e)}")
        raise Exception(f"Failed to get medication info: {str(e)}")

def search_medication_prices(medication_name):
    """
    Agent 3: Search for medication prices using web scraping + Gemini
    
    Args:
        medication_name (str): Name of the medication to look up prices for
        
    Returns:
        str: Price information for the medication
    """
    # Ensure medication_name is properly encoded as UTF-8
    safe_medication_name = str(medication_name).encode('utf-8', 'ignore').decode('utf-8')
    logger.info(f"Searching medication prices for: {safe_medication_name}")
    
    try:
        # Step 1: Scrape medication prices from web sources
        scraper = MedicationPriceScraper()
        scraped_prices = scraper.search(safe_medication_name)
        
        # Log the scraped content
        num_sources = len(scraped_prices.get('sources', []))
        num_products = len(scraped_prices.get('products', []))
        logger.info(f"Scraped prices for {safe_medication_name} from {num_sources} sources")
        logger.info(f"Found {num_products} products")
        
        # Step 2: Use Gemini to format and present the price information
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Format the products for inclusion in the prompt
        product_lines = []
        for i, product in enumerate(scraped_prices.get('products', [])[:15]):  # Limit to 15 products
            # Ensure all product data is properly encoded
            name = str(product.get('name', 'Produto')).encode('utf-8', 'ignore').decode('utf-8')
            price = product.get('price', 0.0)
            price_text = str(product.get('price_text', f"R$ {price:.2f}")).encode('utf-8', 'ignore').decode('utf-8')
            source = str(product.get('source', 'Desconhecida')).encode('utf-8', 'ignore').decode('utf-8')
            
            product_lines.append(f"{i+1}. {name} - {price_text} - Fonte: {source}")
        
        product_text = "\n".join(product_lines)
        
        # Format sources as UTF-8 encoded strings
        sources = [str(s).encode('utf-8', 'ignore').decode('utf-8') for s in scraped_prices.get('sources', ['Não especificado'])]
        
        # If we have scraped products, use them as the basis for Gemini's response
        if product_lines:
            prompt = f"""
            Você é um assistente especializado em informações sobre preços de medicamentos no Brasil.
            
            Abaixo estão informações coletadas sobre preços do medicamento "{safe_medication_name}" de diferentes fontes.
            Por favor, analise estas informações e forneça um resumo claro e útil sobre os preços encontrados.
            
            Inclua:
            
            1. Faixa de preço encontrada (menor e maior preço)
            2. Preço médio aproximado
            3. Diferenças entre versões do medicamento (genérico, similar, referência), se identificáveis
            4. Sugestões para economizar na compra deste medicamento
            5. Onde encontrar os melhores preços com base nos dados
            
            Produtos encontrados:
            {product_text}
            
            Fontes consultadas: {', '.join(sources)}
            
            Observação: Os preços podem variar de acordo com a região e período de consulta.
            """
        else:
            # Fallback to using Gemini for price information generation if scraping failed
            prompt = f"""
            Você é um assistente especializado em informações sobre preços de medicamentos no Brasil.
            
            Forneça informações sobre preços e disponibilidade do medicamento "{safe_medication_name}" em português.
            Inclua as seguintes informações:
            
            1. Faixa de preço típica para este medicamento
            2. Versões disponíveis (genérico, similar, referência)
            3. Diferenças de preço entre as versões
            4. Dicas para economizar na compra deste medicamento
            5. Programas de desconto disponíveis (se aplicável)
            6. Onde encontrar o medicamento pelo melhor preço
            
            Sua resposta deve ser prática e orientada para ajudar o paciente a encontrar o medicamento pelo melhor preço possível.
            
            Importante: Indique claramente que esta informação tem caráter orientativo e que os preços podem variar de acordo com a região e o período.
            """
        
        # Ensure prompt is properly encoded UTF-8
        prompt = str(prompt).encode('utf-8', 'ignore').decode('utf-8')
        logger.info(f"Sending medication price info to Gemini for formatting: {safe_medication_name}")
        
        # Use the generate_content method with configuration
        generation_config = {
            "temperature": 0.4,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        response = model.generate_content(
            contents=prompt,
            generation_config=generation_config
        )
        
        logger.info(f"Received medication prices response from Gemini API: {safe_medication_name}")
        
        # Get the formatted response
        formatted_response = ""
        if hasattr(response, 'text'):
            formatted_response = response.text
        elif hasattr(response, 'parts'):
            formatted_response = ''.join(part.text for part in response.parts)
        else:
            formatted_response = str(response)
        
        # Ensure the response is properly encoded UTF-8
        formatted_response = str(formatted_response).encode('utf-8', 'ignore').decode('utf-8')
            
        # Add links to the products if available
        if product_lines:
            formatted_response += "\n\n## Links para Compra\n\n"
            for i, product in enumerate(scraped_prices.get('products', [])[:5]):  # Limit to 5 links
                # Ensure all product data is properly encoded UTF-8
                name = str(product.get('name', 'Produto')).encode('utf-8', 'ignore').decode('utf-8')
                price_text = str(product.get('price_text', '')).encode('utf-8', 'ignore').decode('utf-8')
                
                if product.get('url'):
                    url = str(product.get('url')).encode('utf-8', 'ignore').decode('utf-8')
                    formatted_response += f"{i+1}. [{name}]({url}) - {price_text}\n"
        
        return formatted_response
        
    except Exception as e:
        logger.error(f"Error in medication price processing: {str(e)}")
        raise Exception(f"Failed to get medication prices: {str(e)}")

def answer_general_question(question):
    """
    Agent 4: Answer general health questions using Gemini
    
    Args:
        question (str): User's health-related question
        
    Returns:
        str: Answer to the question
    """
    logger.info(f"Initializing Gemini model for general question using model: {MODEL_NAME}")
    
    try:
        # Ensure question is properly encoded as UTF-8
        safe_question = str(question).encode('utf-8', 'ignore').decode('utf-8')
            
        # Initialize the Gemini model with the correct model name format
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Create prompt for general question
        prompt = f"""
        Você é um assistente especializado em assuntos relacionados à saúde.
        
        Responda à seguinte pergunta de saúde em português de forma clara e acessível:
        
        "{safe_question}"
        
        Sua resposta deve:
        1. Ser baseada em informações médicas precisas
        2. Ser compreensível para pessoas sem conhecimento médico avançado
        3. Ser equilibrada e não alarmista
        4. Incluir ressalvas quando apropriado
        5. Sugerir quando seria adequado consultar um profissional de saúde
        
        Lembre-se de que está fornecendo informações gerais, não aconselhamento médico personalizado.
        """
        
        # Ensure prompt is properly encoded UTF-8
        prompt = str(prompt).encode('utf-8', 'ignore').decode('utf-8')
        logger.info(f"Sending general question to Gemini API: {safe_question}")
        
        # Use the generate_content method with configuration
        generation_config = {
            "temperature": 0.4,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        response = model.generate_content(
            contents=prompt,
            generation_config=generation_config
        )
        
        logger.info("Received general question response from Gemini API")
        
        # Return the response text
        response_text = ""
        if hasattr(response, 'text'):
            response_text = response.text
        elif hasattr(response, 'parts'):
            # For newer API versions that might use parts
            response_text = ''.join(part.text for part in response.parts)
        else:
            # Fallback to string representation
            response_text = str(response)
        
        # Ensure the response is properly encoded UTF-8
        response_text = str(response_text).encode('utf-8', 'ignore').decode('utf-8')
            
        return response_text
        
    except Exception as e:
        logger.error(f"Error in Gemini API request for general question: {str(e)}")
        raise Exception(f"Failed to answer question with Gemini API: {str(e)}")