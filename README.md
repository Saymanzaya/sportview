SportView: Sports & Ticketing App
Overview
SportView is an API-driven web application that allows users to search for sports teams, explore upcoming events, and receive AI-powered insights and ticket recommendations. The application integrates real-time sports data with AI recommendations to enhance the user’s experience

Objectives
•	Provide real-time sports team and event data
•	Enable users to explore ticket opportunities
•	Generate AI-powered insights about teams and matchups
•	Offer intelligent ticket recommendations based on user preferences

System Architecture
User (Browser)  
Frontend (React - AWS Amplify) 
API Gateway (HTTP API) 
AWS Lambda (Python Backend) 
External APIs:
   - Ticketmaster API
   - TheSportsDB API
   - OpenAI API

Application Workflow
1.	User interacts with the frontend (search for team)
2.	React frontend sends a request to API Gateway
3.	API Gateway routes the request to AWS Lambda
4.	Lambda processes the request:
o	Pulls sports data from TheSportsDB
o	Pulls ticket data from Ticketmaster API
o	Generates AI responses using OpenAI API
5.	Lambda returns a JSON response
6.	Frontend displays results dynamically

LLM Workflow
1.	Frontend sends user context (team, event, preferences) 
2.	Lambda builds a structured prompt 
3.	Lambda sends request to OpenAI API 
4.	OpenAI generates: 
o	Team insights 
o	Ticket recommendations 
5.	Response is returned to frontend

LLM Flow – Sport example
1.	User selects "AI Team Insight"
2.	Frontend sends POST request (/game-insight)
3.	API Gateway receives request
4.	API Gateway triggers AWS Lambda
5.	Lambda processes input and builds prompt
6.	Lambda sends request to OpenAI API
7.	OpenAI API generates response
8.	Lambda returns JSON response
9.	Frontend renders AI-generated insight

Technologies Used
Frontend
•	React
•	JavaScript
•	CSS
Backend
•	Python (AWS Lambda)
•	RESTful API design
Cloud Services
•	AWS Amplify (Frontend Hosting)
•	AWS API Gateway
•	AWS Lambda
External APIs
•	TheSportsDB (sports data)
•	Ticketmaster API (Ticket information/purchasing)
•	OpenAI API (AI insights & recommendations)

API Endpoints

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
OPENAI_API_KEY=API KEY GOES HERE

Deployment
Frontend
•	Hosted using AWS Amplify
•	Automatically deploys from GitHub repository
Backend
•	Deployed using AWS Lambda
•	API exposed via AWS API Gateway

Challenges & Solutions
Issue: OpenAI dependency errors in Lambda
•	Cause: Missing packages like pydantic
•	Solution: Replaced OpenAI SDK with direct HTTP requests using requests
Issue: CORS errors
•	Cause: API Gateway not configured for cross-origin requests
•	Solution: Enabled CORS with:
o	Access-Control-Allow-Origin: *
o	Disabled credentials
Issue: Frontend not connecting to backend
•	Cause: Using localhost URLs
•	Solution: Updated to deployed API Gateway URL
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

