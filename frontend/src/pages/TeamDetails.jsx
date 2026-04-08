import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://akv6kx5991.execute-api.us-east-1.amazonaws.com/prod"

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "#f7f9fc",
        border: "1px solid #dbe4f1",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "#5b6b84",
          fontWeight: "bold",
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
        {value || "Not available"}
      </p>
    </div>
  )
}

export default function TeamDetails() {
  const { teamId } = useParams()
  const location = useLocation()
  const [team, setTeam] = useState(location.state?.team || null)
  const [players, setPlayers] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [playerQuery, setPlayerQuery] = useState("")
  const [playerInputHovered, setPlayerInputHovered] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  useEffect(() => {
    async function loadTeamDetails() {
      setLoading(true)
      setError("")
      setNotice("")

      try {
        const response = await fetch(`${API_BASE}/team-details/${teamId}`)
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.detail || "Unable to load team details.")
        }

        setTeam(payload.team || location.state?.team || null)
        setPlayers(payload.players || [])
        setRecentEvents(payload.recent_events || [])
      } catch (err) {
        console.error("Team details error:", err)
        if (location.state?.team) {
          setTeam(location.state.team)
          setRecentEvents([])

          try {
            const fallbackResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${teamId}`,
            )
            const fallbackPayload = await fallbackResponse.json()
            const lookupPlayers = fallbackPayload.player || []
            let searchPlayers = []

            try {
              const searchPlayersResponse = await fetch(
                `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?t=${encodeURIComponent(location.state.team.strTeam || "")}`,
              )
              const searchPlayersPayload = await searchPlayersResponse.json()
              searchPlayers = searchPlayersPayload.player || []
            } catch (searchPlayersError) {
              console.error("Fallback search players error:", searchPlayersError)
            }

            const mergedPlayers = [...lookupPlayers, ...searchPlayers].reduce((acc, player) => {
              const key = player.idPlayer || player.strPlayer
              if (!key) return acc

              const existing = acc[key] || {}
              acc[key] = {
                ...existing,
                ...Object.fromEntries(
                  Object.entries(player).filter(([, value]) => value !== null && value !== ""),
                ),
              }
              return acc
            }, {})

            setPlayers(
              Object.values(mergedPlayers).sort((a, b) =>
                (a.strPlayer || "").localeCompare(b.strPlayer || ""),
              ),
            )

            if (!lookupPlayers.length && !searchPlayers.length) {
              setNotice("Team info loaded. Player details are limited for this team right now.")
            }
          } catch (fallbackError) {
            console.error("Fallback player lookup error:", fallbackError)
            setPlayers([])
            setNotice("Team info loaded. Live player details are not available right now.")
          }
        } else {
          setError(err.message || "Unable to load team details.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadTeamDetails()
  }, [teamId, location.state])

  const filteredPlayers = useMemo(() => {
    const term = playerQuery.trim().toLowerCase()

    if (!term) {
      return players
    }

    return players.filter((player) => {
      const name = `${player.strPlayer || ""}`.toLowerCase()
      const position = `${player.strPosition || ""}`.toLowerCase()
      return name.includes(term) || position.includes(term)
    })
  }, [playerQuery, players])

  function renderContent() {
    return (
      <div style={{ padding: 40, maxWidth: 1100 }}>
        <Link
          to="/search"
          style={{
            display: "inline-block",
            marginBottom: 24,
            color: "#0b6bcb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Back to Search
        </Link>

        {notice && (
          <div
            style={{
              marginBottom: 18,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#fff8e8",
              color: "#7a5b00",
              border: "1px solid #f1d48b",
            }}
          >
            {notice}
          </div>
        )}

        <div
          style={{
            padding: 28,
            borderRadius: 20,
            background: "linear-gradient(135deg, #ffffff 0%, #eef4ff 100%)",
            border: "1px solid #d9e3f3",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {team.strBadge && (
              <img
                src={team.strBadge}
                alt={team.strTeam}
                style={{
                  width: 110,
                  height: 110,
                  objectFit: "contain",
                  background: "white",
                  borderRadius: 18,
                  padding: 14,
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
                }}
              />
            )}

            <div>
              <h1 style={{ margin: "0 0 10px", fontSize: 40 }}>{team.strTeam}</h1>
              <p style={{ margin: 0, fontSize: 18, color: "#55657d" }}>
                {team.strLeague || "League unavailable"}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <InfoCard label="Sport" value={team.strSport} />
            <InfoCard label="Stadium" value={team.strStadium} />
            <InfoCard label="Location" value={team.strLocation || team.strCountry} />
            <InfoCard label="Founded" value={team.intFormedYear} />
          </div>

          {team.strStadiumThumb && (
            <div style={{ marginBottom: 24 }}>
              <img
                src={team.strStadiumThumb}
                alt={team.strStadium || "Stadium"}
                style={{
                  width: "100%",
                  maxWidth: 760,
                  borderRadius: 18,
                  objectFit: "cover",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.10)",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ marginBottom: 14 }}>
              Matches Played {recentEvents.length > 0 ? `(${recentEvents.length})` : ""}
            </h2>

            {recentEvents.length === 0 ? (
              <p>No recent matches are available for this team right now.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                }}
              >
                {recentEvents.map((event) => (
                  <div
                    key={event.idEvent}
                    style={{
                      padding: 18,
                      borderRadius: 16,
                      background: "#ffffff",
                      border: "1px solid #dbe4f1",
                    }}
                  >
                    <h3 style={{ margin: "0 0 10px", fontSize: 20 }}>
                      {event.strEvent || `${event.strHomeTeam} vs ${event.strAwayTeam}`}
                    </h3>
                    <p style={{ margin: "0 0 6px", color: "#475569" }}>
                      <strong>Date:</strong> {event.dateEvent || "TBD"}
                    </p>
                    {event.strTime && (
                      <p style={{ margin: "0 0 6px", color: "#475569" }}>
                        <strong>Time:</strong> {event.strTime}
                      </p>
                    )}
                    {(event.intHomeScore !== null || event.intAwayScore !== null) && (
                      <p style={{ margin: "0 0 6px", color: "#475569" }}>
                        <strong>Score:</strong> {event.intHomeScore ?? "-"} - {event.intAwayScore ?? "-"}
                      </p>
                    )}
                    <p style={{ margin: "0 0 6px", color: "#475569" }}>
                      <strong>Venue:</strong> {event.strVenue || event.strStadium || "TBD"}
                    </p>
                    <p style={{ margin: 0, color: "#475569" }}>
                      <strong>League:</strong> {event.strLeague || team.strLeague || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {team.strDescriptionEN && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ marginBottom: 12 }}>About The Team</h2>
              <p style={{ lineHeight: 1.7, color: "#334155", whiteSpace: "pre-line" }}>
                {team.strDescriptionEN}
              </p>
            </div>
          )}

          <div>
            <h2 style={{ marginBottom: 14 }}>
              Players {players.length > 0 ? `(${players.length})` : ""}
            </h2>

            <input
              value={playerQuery}
              onChange={(e) => setPlayerQuery(e.target.value)}
              onMouseEnter={() => setPlayerInputHovered(true)}
              onMouseLeave={() => setPlayerInputHovered(false)}
              placeholder="Search players by name or position"
              style={{
                width: "100%",
                maxWidth: 380,
                marginBottom: 18,
                padding: "14px 16px",
                fontSize: 17,
                borderRadius: 12,
                border: playerInputHovered ? "1px solid #7d98d1" : "1px solid #b8c3d6",
                boxShadow: playerInputHovered ? "0 8px 18px rgba(11, 107, 203, 0.12)" : "none",
                transition: "all 0.2s ease",
              }}
            />

            {players.length === 0 ? (
              <p>No player information is available for this team right now.</p>
            ) : filteredPlayers.length === 0 ? (
              <p>No players matched your search.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {filteredPlayers.map((player) => (
                  <div
                    key={player.idPlayer}
                    onClick={() => setSelectedPlayer(player)}
                    style={{
                      padding: 18,
                      borderRadius: 16,
                      background: "#ffffff",
                      border: "1px solid #dbe4f1",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <h3 style={{ margin: "0 0 10px", fontSize: 20 }}>
                      {player.strPlayer}
                    </h3>
                    <p style={{ margin: "0 0 6px", color: "#475569" }}>
                      <strong>Position:</strong> {player.strPosition || "Unknown"}
                    </p>
                    <p style={{ margin: "0 0 6px", color: "#475569" }}>
                      <strong>Nationality:</strong> {player.strNationality || "Unknown"}
                    </p>
                    <p style={{ margin: 0, color: "#475569" }}>
                      <strong>Jersey:</strong> {player.strNumber || "N/A"}
                    </p>
                    <p style={{ margin: "12px 0 0", color: "#0b6bcb", fontWeight: "bold" }}>
                      Click for more details
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedPlayer && (
          <div
            onClick={() => setSelectedPlayer(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 760,
                maxHeight: "85vh",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: 22,
                padding: 28,
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 10px", fontSize: 32 }}>
                    {selectedPlayer.strPlayer}
                  </h2>
                  <p style={{ margin: 0, color: "#55657d", fontSize: 18 }}>
                    {selectedPlayer.strPosition || "Position unavailable"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPlayer(null)}
                  style={{
                    border: "none",
                    background: "#eef4ff",
                    color: "#0b6bcb",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 14,
                  marginBottom: 22,
                }}
              >
                <InfoCard label="Nationality" value={selectedPlayer.strNationality} />
                <InfoCard label="Jersey" value={selectedPlayer.strNumber} />
                <InfoCard label="Birth Date" value={selectedPlayer.dateBorn} />
                <InfoCard label="Height" value={selectedPlayer.strHeight} />
                <InfoCard label="Weight" value={selectedPlayer.strWeight} />
                <InfoCard label="Signed" value={selectedPlayer.dateSigned} />
              </div>

              {selectedPlayer.strCutout && (
                <img
                  src={selectedPlayer.strCutout}
                  alt={selectedPlayer.strPlayer}
                  style={{
                    width: "100%",
                    maxWidth: 280,
                    objectFit: "contain",
                    marginBottom: 20,
                  }}
                />
              )}

              {selectedPlayer.strDescriptionEN ? (
                <div>
                  <h3 style={{ marginBottom: 10 }}>Player Bio</h3>
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.7,
                      color: "#334155",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {selectedPlayer.strDescriptionEN}
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, color: "#55657d" }}>
                  No extended player bio is available for this player right now.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading team details...</div>
  }

  if (error) {
    if (team) {
      return renderContent()
    }

    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: "#c62828", marginBottom: 16 }}>{error}</p>
        <Link to="/search">Back to Search</Link>
      </div>
    )
  }

  if (!team) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ marginBottom: 16 }}>No team details were found.</p>
        <Link to="/search">Back to Search</Link>
      </div>
    )
  }

  return renderContent()
}
