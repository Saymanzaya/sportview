import os
import requests

session = requests.Session()
session.trust_env = False

TEAM_KEYWORD_ALIASES = {
    "fc barcelona": ["barcelona", "barca"],
    "barcelona": ["barca", "fc barcelona"],
    "real madrid": ["realmadrid", "real madrid cf"],
    "boston celtics": ["celtics"],
    "new york knicks": ["knicks"],
    "los angeles lakers": ["lakers"],
    "detroit tigers": ["tigers"],
    "detroit lions": ["lions"],
    "detroit red wings": ["red wings"],
}


def _request_json(url: str, params: dict):
    response = session.get(url, params=params, timeout=15)
    response.raise_for_status()
    return response.json()


def _extract_events(payload: dict):
    return payload.get("_embedded", {}).get("events", [])


def _dedupe_events(events):
    seen = set()
    unique = []

    for event in events:
        event_id = event.get("id")
        if event_id and event_id in seen:
            continue
        if event_id:
            seen.add(event_id)
        unique.append(event)

    return unique


def _build_search_terms(keyword: str):
    normalized = " ".join(keyword.lower().split())
    parts = normalized.split()
    terms = [keyword.strip()]

    if normalized in TEAM_KEYWORD_ALIASES:
        terms.extend(TEAM_KEYWORD_ALIASES[normalized])

    if len(parts) > 1:
        terms.append(" ".join(parts[-2:]))
        terms.append(parts[-1])

    for removable in ("fc", "cf", "afc", "club"):
        stripped = " ".join(part for part in parts if part != removable).strip()
        if stripped:
            terms.append(stripped)

    deduped = []
    seen = set()

    for term in terms:
        cleaned = term.strip()
        lowered = cleaned.lower()
        if cleaned and lowered not in seen:
            seen.add(lowered)
            deduped.append(cleaned)

    return deduped


def _search_events(api_key: str, keyword: str):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": api_key,
        "keyword": keyword,
        "size": 10,
        "sort": "date,asc",
    }
    return _request_json(url, params)


def _search_attractions(api_key: str, keyword: str):
    url = "https://app.ticketmaster.com/discovery/v2/attractions.json"
    params = {
        "apikey": api_key,
        "keyword": keyword,
        "size": 5,
    }
    return _request_json(url, params)


def _events_by_attraction(api_key: str, attraction_id: str):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": api_key,
        "attractionId": attraction_id,
        "size": 10,
        "sort": "date,asc",
    }
    return _request_json(url, params)


def get_events(keyword: str):
    api_key = os.getenv("TICKETMASTER_KEY")
    if not api_key:
        return {"error": "TICKETMASTER_KEY is not set"}

    all_events = []

    for term in _build_search_terms(keyword):
        payload = _search_events(api_key, term)
        all_events.extend(_extract_events(payload))

        if all_events:
            break

    if not all_events:
        for term in _build_search_terms(keyword):
            attraction_payload = _search_attractions(api_key, term)
            attractions = attraction_payload.get("_embedded", {}).get("attractions", [])

            for attraction in attractions[:3]:
                attraction_id = attraction.get("id")
                if not attraction_id:
                    continue
                events_payload = _events_by_attraction(api_key, attraction_id)
                all_events.extend(_extract_events(events_payload))

            if all_events:
                break

    return {"events": _dedupe_events(all_events)}
