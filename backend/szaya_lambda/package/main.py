import os
from typing import Optional

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .sport_api import get_team_details, search_team
from .ticket_api import get_events
from llm_service import get_llm_response
from prompt_builder import (
    create_game_insight_prompt,
    create_ticket_recommendation_prompt,
)

app = FastAPI()

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GameInsightRequest(BaseModel):
    team_home: str
    team_away: str
    event_date: str
    location: str
    user_interest: str


class TicketRecommendationRequest(BaseModel):
    event_name: str
    team_home: str
    team_away: str
    event_date: str
    location: str
    ticket_price: Optional[float] = None
    seat_section: str
    user_budget: str
    user_preference: str

@app.get("/")
def root():
    return {"message": "SportView API running"}

@app.get("/sports")
def sports(q: str):
    try:
        return search_team(q)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.get("/team-details/{team_id}")
def team_details(team_id: str):
    try:
        return get_team_details(team_id)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

@app.get("/tickets")
def tickets(q: str):
    try:
        return get_events(q)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/game-insight")
def game_insight(request: GameInsightRequest):
    try:
        prompt = create_game_insight_prompt(
            request.team_home,
            request.team_away,
            request.event_date,
            request.location,
            request.user_interest,
        )
        return {"insight": get_llm_response(prompt)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/ticket-recommendation")
def ticket_recommendation(request: TicketRecommendationRequest):
    try:
        prompt = create_ticket_recommendation_prompt(
            request.event_name,
            request.team_home,
            request.team_away,
            request.event_date,
            request.location,
            request.ticket_price,
            request.seat_section,
            request.user_budget,
            request.user_preference,
        )
        return {"recommendation": get_llm_response(prompt)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
