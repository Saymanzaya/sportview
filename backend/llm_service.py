import os
from pathlib import Path

from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent / ".env")

session = requests.Session()
session.trust_env = False


def get_llm_response(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")

    response = session.post(
        "https://api.openai.com/v1/responses",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-5.4",
            "input": prompt,
        },
        timeout=30,
    )
    response.raise_for_status()

    data = response.json()
    try:
        return data["output"][0]["content"][0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("OpenAI response did not include output text") from exc
