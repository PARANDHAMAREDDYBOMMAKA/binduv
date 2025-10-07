import os
from typing import Dict

# Registrar URLs
REGISTRAR_URLS = {
    "kfin": "https://ipostatus.kfintech.com",
    "bigshare": "https://ipo.bigshareonline.com/ipo_status.html",
    "linkintime": "https://linkintime.co.in/initial_offer/public-issues.html",
}

# Redis configuration (from environment)
REDIS_URL = os.getenv("UPSTASH_REDIS_REST_URL", "")
REDIS_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")

# Scraper settings
HEADLESS = os.getenv("HEADLESS_BROWSER", "true").lower() == "true"
TIMEOUT = int(os.getenv("SCRAPER_TIMEOUT", "30"))
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
