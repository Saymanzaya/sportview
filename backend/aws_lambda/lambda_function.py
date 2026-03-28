import json
import os
import urllib.parse
import requests


def search_team(query):
    url = f"https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t={urllib.parse.quote(query)}"
    return requests.get(url).json()


def get_events(query):
    url = f"https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e={urllib.parse.quote(query)}"
    return requests.get(url).json()


def get_game_insight(data):
    team_home = data.get("team_home", "")
    team_away = data.get("team_away", "")
    event_date = data.get("event_date", "")
    location = data.get("location", "")
    user_interest = data.get("user_interest", "")

    prompt = f"""
You are a sports assistant for the SportView app.

Give a short, clean insight for this sports context.

Home Team: {team_home}
Away Team: {team_away}
Event Date: {event_date}
Location: {location}
User Interest: {user_interest}

Keep the response concise, informative, and easy for fans to read.
"""

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise Exception("OPENAI_API_KEY is missing")

    response = requests.post(
        "https://api.openai.com/v1/responses",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-4.1-mini",
            "input": prompt,
        },
        timeout=30,
    )

    response.raise_for_status()
    result = response.json()

    return result["output"][0]["content"][0]["text"]


def get_ticket_recommendation(data):
    event_name = data.get("event_name", "")
    team_home = data.get("team_home", "")
    team_away = data.get("team_away", "")
    event_date = data.get("event_date", "")
    location = data.get("location", "")
    ticket_price = data.get("ticket_price", "")
    seat_section = data.get("seat_section", "")
    user_budget = data.get("user_budget", "")
    user_preference = data.get("user_preference", "")

    prompt = f"""
You are a sports ticket recommendation assistant for the SportView app.

Give a short, clean recommendation for whether this ticket seems worth buying.

Event Name: {event_name}
Home Team: {team_home}
Away Team: {team_away}
Event Date: {event_date}
Location: {location}
Ticket Price: {ticket_price}
Seat Section: {seat_section}
User Budget: {user_budget}
User Preference: {user_preference}

Keep the response concise, practical, and fan-friendly.
"""

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise Exception("OPENAI_API_KEY is missing")

    response = requests.post(
        "https://api.openai.com/v1/responses",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-4.1-mini",
            "input": prompt,
        },
        timeout=30,
    )

    response.raise_for_status()
    result = response.json()

    return result["output"][0]["content"][0]["text"]


def build_response(body, status_code=200):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        },
        "body": json.dumps(body),
    }


def lambda_handler(event, context):
    path = event.get("rawPath", "") or ""
    query = event.get("queryStringParameters") or {}

    if path.endswith("/sports"):
        return build_response(search_team(query.get("q", "")))

    if path.endswith("/tickets"):
        return build_response(get_events(query.get("q", "")))

    if path.endswith("/game-insight"):
        try:
            body = event.get("body") or "{}"
            if isinstance(body, str):
                data = json.loads(body)
            else:
                data = body

            insight = get_game_insight(data)
            return build_response({"insight": insight})

        except Exception as e:
            return build_response({"error": str(e)}, 500)

    if path.endswith("/ticket-recommendation"):
        try:
            body = event.get("body") or "{}"
            if isinstance(body, str):
                data = json.loads(body)
            else:
                data = body

            recommendation = get_ticket_recommendation(data)
            return build_response({"recommendation": recommendation})

        except Exception as e:
            return build_response({"error": str(e)}, 500)

    return build_response(
        {
            "error": "route not found",
            "rawPath": path,
            "event": event
        },
        404
    )