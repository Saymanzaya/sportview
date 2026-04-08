import { useState } from "react"

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://akv6kx5991.execute-api.us-east-1.amazonaws.com/prod"

const FEATURED_EVENT_POOL = [
  {
    idEvent: "featured-nba-celtics-knicks",
    strEvent: "Boston Celtics vs New York Knicks",
    strHomeTeam: "Boston Celtics",
    strAwayTeam: "New York Knicks",
    dateEvent: "2026-05-18",
    strVenue: "TD Garden",
    strLeague: "NBA",
    strTime: "19:30:00",
    strThumb:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/nba-boston-celtics-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo.png",
    homeAbbr: "BOS",
    awayAbbr: "NYK",
    homeColor: "#007a33",
    awayColor: "#f58426",
  },
  {
    idEvent: "featured-mlb-dodgers-giants",
    strEvent: "Los Angeles Dodgers vs San Francisco Giants",
    strHomeTeam: "Los Angeles Dodgers",
    strAwayTeam: "San Francisco Giants",
    dateEvent: "2026-06-03",
    strVenue: "Dodger Stadium",
    strLeague: "MLB",
    strTime: "20:10:00",
    strThumb:
      "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/mlb-los-angeles-dodgers-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/mlb-san-francisco-giants-logo.png",
    homeAbbr: "LAD",
    awayAbbr: "SF",
    homeColor: "#005a9c",
    awayColor: "#fd5a1e",
  },
  {
    idEvent: "featured-nfl-cowboys-eagles",
    strEvent: "Dallas Cowboys vs Philadelphia Eagles",
    strHomeTeam: "Dallas Cowboys",
    strAwayTeam: "Philadelphia Eagles",
    dateEvent: "2026-09-21",
    strVenue: "AT&T Stadium",
    strLeague: "NFL",
    strTime: "20:20:00",
    strThumb:
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/nfl-dallas-cowboys-team-logo-2.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/nfl-philadelphia-eagles-team-logo-2.png",
    homeAbbr: "DAL",
    awayAbbr: "PHI",
    homeColor: "#041e42",
    awayColor: "#004c54",
  },
  {
    idEvent: "featured-nhl-rangers-devils",
    strEvent: "New York Rangers vs New Jersey Devils",
    strHomeTeam: "New York Rangers",
    strAwayTeam: "New Jersey Devils",
    dateEvent: "2026-11-12",
    strVenue: "Madison Square Garden",
    strLeague: "NHL",
    strTime: "19:00:00",
    strThumb:
      "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/nhl-new-york-rangers-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/nhl-new-jersey-devils-logo.png",
    homeAbbr: "NYR",
    awayAbbr: "NJD",
    homeColor: "#0038a8",
    awayColor: "#ce1126",
  },
  {
    idEvent: "featured-wnba-aces-liberty",
    strEvent: "Las Vegas Aces vs New York Liberty",
    strHomeTeam: "Las Vegas Aces",
    strAwayTeam: "New York Liberty",
    dateEvent: "2026-07-10",
    strVenue: "Michelob ULTRA Arena",
    strLeague: "WNBA",
    strTime: "21:00:00",
    strThumb:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/wnba-las-vegas-aces-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/wnba-new-york-liberty-logo.png",
    homeAbbr: "LVA",
    awayAbbr: "NYL",
    homeColor: "#c8102e",
    awayColor: "#6eceb2",
  },
  {
    idEvent: "featured-mls-lafc-intermiami",
    strEvent: "LAFC vs Inter Miami",
    strHomeTeam: "LAFC",
    strAwayTeam: "Inter Miami",
    dateEvent: "2026-08-08",
    strVenue: "BMO Stadium",
    strLeague: "MLS",
    strTime: "19:45:00",
    strThumb:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/los-angeles-football-club-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/inter-miami-cf-logo.png",
    homeAbbr: "LAFC",
    awayAbbr: "MIA",
    homeColor: "#000000",
    awayColor: "#f7b5cd",
  },
  {
    idEvent: "featured-mlb-yankees-redsox",
    strEvent: "New York Yankees vs Boston Red Sox",
    strHomeTeam: "New York Yankees",
    strAwayTeam: "Boston Red Sox",
    dateEvent: "2026-06-21",
    strVenue: "Yankee Stadium",
    strLeague: "MLB",
    strTime: "19:05:00",
    strThumb:
      "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/mlb-new-york-yankees-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/mlb-boston-red-sox-logo.png",
    homeAbbr: "NYY",
    awayAbbr: "BOS",
    homeColor: "#132448",
    awayColor: "#bd3039",
  },
  {
    idEvent: "featured-nba-lakers-warriors",
    strEvent: "Los Angeles Lakers vs Golden State Warriors",
    strHomeTeam: "Los Angeles Lakers",
    strAwayTeam: "Golden State Warriors",
    dateEvent: "2026-12-01",
    strVenue: "Crypto.com Arena",
    strLeague: "NBA",
    strTime: "22:00:00",
    strThumb:
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=900&q=80",
    homeLogo: "https://loodibee.com/wp-content/uploads/nba-los-angeles-lakers-logo.png",
    awayLogo: "https://loodibee.com/wp-content/uploads/nba-golden-state-warriors-logo-2020.png",
    homeAbbr: "LAL",
    awayAbbr: "GSW",
    homeColor: "#552583",
    awayColor: "#1d428a",
  },
]

