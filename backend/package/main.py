from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sport_api import search_team
from ticket_api import get_events

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SportView API running"}

@app.get("/sports")
def sports(q: str):
    return search_team(q)

@app.get("/tickets")
def tickets(q: str):
    return get_events(q)
