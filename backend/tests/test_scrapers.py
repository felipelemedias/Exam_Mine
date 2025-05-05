import pytest
from unittest.mock import patch, MagicMock
from app.scrapers import MedicationInfoScraper

def test_scrape_bulas_med_br_success():
    scraper = MedicationInfoScraper()

    # HTML de busca com link para a bula
    search_html = """
    <div class="col-lg-9">
      <ul class="search-results">
        <li><a href="/aspirina-bula"></a></li>
      </ul>
    </div>
    """
    # HTML da própria página da bula
    bula_html = """
    <h1 class="product-title">Aspirina</h1>
    <span class="manufacturer">LabTeste</span>
    <div class="info-block">
      <h2 class="info-title">Apresentação</h2>
      <div class="info-content">Conteúdo da apresentação</div>
    </div>
    """

    resp_search = MagicMock(status_code=200, content=search_html.encode("utf-8"))
    resp_bula   = MagicMock(status_code=200, content=bula_html.encode("utf-8"))

    # 1ª chamada -> resp_search, 2ª chamada -> resp_bula
    with patch("requests.get", side_effect=[resp_search, resp_bula]):
        result = scraper._scrape_bulas_med_br("Aspirina")
        assert result is not None
        assert "Aspirina" in result["content"]
        assert "LabTeste" in result["content"]
