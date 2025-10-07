from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from config import HEADLESS, TIMEOUT, USER_AGENT


class BaseScraper(ABC):
    """Base class for all registrar scrapers"""

    def __init__(self, registrar_name: str, base_url: str):
        self.registrar_name = registrar_name
        self.base_url = base_url
        self.driver: Optional[webdriver.Chrome] = None

    def setup_driver(self) -> webdriver.Chrome:
        """Setup Chrome WebDriver with options"""
        chrome_options = Options()

        if HEADLESS:
            chrome_options.add_argument("--headless")

        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument(f"user-agent={USER_AGENT}")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option("useAutomationExtension", False)

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(TIMEOUT)

        return driver

    def start(self):
        """Initialize the WebDriver"""
        if not self.driver:
            self.driver = self.setup_driver()

    def stop(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            self.driver = None

    @abstractmethod
    def scrape_companies(self) -> List[Dict]:
        """
        Scrape and return list of companies/IPOs from the registrar
        Must be implemented by subclasses

        Returns:
            List of dictionaries with company details
        """
        pass

    @abstractmethod
    def check_allotment(self, company_url: str, pan: str, **kwargs) -> Dict:
        """
        Check allotment status for a specific company

        Args:
            company_url: The specific URL for this company's allotment check
            pan: PAN number
            **kwargs: Additional parameters (dpId, clientId, applicationNumber, etc.)

        Returns:
            Dictionary with allotment details
        """
        pass

    def __enter__(self):
        """Context manager entry"""
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.stop()
