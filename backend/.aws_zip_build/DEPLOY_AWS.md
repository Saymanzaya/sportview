# SportView AWS Deployment

Deploy the backend from the `backend` folder with AWS SAM.

## Handler

Use:

```text
package.lambda_handler.handler
```

## Required environment variables

Set both of these in Lambda:

```text
OPENAI_API_KEY
TICKETMASTER_KEY
```

## Deploy with SAM

```powershell
sam build -t template.yaml
sam deploy --guided
```

When prompted, provide values for:

- `OpenAIApiKey`
- `TicketmasterKey`

## Local run

```powershell
..\venv\Scripts\python.exe -m uvicorn package.main:app --reload --port 8001
```

Or, if your virtual environment is `.venv`:

```powershell
..\.venv\Scripts\python.exe -m uvicorn package.main:app --reload --port 8001
```

## Routes

- `GET /`
- `GET /sports?q=...`
- `GET /tickets?q=...`
- `POST /game-insight`
- `POST /ticket-recommendation`
