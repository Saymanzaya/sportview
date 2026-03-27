import { useState } from "react"

const API_BASE = "https://akv6kx5991.execute-api.us-east-1.amazonaws.com/prod"

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
      const r = await fetch(`${API_BASE}/tickets?q=${query}`)
      const j = await r.json()
      setData(j)
    } catch (error) {
      console.error("Ticket search error:", error)
      setSearchError("Error loading tickets.")
      setData(null)
    }
  }

  function getPriceColor(price) {
    if (price == null) return "#777"
    if (price <= 75) return "green"
    if (price <= 150) return "orange"
    return "red"
  }

  function getPriceLabel(price) {
    if (price == null) return "Price unavailable"
    if (price <= 75) return "Good Deal"
    if (price <= 150) return "Fair Price"
    return "Higher Price"
  }

  async function getTicketRecommendation(event) {
    const lowestPrice = event.priceRanges?.[0]?.min ?? null
    setLoadingId(event.id)

    try {
      const response = await fetch("http://127.0.0.1:8000/ticket-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: event.name || "Unknown Event",
          team_home: event.name?.split(" vs ")[0] || "Home Team",
          team_away: event.name?.split(" vs ")[1] || "Away Team",
          event_date: event.dates?.start?.localDate || "",
          location: event._embedded?.venues?.[0]?.name || "Unknown Venue",
          ticket_price: lowestPrice,
          seat_section: "Upper Bowl",
          user_budget: "medium",
          user_preference:
            "Give a short, clean recommendation about whether this ticket seems worth checking out for a casual sports fan.",
        }),
      })

      const result = await response.json()

      setRecommendations((prev) => ({
        ...prev,
        [event.id]: {
          text:
            result.recommendation ||
            result.result ||
            "No recommendation available.",
          link: event.url || "",
        },
      }))
    } catch (error) {
      console.error("Recommendation error:", error)
      setRecommendations((prev) => ({
        ...prev,
        [event.id]: {
          text: "Error generating recommendation.",
          link: event.url || "",
        },
      }))
    } finally {
      setLoadingId(null)
    }
  }

  const events = data?._embedded?.events || []

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
        <p style={{ marginTop: 20 }}>No ticket results found.</p>
      )}

      {events.map((event) => {
        const lowestPrice = event.priceRanges?.[0]?.min ?? null
        const recommendation = recommendations[event.id]

        return (
          <div
            key={event.id}
            style={{
              marginTop: 20,
              padding: 20,
              border: "1px solid #ccc",
              borderRadius: 10,
              background: "#f9f9f9",
              maxWidth: 700,
            }}
          >
            {event.images?.[0]?.url && (
              <img
                src={event.images[0].url}
                alt={event.name}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  borderRadius: 8,
                  marginBottom: 15,
                  objectFit: "cover",
                }}
              />
            )}

            <h3>{event.name}</h3>

            <p>
              <strong>Date:</strong> {event.dates?.start?.localDate || "N/A"}
            </p>

            <p>
              <strong>Venue:</strong> {event._embedded?.venues?.[0]?.name || "N/A"}
            </p>

            <p>
              <strong>Lowest Price:</strong>{" "}
              <span
                style={{
                  color: getPriceColor(lowestPrice),
                  fontWeight: "bold",
                }}
              >
                {lowestPrice !== null ? `$${lowestPrice}` : "Price not available"}
              </span>
            </p>

            <p
              style={{
                marginTop: 5,
                color: getPriceColor(lowestPrice),
                fontWeight: "bold",
              }}
            >
              {getPriceLabel(lowestPrice)}
            </p>

            {event.url && (
              <p>
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Tickets
                </a>
              </p>
            )}

            <button onClick={() => getTicketRecommendation(event)}>
              AI Ticket Recommendation
            </button>

            {loadingId === event.id && (
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
                <h3 style={{ marginBottom: 10 }}>AI Ticket Recommendation</h3>

                <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                  {recommendation.text}
                </p>

                {recommendation.link && (
                  <a
                    href={recommendation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 15,
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
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}