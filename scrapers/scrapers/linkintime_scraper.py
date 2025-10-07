import sys
import time
from typing import Dict, List
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from .base_scraper import BaseScraper
from config import REGISTRAR_URLS


class LinkIntimeScraper(BaseScraper):
    """Scraper for Link Intime"""

    def __init__(self):
        super().__init__("linkintime", REGISTRAR_URLS["linkintime"])

    def scrape_companies(self) -> List[Dict]:
        """Scrape active IPOs from Link Intime"""
        self.start()
        companies = []

        try:
            self.driver.get(self.base_url)
            time.sleep(4)

            wait = WebDriverWait(self.driver, 10)

            # Link Intime uses a dropdown with ID "ddlCompany"
            try:
                from selenium.webdriver.support.ui import Select

                company_dropdown = wait.until(
                    EC.presence_of_element_located((By.ID, "ddlCompany"))
                )

                select = Select(company_dropdown)
                options = select.options

                for option in options[1:]:  # Skip first "----Select Company----" option
                    company_text = option.text.strip()
                    company_value = option.get_attribute("value")

                    # Filter out the placeholder option
                    if company_value and company_value != "0" and company_text and not company_text.startswith("----"):
                        # Parse company name and IPO type
                        # Format: "Company Name - IPO" or "Company Name - SME IPO"
                        parts = company_text.split(" - ")
                        company_name = parts[0].strip()
                        ipo_type = "sme" if len(parts) > 1 and "SME" in parts[1] else "mainboard"

                        companies.append({
                            "name": company_name,
                            "registrar": "linkintime",
                            "ipoType": ipo_type,
                            "status": "active",
                            "url": self.base_url,
                            "companyValue": company_value
                        })

                print(f"Scraped {len(companies)} companies from Link Intime", file=sys.stderr)

            except Exception as e:
                print(f"Error finding Link Intime dropdown: {e}", file=sys.stderr)

        except Exception as e:
            print(f"Error scraping Link Intime companies: {e}", file=sys.stderr)
        finally:
            self.stop()

        return companies

    def check_allotment(self, company_url: str, pan: str, **kwargs) -> Dict:
        """Check allotment status on Link Intime"""
        self.start()

        try:
            self.driver.get(company_url)
            time.sleep(2)

            wait = WebDriverWait(self.driver, 10)

            pan_input = wait.until(
                EC.presence_of_element_located((By.NAME, "pan"))
            )
            pan_input.clear()
            pan_input.send_keys(pan)

            if "application_number" in kwargs:
                app_input = self.driver.find_element(By.NAME, "appno")
                app_input.clear()
                app_input.send_keys(kwargs["application_number"])

            submit_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_btn.click()

            time.sleep(3)

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            result_div = soup.find('div', class_=['result-container', 'allotment-status'])

            if result_div:
                status_text = result_div.text.lower()

                if "allotted" in status_text or "successful" in status_text:
                    shares_elem = soup.find(class_=['shares-allotted'])
                    amount_elem = soup.find(class_=['amount-paid'])

                    return {
                        "status": "allotted",
                        "shares": int(shares_elem.text.strip() or 0) if shares_elem else 0,
                        "amount": amount_elem.text.strip() if amount_elem else "₹0",
                        "refundAmount": "₹0",
                        "applicationNumber": kwargs.get("application_number", "N/A"),
                    }
                elif "not" in status_text or "unsuccessful" in status_text:
                    return {"status": "not_allotted", "message": "IPO not allotted"}

            return {"status": "pending", "message": "Status pending"}

        except Exception as e:
            print(f"Error checking Link Intime allotment: {e}", file=sys.stderr)
            return {"status": "error", "message": str(e)}
        finally:
            self.stop()
