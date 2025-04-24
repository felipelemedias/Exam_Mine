import requests
import logging
from bs4 import BeautifulSoup
import re
from urllib.parse import quote

# Set up logger
logger = logging.getLogger("exam-analyzer-api")

class MedicationInfoScraper:
    """Scraper for medication information (bulas)"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Charset': 'utf-8'
        }
        # Define the sources to scrape
        self.sources = [
            self._scrape_bulas_med_br,
            self._scrape_remedios_com_br,
            self._scrape_bulario_anvisa
        ]
    
    def search(self, medication_name):
        """
        Search for medication information across multiple sources
        
        Args:
            medication_name (str): Name of the medication to search for
            
        Returns:
            dict: Information about the medication or empty if not found
        """
        logger.info(f"Searching medication info for: {medication_name}")
        
        # Ensure medication_name is properly encoded as UTF-8
        if not isinstance(medication_name, str):
            logger.warning("Converting medication_name to string with UTF-8 encoding")
            medication_name = medication_name.decode('utf-8', errors='replace')
        
        # Try each source until we get a result
        for source_func in self.sources:
            try:
                result = source_func(medication_name)
                if result and result.get('content'):
                    logger.info(f"Found medication info from source: {source_func.__name__}")
                    return result
            except Exception as e:
                logger.error(f"Error scraping from {source_func.__name__}: {str(e)}")
                continue
        
        # If no source returned a result
        logger.warning(f"No medication info found for: {medication_name}")
        return {"content": "", "source": ""}
    
    def _scrape_bulas_med_br(self, medication_name):
        """Scrape medication information from bulas.med.br"""
        logger.info(f"Scraping bulas.med.br for: {medication_name}")
        
        try:
            # Format query string and make the search request
            search_url = f"https://bulas.med.br/search?q={quote(medication_name)}"
            logger.info(f"Making request to: {search_url}")
            
            search_response = requests.get(search_url, headers=self.headers, timeout=10)
            search_response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            search_content = search_response.content.decode('utf-8', errors='replace')
            search_soup = BeautifulSoup(search_content, 'lxml')
            
            # Look for the first search result
            first_result = search_soup.select_one('div.col-lg-9 ul.search-results li a[href]')
            
            if not first_result:
                logger.warning("No results found on bulas.med.br")
                return None
            
            # Get the URL of the first result
            bula_url = first_result['href']
            if not bula_url.startswith('http'):
                bula_url = f"https://bulas.med.br{bula_url}"
            
            logger.info(f"Found bula URL: {bula_url}")
            
            # Request the bula page
            bula_response = requests.get(bula_url, headers=self.headers, timeout=10)
            bula_response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            bula_content = bula_response.content.decode('utf-8', errors='replace')
            bula_soup = BeautifulSoup(bula_content, 'lxml')
            
            # Extract relevant sections
            sections = {}
            
            # Extract medication name and manufacturer
            med_name = bula_soup.select_one('h1.product-title')
            manufacturer = bula_soup.select_one('span.manufacturer')
            
            if med_name:
                sections['nome'] = med_name.text.strip()
            
            if manufacturer:
                sections['fabricante'] = manufacturer.text.strip()
            
            # Extract the content sections
            info_blocks = bula_soup.select('div.info-block')
            
            for block in info_blocks:
                title_elem = block.select_one('h2.info-title')
                content_elem = block.select_one('div.info-content')
                
                if title_elem and content_elem:
                    title = title_elem.text.strip()
                    content = content_elem.text.strip()
                    sections[title.lower()] = content
            
            # Prepare the final content
            content_parts = [
                f"# {sections.get('nome', medication_name)}",
                f"Fabricante: {sections.get('fabricante', 'Não informado')}",
                "## Apresentação",
                sections.get('apresentação', sections.get('apresentações', 'Informação não disponível')),
                "## Composição",
                sections.get('composição', 'Informação não disponível'),
                "## Indicações",
                sections.get('para que este medicamento é indicado?', 'Informação não disponível'),
                "## Como usar",
                sections.get('como devo usar este medicamento?', 'Informação não disponível'),
                "## Contraindicações",
                sections.get('quando não devo usar este medicamento?', 'Informação não disponível'),
                "## Reações Adversas",
                sections.get('quais os males que este medicamento pode me causar?', 'Informação não disponível')
            ]
            
            # Join all parts with double newlines
            full_content = '\n\n'.join(content_parts)
            
            return {
                "content": full_content,
                "source": bula_url
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error scraping bulas.med.br: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error scraping bulas.med.br: {str(e)}")
            return None
    
    def _scrape_remedios_com_br(self, medication_name):
        """Scrape medication information from remedios.com.br"""
        logger.info(f"Scraping remedios.com.br for: {medication_name}")
        
        try:
            search_url = f"https://remedios.com.br/busca?termo={quote(medication_name)}"
            logger.info(f"Making request to: {search_url}")
            
            search_response = requests.get(search_url, headers=self.headers, timeout=10)
            search_response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            search_content = search_response.content.decode('utf-8', errors='replace')
            search_soup = BeautifulSoup(search_content, 'lxml')
            
            # Look for the first search result
            product_link = search_soup.select_one('a.ProductCard_container__j43SM')
            
            if not product_link:
                logger.warning("No results found on remedios.com.br")
                return None
                
            product_url = product_link.get('href')
            if not product_url.startswith('http'):
                product_url = f"https://remedios.com.br{product_url}"
            
            logger.info(f"Found product URL: {product_url}")
            
            # Request the product page
            product_response = requests.get(product_url, headers=self.headers, timeout=10)
            product_response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            product_content = product_response.content.decode('utf-8', errors='replace')
            product_soup = BeautifulSoup(product_content, 'lxml')
            
            # Extract product information
            product_name = product_soup.select_one('h1.ProductInfo_name__qA56Y')
            manufacturer = product_soup.select_one('div.ProductInfo_manufacturer__l_FRc')
            
            # Extract description and other details
            description = product_soup.select_one('div.ProductDescription_content__BwrMt')
            
            # Extract specifications
            specs = {}
            spec_items = product_soup.select('li.ProductSpecification_item__xJO4M')
            
            for item in spec_items:
                label = item.select_one('span.ProductSpecification_label__aDQsa')
                value = item.select_one('span.ProductSpecification_value__sLXCJ')
                
                if label and value:
                    specs[label.text.strip().lower()] = value.text.strip()
            
            # Prepare the final content
            content_parts = [
                f"# {product_name.text.strip() if product_name else medication_name}",
                f"Fabricante: {manufacturer.text.strip() if manufacturer else 'Não informado'}",
                "## Descrição",
                description.text.strip() if description else "Informação não disponível",
                "## Especificações"
            ]
            
            # Add specifications
            for label, value in specs.items():
                content_parts.append(f"### {label.capitalize()}\n{value}")
            
            # Join all parts with double newlines
            full_content = '\n\n'.join(content_parts)
            
            return {
                "content": full_content,
                "source": product_url
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error scraping remedios.com.br: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error scraping remedios.com.br: {str(e)}")
            return None
    
    def _scrape_bulario_anvisa(self, medication_name):
        """Scrape medication information from bulario.anvisa.gov.br"""
        logger.info(f"Attempting to scrape from bulario.anvisa.gov.br for: {medication_name}")
        try:
            # The Anvisa site is more complex and might require more advanced techniques
            # This is a simplified implementation
            search_url = "https://consultas.anvisa.gov.br/#/bulario/"
            logger.info(f"Anvisa bulario requires more complex interaction, returning empty result")
            
            # Since ANVISA requires more complex interaction (JavaScript execution),
            # we'll skip this for now and return None to try other sources
            return None
            
        except Exception as e:
            logger.error(f"Error accessing ANVISA: {str(e)}")
            return None


class MedicationPriceScraper:
    """Scraper for medication prices"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Charset': 'utf-8'
        }
        # Define the sources to scrape
        self.sources = [
            self._scrape_consulta_remedios,
            self._scrape_drogasil,
            self._scrape_ultrafarma,
            self._scrape_panvel
        ]
    
    def search(self, medication_name):
        """
        Search for medication prices across multiple sources
        
        Args:
            medication_name (str): Name of the medication to search for
            
        Returns:
            dict: Price information about the medication
        """
        logger.info(f"Searching medication prices for: {medication_name}")
        
        # Ensure medication_name is properly encoded as UTF-8
        if not isinstance(medication_name, str):
            logger.warning("Converting medication_name to string with UTF-8 encoding")
            medication_name = medication_name.decode('utf-8', errors='replace')
            
        all_results = []
        
        # Try each source
        for source_func in self.sources:
            try:
                result = source_func(medication_name)
                if result and result.get('products'):
                    logger.info(f"Found {len(result['products'])} products from {source_func.__name__}")
                    all_results.append(result)
            except Exception as e:
                logger.error(f"Error scraping from {source_func.__name__}: {str(e)}")
                continue
        
        # Combine results from all sources
        combined_results = {
            "query": medication_name,
            "sources": [r.get('source_name') for r in all_results if r.get('source_name')],
            "products": []
        }
        
        for result in all_results:
            if result.get('products'):
                combined_results['products'].extend(result['products'])
        
        # Sort products by price
        combined_results['products'] = sorted(combined_results['products'], key=lambda x: x.get('price', float('inf')))
        
        if not combined_results['products']:
            logger.warning(f"No price information found for: {medication_name}")
        else:
            logger.info(f"Found a total of {len(combined_results['products'])} products for: {medication_name}")
        
        return combined_results
    
    def _scrape_consulta_remedios(self, medication_name):
        """Scrape medication prices from consultaremedios.com.br"""
        logger.info(f"Scraping consultaremedios.com.br for: {medication_name}")
        
        try:
            search_url = f"https://consultaremedios.com.br/busca?termo={quote(medication_name)}"
            logger.info(f"Making request to: {search_url}")
            
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            content = response.content.decode('utf-8', errors='replace')
            soup = BeautifulSoup(content, 'lxml')
            
            products = []
            product_cards = soup.select('div[data-testid="product-card"]')
            
            logger.info(f"Found {len(product_cards)} product cards on consultaremedios.com.br")
            
            for card in product_cards[:5]:  # Limit to 5 results
                try:
                    # Extract product name
                    name_elem = card.select_one('h2[data-testid="product-card-title"]')
                    name = name_elem.text.strip() if name_elem else "Nome não disponível"
                    
                    # Extract price
                    price_elem = card.select_one('span[data-testid="product-card-price-value"]')
                    price_text = price_elem.text.strip() if price_elem else ""
                    
                    # Extract price value
                    price = None
                    if price_text:
                        price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
                        if price_match:
                            price_str = price_match.group(1).replace('.', '').replace(',', '.')
                            try:
                                price = float(price_str)
                            except ValueError:
                                price = None
                    
                    # Extract product URL
                    url = None
                    link_elem = card.select_one('a[href]')
                    if link_elem:
                        url = link_elem['href']
                        if not url.startswith('http'):
                            url = f"https://consultaremedios.com.br{url}"
                    
                    if name and price:
                        products.append({
                            "name": name,
                            "price": price,
                            "price_text": price_text,
                            "url": url,
                            "source": "Consulta Remédios"
                        })
                except Exception as e:
                    logger.error(f"Error extracting product information: {str(e)}")
                    continue
            
            return {
                "source_name": "Consulta Remédios",
                "source_url": search_url,
                "products": products
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error scraping consultaremedios.com.br: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error scraping consultaremedios.com.br: {str(e)}")
            return None
    
    def _scrape_drogasil(self, medication_name):
        """Scrape medication prices from drogasil.com.br"""
        logger.info(f"Scraping drogasil.com.br for: {medication_name}")
        
        try:
            search_url = f"https://www.drogasil.com.br/search?w={quote(medication_name)}"
            logger.info(f"Making request to: {search_url}")
            
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            content = response.content.decode('utf-8', errors='replace')
            soup = BeautifulSoup(content, 'lxml')
            
            products = []
            product_cards = soup.select('div.ProductCard')
            
            logger.info(f"Found {len(product_cards)} product cards on drogasil.com.br")
            
            for card in product_cards[:5]:  # Limit to 5 results
                try:
                    # Extract product name
                    name_elem = card.select_one('h2.ProductCard__title')
                    name = name_elem.text.strip() if name_elem else "Nome não disponível"
                    
                    # Extract price
                    price_elem = card.select_one('span.ProductPrice__value')
                    price_text = price_elem.text.strip() if price_elem else ""
                    
                    # Extract price value
                    price = None
                    if price_text:
                        price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
                        if price_match:
                            price_str = price_match.group(1).replace('.', '').replace(',', '.')
                            try:
                                price = float(price_str)
                            except ValueError:
                                price = None
                    
                    # Extract product URL
                    url = None
                    link_elem = card.select_one('a.ProductCard__link')
                    if link_elem:
                        url = link_elem['href']
                        if not url.startswith('http'):
                            url = f"https://www.drogasil.com.br{url}"
                    
                    if name and price:
                        products.append({
                            "name": name,
                            "price": price,
                            "price_text": price_text,
                            "url": url,
                            "source": "Drogasil"
                        })
                except Exception as e:
                    logger.error(f"Error extracting product information: {str(e)}")
                    continue
            
            return {
                "source_name": "Drogasil",
                "source_url": search_url,
                "products": products
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error scraping drogasil.com.br: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error scraping drogasil.com.br: {str(e)}")
            return None
    
    def _scrape_ultrafarma(self, medication_name):
        """Scrape medication prices from ultrafarma.com.br"""
        logger.info(f"Scraping ultrafarma.com.br for: {medication_name}")
        
        try:
            search_url = f"https://www.ultrafarma.com.br/busca?t={quote(medication_name)}"
            logger.info(f"Making request to: {search_url}")
            
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            content = response.content.decode('utf-8', errors='replace')
            soup = BeautifulSoup(content, 'lxml')
            
            products = []
            product_cards = soup.select('div.boxProduto')
            
            logger.info(f"Found {len(product_cards)} product cards on ultrafarma.com.br")
            
            for card in product_cards[:5]:  # Limit to 5 results
                try:
                    # Extract product name
                    name_elem = card.select_one('a.prodTitle')
                    name = name_elem.text.strip() if name_elem else "Nome não disponível"
                    
                    # Extract price
                    price_elem = card.select_one('span.boxPreco')
                    price_text = price_elem.text.strip() if price_elem else ""
                    
                    # Extract price value
                    price = None
                    if price_text:
                        price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
                        if price_match:
                            price_str = price_match.group(1).replace('.', '').replace(',', '.')
                            try:
                                price = float(price_str)
                            except ValueError:
                                price = None
                    
                    # Extract product URL
                    url = None
                    if name_elem and name_elem.has_attr('href'):
                        url = name_elem['href']
                        if not url.startswith('http'):
                            url = f"https://www.ultrafarma.com.br{url}"
                    
                    if name and price:
                        products.append({
                            "name": name,
                            "price": price,
                            "price_text": price_text,
                            "url": url,
                            "source": "Ultrafarma"
                        })
                except Exception as e:
                    logger.error(f"Error extracting product information: {str(e)}")
                    continue
            
            return {
                "source_name": "Ultrafarma",
                "source_url": search_url,
                "products": products
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error scraping ultrafarma.com.br: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error scraping ultrafarma.com.br: {str(e)}")
            return None
    
    def _scrape_panvel(self, medication_name):
        """Scrape medication prices from panvel.com"""
        logger.info(f"Scraping panvel.com for: {medication_name}")
        
        try:
            search_url = f"https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa={quote(medication_name)}"
            logger.info(f"Making request to: {search_url}")
            
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # Ensure content is decoded as UTF-8
            content = response.content.decode('utf-8', errors='replace')
            soup = BeautifulSoup(content, 'lxml')
            
            products = []
            product_cards = soup.select('div.boxProdutos')
            
            logger.info(f"Found {len(product_cards)} product cards on panvel.com")
            
            for card in product_cards[:5]:  # Limit to 5 results
                try:
                    # Extract product name
                    name_elem = card.select_one('a.nomeLink')
                    name = name_elem.text.strip() if name_elem else "Nome não disponível"
                    
                    # Extract price
                    price_elem = card.select_one('div.preco')
                    price_text = price_elem.text.strip() if price_elem else ""
                    
                    # Extract price value
                    price = None
                    if price_text:
                        price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
                        if price_match:
                            price_str = price_match.group(1).replace('.', '').replace(',', '.')
                            try:
                                price = float(price_str)
                            except ValueError:
                                price = None
                    
                    # Extract product URL
                    url = None
                    if name_elem and name_elem.has_attr('href'):
                        url = name_elem['href']
                        if not url.startswith('http'):
                            url = f"https://www.panvel.com{url}"
                    
                    if name and price:
                        products.append({
                            "name": name,
                            "price": price,
                            "price_text": price_text,
                            "url": url,
                            "source": "Panvel"
                        })
                except Exception as e:
                    logger.error(f"Error extracting product information: {str(e)}")
                    continue
            
            return {
                "source_name": "Panvel",
                "source_url": search_url,
                "products": products
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error scraping panvel.com: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error scraping panvel.com: {str(e)}")
            return None