from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sport_api import search_team
from ticket_api import get_events
from prompt_builder import (
    create_game_insight_prompt,
    create_ticket_recommendation_prompt,
)
from llm_service import get_llm_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
    return search_team(q)


@app.get("/tickets")
def tickets(q: str):
    return get_events(q)


@app.post("/game-insight")
def game_insight(request: GameInsightRequest):
    prompt = create_game_insight_prompt(
        request.team_home,
        request.team_away,
        request.event_date,
        request.location,
        request.user_interest,
    )

    insight = get_llm_response(prompt)

    return {"insight": insight}


@app.post("/ticket-recommendation")
def ticket_recommendation(request: TicketRecommendationRequest):
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

    recommendation = get_llm_response(prompt)

    return {"recommendation": recommendation}