function pickFeaturedEvents(count = 3) {
  const shuffled = [...FEATURED_EVENT_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getVenueLink(event) {
  const venueQuery = `${event.strVenue || "stadium"} ${event.strHomeTeam || ""} ${event.strAwayTeam || ""}`.trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueQuery)}`
}

function getTicketLink(event) {
  if (event.strTicketURL) {
    return event.strTicketURL
  }
  return `https://www.ticketmaster.com/search?q=${encodeURIComponent(event.strEvent || "sports tickets")}`
}

function TeamLogo({ src, alt, abbr, color }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: failed ? color : "white",
        color: failed ? "white" : "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
        padding: failed ? 0 : 10,
        overflow: "hidden",
        fontWeight: "bold",
        letterSpacing: 1,
      }}
    >
      {failed ? (
        <span>{abbr}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  )
}

function HoverButton({ onClick, children, accent = "#0b6bcb" }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "14px 22px",
        fontSize: 18,
        fontWeight: "bold",
        borderRadius: 10,
        background: hovered ? "#e9eefc" : "#f5f7fb",
        border: hovered ? `1px solid ${accent}` : "1px solid #c7d2e8",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 18px rgba(11, 107, 203, 0.12)" : "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}

export default function Tickets() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const [searchError, setSearchError] = useState("")
  const [recommendations, setRecommendations] = useState({})
  const [featuredEvents, setFeaturedEvents] = useState(() => pickFeaturedEvents())
  const [hasSearched, setHasSearched] = useState(false)
  const [inputHovered, setInputHovered] = useState(false)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sportview_recent_ticket_searches") || "[]")
    } catch {
      return []
    }
  })

  function saveRecentSearch(searchTerm) {
    const normalized = searchTerm.trim()
    if (!normalized) return

    setRecentSearches((prev) => {
      const next = [normalized, ...prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase())]
        .slice(0, 6)
      localStorage.setItem("sportview_recent_ticket_searches", JSON.stringify(next))
      return next
    })
  }

  async function searchTickets() {
    if (!query.trim()) return

    setSearchError("")
    setRecommendations({})
    setData(null)
    setHasSearched(true)

    try {
      const r = await fetch(`${API_BASE}/tickets?q=${encodeURIComponent(query)}`)
      if (!r.ok) {
        const errorBody = await r.json().catch(() => ({}))
        throw new Error(errorBody.detail || errorBody.error || "Error loading tickets.")
      }
      const j = await r.json()
      setData(j)
      saveRecentSearch(query)
    } catch (error) {
      console.error("Ticket search error:", error)
      setSearchError(error.message || "Error loading tickets.")
      setData(null)
    }
  }

  function showFeaturedGames() {
    setHasSearched(false)
    setData(null)
    setSearchError("")
  }

  function refreshFeaturedEvents() {
    setRecommendations((prev) => {
      const next = { ...prev }
      featuredEvents.forEach((event) => {
        delete next[event.idEvent]
      })
      return next
    })
    setFeaturedEvents(pickFeaturedEvents())
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
      const message =
        result.recommendation ||
        result.result ||
        result.detail ||
        result.error ||
        "No recommendation available."

      setRecommendations((prev) => ({
        ...prev,
        [event.idEvent]: {
          text: message,
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

  function renderEventCard(event, sectionLabel = "") {
    const recommendation = recommendations[event.idEvent]
    const isFeatured = Boolean(event.homeLogo && event.awayLogo)

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
        {sectionLabel && (
          <p
            style={{
              margin: "0 0 12px",
              color: "#0b6bcb",
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {sectionLabel}
          </p>
        )}

        {isFeatured ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              marginBottom: 18,
              padding: "18px 12px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #ffffff 0%, #eef4ff 100%)",
            }}
          >
            <TeamLogo
              src={event.homeLogo}
              alt={event.strHomeTeam}
              abbr={event.homeAbbr}
              color={event.homeColor}
            />

            <div
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#0b6bcb",
                letterSpacing: 1,
              }}
            >
              VS
            </div>

            <TeamLogo
              src={event.awayLogo}
              alt={event.strAwayTeam}
              abbr={event.awayAbbr}
              color={event.awayColor}
            />
          </div>
        ) : (
          (event.strThumb || event.strBanner || event.strPoster) && (
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
          )
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

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <a
            href={getVenueLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 15px",
              background: "#00c853",
              color: "white",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Go to Stadium
          </a>

          <a
            href={getTicketLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 15px",
              background: "#0b6bcb",
              color: "white",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Buy Tickets
          </a>
        </div>

        <div style={{ marginTop: 15 }}>
          <HoverButton onClick={() => getTicketRecommendation(event)}>
            AI Ticket Recommendation
          </HoverButton>
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
            <h3 style={{ marginBottom: 10 }}>AI Ticket Recommendation</h3>

            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
              {recommendation.text}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Search Tickets</h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onMouseEnter={() => setInputHovered(true)}
        onMouseLeave={() => setInputHovered(false)}
        placeholder="search event"
        style={{
          padding: "14px 16px",
          marginRight: 12,
          minWidth: 260,
          fontSize: 18,
          borderRadius: 10,
          border: inputHovered ? "1px solid #7d98d1" : "1px solid #b8c3d6",
          boxShadow: inputHovered ? "0 8px 18px rgba(11, 107, 203, 0.12)" : "none",
          transition: "all 0.2s ease",
        }}
      />

      <HoverButton onClick={searchTickets}>
        Search
      </HoverButton>

      {recentSearches.length > 0 && (
        <div style={{ marginTop: 24, maxWidth: 700 }}>
          <h3 style={{ marginBottom: 10 }}>Recent Searches</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {recentSearches.map((searchTerm) => (
              <button
                key={searchTerm}
                onClick={() => {
                  setQuery(searchTerm)
                  setTimeout(() => {
                    const event = { target: { value: searchTerm } }
                    void event
                    searchTickets()
                  }, 0)
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid #c7d2e8",
                  background: "#f5f7fb",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {searchTerm}
              </button>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              maxWidth: 700,
            }}
          >
            <div>
              <h3 style={{ marginBottom: 8 }}>Featured Sports Events</h3>
              <p style={{ color: "#666", margin: 0 }}>
                Start with a few high-interest matchups, or search for a specific
                team, league, or rivalry.
              </p>
            </div>

            <HoverButton onClick={refreshFeaturedEvents}>
              Refresh Games
            </HoverButton>
          </div>

          {featuredEvents.map((event) => renderEventCard(event, "Featured"))}
        </div>
      )}

      {searchError && (
        <p style={{ marginTop: 20, color: "red" }}>{searchError}</p>
      )}

      {data && events.length === 0 && !searchError && (
        <p style={{ marginTop: 20 }}>No upcoming ticket results found.</p>
      )}

      {events.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 8,
              maxWidth: 700,
            }}
          >
            <h3 style={{ margin: 0 }}>Search Results</h3>
            <HoverButton onClick={showFeaturedGames}>Back to Featured</HoverButton>
          </div>
          {events.map((event) => renderEventCard(event))}
        </div>
      )}
    </div>
  )
}
