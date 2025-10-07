#!/usr/bin/env python3
"""
Main scraper orchestrator
Usage:
  python main.py scrape-companies --registrar=bigshare
  python main.py scrape-all
  python main.py check-allotment --registrar=bigshare --pan=ABCDE1234F
"""

import sys
import json
import argparse
from typing import List, Dict
from scrapers.bigshare_scraper import BigshareScraper
from scrapers.kfin_scraper import KFinScraper
from scrapers.linkintime_scraper import LinkIntimeScraper
from utils.redis_client import RedisClient


SCRAPERS = {
    "bigshare": BigshareScraper,
    "kfin": KFinScraper,
    "linkintime": LinkIntimeScraper,
}


def scrape_companies(registrar: str) -> List[Dict]:
    """Scrape companies from a specific registrar"""
    if registrar not in SCRAPERS:
        raise ValueError(f"Unknown registrar: {registrar}")

    scraper_class = SCRAPERS[registrar]
    scraper = scraper_class()

    try:
        companies = scraper.scrape_companies()

        # Store in Redis
        redis_client = RedisClient()
        cache_key = f"ipo:companies:{registrar}"
        redis_client.set(cache_key, companies, ex=3600)

        return companies
    except Exception as e:
        print(f"Error scraping {registrar}: {e}", file=sys.stderr)
        return []


def scrape_all_registrars() -> Dict[str, List[Dict]]:
    """Scrape all registrars"""
    results = {}
    all_companies = []

    for registrar in SCRAPERS.keys():
        print(f"Scraping {registrar}...", file=sys.stderr)
        companies = scrape_companies(registrar)
        results[registrar] = companies
        all_companies.extend(companies)

    # Store combined results
    redis_client = RedisClient()
    redis_client.set("ipo:companies:active", all_companies, ex=3600)

    print(f"Total companies scraped: {len(all_companies)}", file=sys.stderr)

    return results


def check_allotment(registrar: str, pan: str, **kwargs) -> Dict:
    """Check allotment status"""
    if registrar not in SCRAPERS:
        raise ValueError(f"Unknown registrar: {registrar}")

    scraper_class = SCRAPERS[registrar]
    scraper = scraper_class()

    company_url = kwargs.get("url", scraper.base_url)

    try:
        result = scraper.check_allotment(company_url, pan, **kwargs)
        return result
    except Exception as e:
        print(f"Error checking allotment: {e}", file=sys.stderr)
        return {"status": "error", "message": str(e)}


def main():
    parser = argparse.ArgumentParser(description="IPO Registrar Scraper")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Scrape companies command
    scrape_parser = subparsers.add_parser("scrape-companies", help="Scrape companies from a registrar")
    scrape_parser.add_argument("--registrar", required=True, choices=SCRAPERS.keys(), help="Registrar to scrape")

    # Scrape all command
    subparsers.add_parser("scrape-all", help="Scrape all registrars")

    # Check allotment command
    allotment_parser = subparsers.add_parser("check-allotment", help="Check allotment status")
    allotment_parser.add_argument("--registrar", required=True, choices=SCRAPERS.keys())
    allotment_parser.add_argument("--pan", required=True, help="PAN number")
    allotment_parser.add_argument("--url", help="Company-specific URL")
    allotment_parser.add_argument("--company-value", help="Company dropdown value")
    allotment_parser.add_argument("--application-number", help="Application number")
    allotment_parser.add_argument("--dp-id", help="DP ID")
    allotment_parser.add_argument("--client-id", help="Client ID")

    args = parser.parse_args()

    if args.command == "scrape-companies":
        companies = scrape_companies(args.registrar)
        print(json.dumps(companies, indent=2))

    elif args.command == "scrape-all":
        results = scrape_all_registrars()
        print(json.dumps(results, indent=2))

    elif args.command == "check-allotment":
        kwargs = {}
        if args.url:
            kwargs["url"] = args.url
        if args.company_value:
            kwargs["company_value"] = args.company_value
        if args.application_number:
            kwargs["application_number"] = args.application_number
        if args.dp_id:
            kwargs["dp_id"] = args.dp_id
        if args.client_id:
            kwargs["client_id"] = args.client_id

        result = check_allotment(args.registrar, args.pan, **kwargs)
        print(json.dumps(result, indent=2))

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
