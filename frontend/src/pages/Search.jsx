import { useState } from "react"

const API_BASE = "https://akv6kx5991.execute-api.us-east-1.amazonaws.com/prod"

export default function Search() {
  const [team, setTeam] = useState("")
  const [data, setData] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const [insights, setInsights] = useState({})

  async function search() {
    if (!team) return

    try {
      const r = await fetch(`${API_BASE}/sports?q=${team}`)
      const j = await r.json()
      setData(j)
      setInsights({})
    } catch (err) {
      console.error("Search error:", err)
    }
  }

  async function getGameInsight(teamName, leagueName, teamId) {
    setLoadingId(teamId)

    try {
      const response = await fetch("http://127.0.0.1:8000/game-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_home: teamName,
          team_away: "",
          event_date: "",
          location: leagueName || "Sports League",
          user_interest:
            "Give me a short insight about this team, its identity, strengths, fan appeal, and why people should follow it.",
        }),
      })

      const result = await response.json()

      setInsights((prev) => ({
        ...prev,
        [teamId]: result.insight,
      }))
    } catch (err) {
      console.error("Insight error:", err)
      setInsights((prev) => ({
        ...prev,
        [teamId]: "Error generating insight.",
      }))
    } finally {
      setLoadingId(null)
    }
  }

  const teams = data?.teams || []

  return (
    <div style={{ padding: 40 }}>
      <h2>Search Teams</h2>

      <input
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="team name"
        style={{ padding: 10, marginRight: 10 }}
      />

      <button onClick={search}>Search</button>

      {teams.map((t) => (
        <div
          key={t.idTeam}
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 10,
            background: "#f9f9f9",
            maxWidth: 600,
          }}
        >
          {t.strBadge && (
            <img
              src={t.strBadge}
              alt={t.strTeam}
              style={{
                width: 80,
                height: 80,
                objectFit: "contain",
                marginBottom: 15,
              }}
            />
          )}

          <h3>{t.strTeam}</h3>
          <p>
            <strong>League:</strong> {t.strLeague}
          </p>

          <button
            onClick={() => getGameInsight(t.strTeam, t.strLeague, t.idTeam)}
          >
            AI Team Insight
          </button>

          {loadingId === t.idTeam && (
            <p style={{ marginTop: 15 }}>Generating insight...</p>
          )}

          {insights[t.idTeam] && (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                background: "#1e1e1e",
                color: "white",
                borderRadius: 10,
              }}
            >
              <h3 style={{ marginBottom: 10 }}>AI Team Insight</h3>

              <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                {insights[t.idTeam]}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}