import os
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / ".env")

API_KEY = os.getenv("TICKETMASTER_KEY")

def get_events(keyword: str):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "apikey": API_KEY,
        "keyword": keyword,
        "size": 5
    }

    r = requests.get(url, params=params)
    return r.json()
