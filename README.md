SportView: Sports & Ticketing App
Overview:
SportView is a full stack API-driven web application that allows users to search for sports teams, view team details and recent events, explore upcoming events and ticket availability, compare teams side by side, view featured sports event, and receive AI-powered insights and ticket recommendations. The application integrates real-time sports data with AI recommendations to enhance the user’s experience

Objectives
•	Provide real-time sports team and event data
•	Enable users to explore ticket opportunities
•	Generate AI-powered insights about teams and matchups
•	Offer intelligent ticket recommendations based on user preferences

System Architecture
Frontend: React (AWS Amplify)
Backend: FastAPI (AWS Lambda via Mangum)
API Layer: Amazon API Gateway (HTTP API)
Infrastructure: Terraform (Infrastructure as Code)
CI/CD: GitHub Actions
State Management: S3 (Terraform remote state)

External APIs:
TheSportsDB (sports data)
Ticketmaster (events & tickets)
OpenAI (AI insights)

CI/CD Pipeline:
The project uses GitHub Actions to automate deployment:
Builds the frontend (React)
Packages the backend (Lambda)
Run Terraform:
  terraform init
  terraform plan
  terraform apply
This ensures every push automatically updates the system.

Live Application:
Frontend: https://main.d2v88ed3avlk1m.amplifyapp.com
Backend: https://4biuo6qyb2.execute-api.us-east-1.amazonaws.com/prod

Application Workflow
1.	User interacts with the frontend (search for team)
2.	React frontend sends a request to API Gateway
3.	API Gateway Invokes AWS Lambda
4.	Lambda processes the request:
    • Pulls sports data from TheSportsDB
    • Pulls ticket data from Ticketmaster API
    • Generates AI responses using OpenAI API
5.	Lambda returns a JSON response
6.	Frontend displays results 

LLM Workflow
1.	Frontend sends a request (/game-insight or /ticket-recommendation) 
2.	Lambda builds a structured prompt 
3.	Lambda sends request to OpenAI API 
4.	OpenAI generates: 
      Team insights 
      Ticket recommendations 
5.	Response is returned to frontend

API Endpoints:
GET /sports
Search for teams
/sports?q=Lions

GET /tickets
Search for events
/tickets?q=Lions

POST /game-insight
Generate AI insight for a team or matchup
Request Body:
{
  "team home": "Detroit Lions",
  "team away": "Chicago Bears",
  "event date": "2026-04-01",
  "location": "Detroit",
  "user interest": "Give a short insight about this matchup."
}

POST /ticket-recommendation
Generate AI ticket recommendation
Request Body:
{
  "event name": "Detroit Red Wings vs Chicago Blackhawks",
  "team home": "Detroit Red Wings",
  "team away": "Chicago Blackhawks",
  "event date": "2026-04-20",
  "location": "Detroit",
  "ticket price": 75,
  "seat section": "Lower Bowl",
  "user budget": "medium",
  "user preference": "good atmosphere and value"
}

Environment Variables
The following environment variable must be configured in AWS Lambda:
OPENAI_API_KEY
TICKETMASTER_KEY
SPORTSDB_API_KEY
CORS_ORIGINS

Deployment
Frontend
•	Hosted using AWS Amplify
•	Automatically deploys from GitHub repository
Backend
•	Deployed using AWS Lambda
• Managed with Terraform
•	API exposed via AWS API Gateway

Challenges & Solutions
Issue: OpenAI dependency errors in Lambda
•	Cause: Missing packages like pydantic
•	Solution: Replaced OpenAI SDK with direct HTTP requests using requests
Issue: CORS errors
•	Cause: API Gateway not configured for cross-origin requests
•	Solution: Enabled CORS with: Access-Control-Allow-Origin: * and Disabled credentials
• Cause: Frontend and backend on different domains
• Solution: Enabled CORS and configured allowed origins
Issue: Frontend not connecting to backend
•	Cause: Using localhost URLs
•	Solution: Updated to deployed API Gateway URL
Issue: CI/CD Deployment Errors
• Cause: Incorrect file paths and packaging
• Solution: Fixed GitHub Actions workflow and Lambda build process
Issue: API Integration Issues
• Cause: Inconsistent external API responses
• Solution: Added filtering and error handling
Future Improvements
•	User authentication and profiles
•	Personalized recommendations
•	Save favorite teams and events
•	Real-time score updates
•	Mobile optimization

Contributors
•	Sayman Zaya
•	Justivon Dado
•	Luke Dolan
License
This project is for educational purposes as part of CSI 4160 – Integrated Computing Systems.

