from openai import OpenAI

client = OpenAI()

def get_llm_response(prompt: str) -> str:
    response = client.responses.create(
        model="gpt-5.4",
        input=prompt,
    )
    return response.output_text