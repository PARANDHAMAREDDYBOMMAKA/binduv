import sys
import time
from typing import Dict, List
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from .base_scraper import BaseScraper
from config import REGISTRAR_URLS


class KFinScraper(BaseScraper):
    """Scraper for KFin Technologies"""

    def __init__(self):
        super().__init__("kfin", REGISTRAR_URLS["kfin"])

    def scrape_companies(self) -> List[Dict]:
        """Scrape active IPOs from KFin"""
        self.start()
        companies = []

        try:
            print("Accessing KFin website...", file=sys.stderr)
            self.driver.get(self.base_url)

            # KFin uses Material-UI, wait for React to render
            wait = WebDriverWait(self.driver, 20)
            time.sleep(10)

            try:
                # Find and click the Material-UI dropdown
                print("Looking for Material-UI dropdown...", file=sys.stderr)
                dropdown = wait.until(
                    EC.element_to_be_clickable((By.ID, "demo-multiple-name"))
                )

                print("Clicking dropdown...", file=sys.stderr)
                dropdown.click()
                time.sleep(2)

                # Wait for options to appear
                options = wait.until(
                    EC.presence_of_all_elements_located((By.XPATH, "//li[@role='option']"))
                )

                print(f"Found {len(options)} options", file=sys.stderr)

                for option in options:
                    try:
                        company_name = option.text.strip()
                        company_value = option.get_attribute("data-value")

                        if company_name and len(company_name) > 5:
                            # Determine IPO type based on name
                            ipo_type = "sme"
                            if any(word in company_name.upper() for word in ['NCD', 'DEBENTURE', 'BOND']):
                                ipo_type = "bond"
                            elif not any(word in company_name.upper() for word in ['SME']):
                                ipo_type = "mainboard"

                            companies.append({
                                "name": company_name,
                                "registrar": "kfin",
                                "ipoType": ipo_type,
                                "status": "active",
                                "url": self.base_url,
                                "companyValue": company_value
                            })
                            print(f"Found company: {company_name}", file=sys.stderr)

                    except Exception as opt_error:
                        print(f"Error processing option: {opt_error}", file=sys.stderr)
                        continue

                print(f"Scraped {len(companies)} companies from KFin", file=sys.stderr)

            except Exception as e:
                print(f"KFin scraping error: {e}", file=sys.stderr)

        except Exception as e:
            print(f"Error accessing KFin: {e}", file=sys.stderr)
        finally:
            self.stop()

        # Remove duplicates
        seen = set()
        unique_companies = []
        for company in companies:
            if company['name'] not in seen:
                seen.add(company['name'])
                unique_companies.append(company)

        return unique_companies

    def check_allotment(self, company_url: str, pan: str, **kwargs) -> Dict:
        """Check allotment status on KFin"""
        self.start()

        try:
            self.driver.get(company_url)
            time.sleep(2)

            wait = WebDriverWait(self.driver, 10)

            if "company_value" in kwargs:
                company_select = wait.until(
                    EC.presence_of_element_located((By.ID, "ddlIssue"))
                )
                select = Select(company_select)
                select.select_by_value(kwargs["company_value"])
                time.sleep(1)

            pan_input = wait.until(
                EC.presence_of_element_located((By.ID, "txtPAN"))
            )
            pan_input.clear()
            pan_input.send_keys(pan)

            submit_btn = self.driver.find_element(By.ID, "btnSubmit")
            submit_btn.click()

            time.sleep(3)

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            status_div = soup.find('div', class_='status-result')

            if status_div:
                status_text = status_div.text.lower()

                if "allotted" in status_text or "allot" in status_text:
                    shares_elem = soup.find(class_='shares')
                    amount_elem = soup.find(class_='amount')

                    return {
                        "status": "allotted",
                        "shares": int(shares_elem.text.strip() or 0) if shares_elem else 0,
                        "amount": amount_elem.text.strip() if amount_elem else "₹0",
                        "refundAmount": "₹0",
                        "applicationNumber": kwargs.get("application_number", "N/A"),
                    }
                elif "not" in status_text:
                    return {"status": "not_allotted", "message": "IPO not allotted"}

            return {"status": "pending", "message": "Status pending"}

        except Exception as e:
            print(f"Error checking KFin allotment: {e}", file=sys.stderr)
            return {"status": "error", "message": str(e)}
        finally:
            self.stop()
