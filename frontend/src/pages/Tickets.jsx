import { useState } from "react"

const API_BASE = "https://akv6kx5991.execute-api.us-east-1.amazonaws.com/prod"
// const AI_BASE = "http://127.0.0.1:8000"

export default function Tickets() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const [searchError, setSearchError] = useState("")
  const [recommendations, setRecommendations] = useState({})

  async function searchTickets() {
    if (!query.trim()) return

    setSearchError("")
    setRecommendations({})
    setData(null)

    try {
      const r = await fetch(`${API_BASE}/tickets?q=${encodeURIComponent(query)}`)
      const j = await r.json()
      setData(j)
    } catch (error) {
      console.error("Ticket search error:", error)
      setSearchError("Error loading tickets.")
      setData(null)
    }
  }

  async function getTicketRecommendation(event) {
    setLoadingId(event.idEvent)

    try {
      const response = await fetch(`${API_BASE}/ticket-recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: event.strEvent || "Unknown Event",
          team_home: event.strHomeTeam || "",
          team_away: event.strAwayTeam || "",
          event_date: event.dateEvent || "",
          location: event.strVenue || "Unknown Venue",
          ticket_price: null,
          seat_section: "General",
          user_budget: "medium",
          user_preference:
            "Give a short recommendation about whether this event is worth attending.",
        }),
      })

      const result = await response.json()

      setRecommendations((prev) => ({
        ...prev,
        [event.idEvent]: {
          text:
            result.recommendation ||
            result.result ||
            "No recommendation available.",
        },
      }))
    } catch (error) {
      console.error("Recommendation error:", error)
      setRecommendations((prev) => ({
        ...prev,
        [event.idEvent]: {
          text: "Error generating recommendation.",
        },
      }))
    } finally {
      setLoadingId(null)
    }
  }

  const allEvents = data?.event || data?.events || []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const events = allEvents
    .filter((event) => {
      if (!event.dateEvent) return false
      const eventDate = new Date(`${event.dateEvent}T00:00:00`)
      return eventDate >= today
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.dateEvent}T00:00:00`)
      const dateB = new Date(`${b.dateEvent}T00:00:00`)
      return dateA - dateB
    })

  return (
    <div style={{ padding: 40 }}>
      <h2>Search Tickets</h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search event"
        style={{ padding: 10, marginRight: 10 }}
      />

      <button onClick={searchTickets}>Search</button>

      {searchError && (
        <p style={{ marginTop: 20, color: "red" }}>{searchError}</p>
      )}

      {data && events.length === 0 && !searchError && (
        <p style={{ marginTop: 20 }}>No upcoming ticket results found.</p>
      )}

      {events.map((event) => {
        const recommendation = recommendations[event.idEvent]

        return (
          <div
            key={event.idEvent}
            style={{
              marginTop: 20,
              padding: 20,
              border: "1px solid #ccc",
              borderRadius: 10,
              background: "#f9f9f9",
              maxWidth: 700,
            }}
          >
            {(event.strThumb || event.strBanner || event.strPoster) && (
              <img
                src={event.strThumb || event.strBanner || event.strPoster}
                alt={event.strEvent}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  borderRadius: 8,
                  marginBottom: 15,
                  objectFit: "cover",
                }}
              />
            )}

            <h3>{event.strEvent}</h3>

            <p style={{ color: "#555" }}>
              {event.strHomeTeam} vs {event.strAwayTeam}
            </p>

            <p>
              <strong>Date:</strong> {event.dateEvent || "N/A"}
            </p>

            <p>
              <strong>Venue:</strong> {event.strVenue || "N/A"}
            </p>

            <p>
              <strong>League:</strong> {event.strLeague || "N/A"}
            </p>

            {event.strTime && (
              <p>
                <strong>Time:</strong> {event.strTime}
              </p>
            )}

            <a
              href={
                event.strTicketURL ||
                `https://www.ticketmaster.com/search?q=${encodeURIComponent(
                  event.strEvent
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "10px 15px",
                background: "#00c853",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Buy Tickets 🎟️
            </a>

            <div style={{ marginTop: 15 }}>
              <button onClick={() => getTicketRecommendation(event)}>
                AI Ticket Recommendation
              </button>
            </div>

            {loadingId === event.idEvent && (
              <p style={{ marginTop: 15 }}>Generating recommendation...</p>
            )}

            {recommendation && (
              <div
                style={{
                  marginTop: 20,
                  padding: 20,
                  background: "#1e1e1e",
                  color: "white",
                  borderRadius: 10,
                }}
              >
                <h3 style={{ marginBottom: 10 }}>
                  AI Ticket Recommendation
                </h3>

                <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                  {recommendation.text}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}