import requests

session = requests.Session()
session.trust_env = False


def _safe_json(response, default):
    try:
        return response.json()
    except ValueError:
        return default


def search_team(name: str):
    url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php"
    params = {"t": name}
    r = session.get(url, params=params, timeout=15)
    r.raise_for_status()
    return r.json()


def _merge_players(*player_lists):
    merged = {}

    for player_list in player_lists:
        for player in player_list or []:
            key = player.get("idPlayer") or player.get("strPlayer")
            if not key:
                continue

            existing = merged.get(key, {})
            merged[key] = {**existing, **{k: v for k, v in player.items() if v not in (None, "")}}

    return sorted(
        merged.values(),
        key=lambda player: (player.get("strPlayer") or "").lower(),
    )


def _sort_events(events):
    return sorted(
        events or [],
        key=lambda event: (
            event.get("dateEvent") or "9999-12-31",
            event.get("strTime") or "23:59:59",
        ),
    )


def get_team_details(team_id: str):
    team_response = session.get(
        "https://www.thesportsdb.com/api/v1/json/3/lookupteam.php",
        params={"id": team_id},
        timeout=15,
    )
    team_response.raise_for_status()

    players_response = session.get(
        "https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php",
        params={"id": team_id},
        timeout=15,
    )
    players_response.raise_for_status()

    events_response = session.get(
        "https://www.thesportsdb.com/api/v1/json/3/eventslast.php",
        params={"id": team_id},
        timeout=15,
    )
    events_response.raise_for_status()

    team_payload = _safe_json(team_response, {"teams": []})
    players_payload = _safe_json(players_response, {"player": []})
    events_payload = _safe_json(events_response, {"results": []})
    team = (team_payload.get("teams") or [None])[0]

    team_name = team.get("strTeam") if team else None
    search_players_payload = {"player": []}

    if team_name:
        search_players_response = session.get(
            "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php",
            params={"t": team_name},
            timeout=15,
        )
        search_players_response.raise_for_status()
        search_players_payload = _safe_json(search_players_response, {"player": []})

    return {
        "team": team,
        "players": _merge_players(
            players_payload.get("player") or [],
            search_players_payload.get("player") or [],
        ),
        "recent_events": list(reversed(_sort_events(events_payload.get("results") or []))),
    }
