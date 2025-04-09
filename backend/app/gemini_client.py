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

def analyze_exam(exam_content):
    """
    Agent 1: Send exam content to Gemini API for analysis
    
    Args:
        exam_content (str): Extracted text content from the exam PDF
        
    Returns:
        str: Analysis results from Gemini
    """
    logger.info(f"Initializing Gemini model for exam analysis using model: {MODEL_NAME}")
    
    try:
        # Initialize the Gemini model with the correct model name format
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Create prompt for analysis
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
        
        # Return the response text
        if hasattr(response, 'text'):
            return response.text
        elif hasattr(response, 'parts'):
            # For newer API versions that might use parts
            return ''.join(part.text for part in response.parts)
        else:
            # Fallback to string representation
            return str(response)
        
    except Exception as e:
        logger.error(f"Error in Gemini API request for exam analysis: {str(e)}")
        # Try to provide more helpful error information
        error_message = str(e)
        if "not found" in error_message.lower() and "model" in error_message.lower():
            available_models = get_available_models()
            error_message += f". Available models: {available_models}"
        
        raise Exception(f"Failed to analyze exam with Gemini API: {error_message}")

def search_medication_info(medication_name):
    """
    Agent 2: Search for medication information using web scraping + Gemini
    
    Args:
        medication_name (str): Name of the medication to look up
        
    Returns:
        str: Information about the medication
    """
    logger.info(f"Searching medication info for: {medication_name}")
    
    try:
        # Step 1: Scrape medication information from web sources
        scraper = MedicationInfoScraper()
        scraped_info = scraper.search(medication_name)
        
        # Log the scraped content (shortened for log readability)
        content_preview = scraped_info.get("content", "")[:200] + "..." if len(scraped_info.get("content", "")) > 200 else scraped_info.get("content", "")
        logger.info(f"Scraped info for {medication_name}, content preview: {content_preview}")
        logger.info(f"Source: {scraped_info.get('source', 'Unknown')}")
        
        # Step 2: Use Gemini to enhance and format the information
        model = genai.GenerativeModel(MODEL_NAME)
        
        # If we have scraped content, use it as the basis for Gemini's response
        if scraped_info.get("content"):
            prompt = f"""
            Você é um assistente especializado em informações sobre medicamentos.
            
            Abaixo estão informações coletadas de uma fonte confiável sobre o medicamento "{medication_name}".
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
            {scraped_info['content']}
            
            Fonte: {scraped_info['source']}
            
            Observação: Esta informação tem caráter educativo e não substitui a orientação de um profissional de saúde ou a bula oficial do medicamento.
            """
        else:
            # Fallback to using Gemini for information generation if scraping failed
            prompt = f"""
            Você é um assistente especializado em informações sobre medicamentos.
            
            Forneça informações detalhadas sobre o medicamento "{medication_name}" em português.
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
        
        logger.info(f"Sending medication info to Gemini for formatting: {medication_name}")
        
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
        
        logger.info(f"Received medication info response from Gemini API: {medication_name}")
        
        # Get the formatted response
        formatted_response = ""
        if hasattr(response, 'text'):
            formatted_response = response.text
        elif hasattr(response, 'parts'):
            formatted_response = ''.join(part.text for part in response.parts)
        else:
            formatted_response = str(response)
        
        # If we have a source, append it to the response
        if scraped_info.get("source"):
            formatted_response += f"\n\nFonte: {scraped_info['source']}"
        
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
    logger.info(f"Searching medication prices for: {medication_name}")
    
    try:
        # Step 1: Scrape medication prices from web sources
        scraper = MedicationPriceScraper()
        scraped_prices = scraper.search(medication_name)
        
        # Log the scraped content
        logger.info(f"Scraped prices for {medication_name} from {len(scraped_prices.get('sources', []))} sources")
        logger.info(f"Found {len(scraped_prices.get('products', []))} products")
        
        # Step 2: Use Gemini to format and present the price information
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Format the products for inclusion in the prompt
        product_lines = []
        for i, product in enumerate(scraped_prices.get('products', [])[:15]):  # Limit to 15 products
            price_text = product.get('price_text', f"R$ {product.get('price', 0.0):.2f}")
            product_lines.append(f"{i+1}. {product.get('name', 'Produto')} - {price_text} - Fonte: {product.get('source', 'Desconhecida')}")
        
        product_text = "\n".join(product_lines)
        
        # If we have scraped products, use them as the basis for Gemini's response
        if product_lines:
            prompt = f"""
            Você é um assistente especializado em informações sobre preços de medicamentos no Brasil.
            
            Abaixo estão informações coletadas sobre preços do medicamento "{medication_name}" de diferentes fontes.
            Por favor, analise estas informações e forneça um resumo claro e útil sobre os preços encontrados.
            
            Inclua:
            
            1. Faixa de preço encontrada (menor e maior preço)
            2. Preço médio aproximado
            3. Diferenças entre versões do medicamento (genérico, similar, referência), se identificáveis
            4. Sugestões para economizar na compra deste medicamento
            5. Onde encontrar os melhores preços com base nos dados
            
            Produtos encontrados:
            {product_text}
            
            Fontes consultadas: {', '.join(scraped_prices.get('sources', ['Não especificado']))}
            
            Observação: Os preços podem variar de acordo com a região e período de consulta.
            """
        else:
            # Fallback to using Gemini for price information generation if scraping failed
            prompt = f"""
            Você é um assistente especializado em informações sobre preços de medicamentos no Brasil.
            
            Forneça informações sobre preços e disponibilidade do medicamento "{medication_name}" em português.
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
        
        logger.info(f"Sending medication price info to Gemini for formatting: {medication_name}")
        
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
        
        logger.info(f"Received medication prices response from Gemini API: {medication_name}")
        
        # Get the formatted response
        formatted_response = ""
        if hasattr(response, 'text'):
            formatted_response = response.text
        elif hasattr(response, 'parts'):
            formatted_response = ''.join(part.text for part in response.parts)
        else:
            formatted_response = str(response)
        
        # Add links to the products if available
        if product_lines:
            formatted_response += "\n\n## Links para Compra\n\n"
            for i, product in enumerate(scraped_prices.get('products', [])[:5]):  # Limit to 5 links
                if product.get('url'):
                    formatted_response += f"{i+1}. [{product.get('name', 'Produto')}]({product.get('url')}) - {product.get('price_text', '')}\n"
        
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
        # Initialize the Gemini model with the correct model name format
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Create prompt for general question
        prompt = f"""
        Você é um assistente especializado em assuntos relacionados à saúde.
        
        Responda à seguinte pergunta de saúde em português de forma clara e acessível:
        
        "{question}"
        
        Sua resposta deve:
        1. Ser baseada em informações médicas precisas
        2. Ser compreensível para pessoas sem conhecimento médico avançado
        3. Ser equilibrada e não alarmista
        4. Incluir ressalvas quando apropriado
        5. Sugerir quando seria adequado consultar um profissional de saúde
        
        Lembre-se de que está fornecendo informações gerais, não aconselhamento médico personalizado.
        """
        
        logger.info(f"Sending general question to Gemini API: {question}")
        
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
        if hasattr(response, 'text'):
            return response.text
        elif hasattr(response, 'parts'):
            # For newer API versions that might use parts
            return ''.join(part.text for part in response.parts)
        else:
            # Fallback to string representation
            return str(response)
        
    except Exception as e:
        logger.error(f"Error in Gemini API request for general question: {str(e)}")
        raise Exception(f"Failed to answer question with Gemini API: {str(e)}")