import sys
import time
from typing import Dict, List
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from .base_scraper import BaseScraper
from config import REGISTRAR_URLS


class BigshareScraper(BaseScraper):
    """Scraper for Bigshare Services"""

    def __init__(self):
        super().__init__("bigshare", REGISTRAR_URLS["bigshare"])

    def scrape_companies(self) -> List[Dict]:
        """Scrape active IPOs from Bigshare"""
        self.start()
        companies = []

        try:
            self.driver.get(self.base_url)
            time.sleep(2)

            wait = WebDriverWait(self.driver, 10)
            ipo_dropdown = wait.until(
                EC.presence_of_element_located((By.ID, "ddlCompany"))
            )

            select = Select(ipo_dropdown)
            options = select.options

            for option in options[1:]:
                company_name = option.text.strip()
                if company_name and company_name != "Select":
                    companies.append({
                        "name": company_name,
                        "registrar": "bigshare",
                        "ipoType": "mainboard",
                        "status": "active",
                        "url": self.base_url,
                        "companyValue": option.get_attribute("value")
                    })

            print(f"Scraped {len(companies)} companies from Bigshare", file=sys.stderr)

        except Exception as e:
            print(f"Error scraping Bigshare companies: {e}", file=sys.stderr)
        finally:
            self.stop()

        return companies

    def check_allotment(self, company_url: str, pan: str, **kwargs) -> Dict:
        """Check allotment status on Bigshare"""
        self.start()

        try:
            self.driver.get(company_url)
            time.sleep(2)

            wait = WebDriverWait(self.driver, 10)

            if "company_value" in kwargs:
                ipo_dropdown = wait.until(
                    EC.presence_of_element_located((By.ID, "ddlCompany"))
                )
                select = Select(ipo_dropdown)
                select.select_by_value(kwargs["company_value"])
                time.sleep(1)

            pan_input = wait.until(
                EC.presence_of_element_located((By.ID, "txtPanNo"))
            )
            pan_input.clear()
            pan_input.send_keys(pan)

            submit_btn = self.driver.find_element(By.ID, "btnSubmit")
            submit_btn.click()

            time.sleep(3)

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            allotment_table = soup.find('table', {'id': 'gvAllotmentDetails'})

            if allotment_table:
                rows = allotment_table.find_all('tr')
                if len(rows) > 1:
                    shares = 0
                    amount = "₹0"

                    for row in rows[1:]:
                        cells = row.find_all('td')
                        if len(cells) >= 2:
                            shares = int(cells[0].text.strip() or 0)
                            amount = cells[1].text.strip() or "₹0"

                    return {
                        "status": "allotted",
                        "shares": shares,
                        "amount": amount,
                        "refundAmount": "₹0",
                        "applicationNumber": kwargs.get("application_number", "N/A"),
                    }

            error_div = soup.find('div', class_=['alert', 'error-message'])
            if error_div:
                message = error_div.text.strip()
                if "not allotted" in message.lower():
                    return {"status": "not_allotted", "message": message}

            return {"status": "pending", "message": "Status not available"}

        except Exception as e:
            print(f"Error checking Bigshare allotment: {e}", file=sys.stderr)
            return {"status": "error", "message": str(e)}
        finally:
            self.stop()
