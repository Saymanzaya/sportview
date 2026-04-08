import os
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

session = requests.Session()
session.trust_env = False

def get_events(keyword: str):
    api_key = os.getenv("TICKETMASTER_KEY")
    if not api_key:
        return {"error": "TICKETMASTER_KEY is not set"}

    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "apikey": api_key,
        "keyword": keyword,
        "size": 5
    }

    r = session.get(url, params=params, timeout=15)
    r.raise_for_status()
    return r.json()
