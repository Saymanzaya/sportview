import { useState } from "react"
import { Link } from "react-router-dom"

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://4biuo6qyb2.execute-api.us-east-1.amazonaws.com/prod"

const TEAM_ALIASES = {
  raiders: "Las Vegas Raiders",
  lions: "Detroit Lions",
  pistons: "Detroit Pistons",
  warriors: "Golden State Warriors",
  lakers: "Los Angeles Lakers",
  celtics: "Boston Celtics",
  knicks: "New York Knicks",
  bulls: "Chicago Bulls",
  heat: "Miami Heat",
  bucks: "Milwaukee Bucks",
  eagles: "Philadelphia Eagles",
  cowboys: "Dallas Cowboys",
  chiefs: "Kansas City Chiefs",
  packers: "Green Bay Packers",
  bears: "Chicago Bears",
  giants: "New York Giants",
  jets: "New York Jets",
  yankees: "New York Yankees",
  mets: "New York Mets",
  dodgers: "Los Angeles Dodgers",
  padres: "San Diego Padres",
  cubs: "Chicago Cubs",
  "red sox": "Boston Red Sox",
  tigers: "Detroit Tigers",
  bruins: "Boston Bruins",
  rangers: "New York Rangers",
  canadiens: "Montreal Canadiens",
  leafs: "Toronto Maple Leafs",
  barca: "Barcelona",
}

function HoverButton({ onClick, children }) {
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
        border: hovered ? "1px solid #7d98d1" : "1px solid #c7d2e8",
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

function SearchInput({ value, onChange, placeholder }) {
  const [hovered, setHovered] = useState(false)

  return (
    <input
      value={value}
      onChange={onChange}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      placeholder={placeholder}
      style={{
        padding: "14px 16px",
        minWidth: 260,
        fontSize: 18,
        borderRadius: 10,
        border: hovered ? "1px solid #7d98d1" : "1px solid #b8c3d6",
        boxShadow: hovered ? "0 8px 18px rgba(11, 107, 203, 0.12)" : "none",
        transition: "all 0.2s ease",
      }}
    />
  )
}

function TeamCard({ team, insight, loadingId, onInsight }) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        background: "#f9f9f9",
        maxWidth: 700,
      }}
    >
      {team.strBadge && (
        <Link
          to={`/teams/${team.idTeam}`}
          state={{ team }}
          style={{
            display: "inline-block",
            marginBottom: 15,
          }}
        >
          <img
            src={team.strBadge}
            alt={team.strTeam}
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
              transition: "transform 0.2s ease, filter 0.2s ease",
              cursor: "pointer",
            }}
          />
        </Link>
      )}

      <h3>{team.strTeam}</h3>

      <p>
        <strong>League:</strong> {team.strLeague}
      </p>

      <p style={{ color: "#55657d", marginTop: 8 }}>
        Click the team logo to open the team page with players, team info, and match history.
      </p>

      <HoverButton onClick={() => onInsight(team.strTeam, team.strLeague, team.idTeam)}>
        AI Team Insight
      </HoverButton>

      {loadingId === team.idTeam && (
        <p style={{ marginTop: 15 }}>Generating insight...</p>
      )}

      {insight && (
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
          <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{insight}</p>
        </div>
      )}
    </div>
  )
}

function ComparisonCard({ team }) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 16,
        background: "#ffffff",
        border: "1px solid #dbe4f1",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        {team.strBadge && (
          <img
            src={team.strBadge}
            alt={team.strTeam}
            style={{ width: 72, height: 72, objectFit: "contain" }}
          />
        )}

        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 28 }}>{team.strTeam}</h3>
          <p style={{ margin: 0, color: "#55657d" }}>{team.strLeague || "League unavailable"}</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <strong>Sport:</strong> {team.strSport || "N/A"}
        </div>
        <div>
          <strong>Country:</strong> {team.strCountry || team.strLocation || "N/A"}
        </div>
        <div>
          <strong>Stadium:</strong> {team.strStadium || "N/A"}
        </div>
        <div>
          <strong>Founded:</strong> {team.intFormedYear || "N/A"}
        </div>
        <div>
          <strong>Gender:</strong> {team.strGender || "N/A"}
        </div>
        <div>
          <strong>Website:</strong>{" "}
          {team.strWebsite ? (
            <a
              href={`https://${team.strWebsite.replace(/^https?:\/\//, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0b6bcb" }}
            >
              {team.strWebsite}
            </a>
          ) : (
            "N/A"
          )}
        </div>
      </div>
    </div>
  )
}

function normalizeText(value) {
  return `${value || ""}`.trim().toLowerCase()
}

function scoreTeamMatch(team, query) {
  const normalizedQuery = normalizeText(query)
  const normalizedWords = normalizedQuery.split(/\s+/).filter(Boolean)
  if (!normalizedQuery) return -1

  const name = normalizeText(team.strTeam)
  const alternate = normalizeText(team.strAlternate)
  const league = normalizeText(team.strLeague)
  const sport = normalizeText(team.strSport)

  let score = 0

  if (name === normalizedQuery || alternate === normalizedQuery) {
    score += 100
  }

  if (name.includes(normalizedQuery) || alternate.includes(normalizedQuery)) {
    score += 50
  }

  normalizedWords.forEach((word) => {
    if (name.includes(word)) score += 15
    if (alternate.includes(word)) score += 10
    if (league.includes(word)) score += 4
    if (sport.includes(word)) score += 3
  })

  if (team.strBadge) score += 2
  if (team.strLeague) score += 1

  return score
}

function sortTeamsByMatch(teams, query) {
  return [...(teams || [])]
    .map((team) => ({ team, score: scoreTeamMatch(team, query) }))
    .sort((a, b) => b.score - a.score)
    .map(({ team }) => team)
}

function pickBestTeamMatch(teams, query) {
  const normalizedQuery = normalizeText(query)

  if (!teams?.length || !normalizedQuery) {
    return null
  }

  const scoredTeams = sortTeamsByMatch(teams, query).map((team) => ({
    team,
    score: scoreTeamMatch(team, query),
  }))
  return scoredTeams[0]?.team || null
}

function dedupeTeamsById(teams) {
  const seen = new Set()
  return (teams || []).filter((team) => {
    const id = team?.idTeam
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

async function fetchTeamsForQuery(query) {
  const response = await fetch(`${API_BASE}/sports?q=${encodeURIComponent(query)}`)
  const payload = await response.json()
  return payload?.teams || []
}

async function resolveComparisonTeam(query) {
  const normalizedQuery = normalizeText(query)
  const attempts = [query]

  if (TEAM_ALIASES[normalizedQuery]) {
    attempts.push(TEAM_ALIASES[normalizedQuery])
  }

  const lastWord = normalizedQuery.split(/\s+/).filter(Boolean).pop()
  if (lastWord && TEAM_ALIASES[lastWord]) {
    attempts.push(TEAM_ALIASES[lastWord])
  }

  const uniqueAttempts = [...new Set(attempts.filter(Boolean))]
  let combinedTeams = []

  for (const attempt of uniqueAttempts) {
    const teams = await fetchTeamsForQuery(attempt)
    combinedTeams = combinedTeams.concat(teams)
  }

  return pickBestTeamMatch(dedupeTeamsById(combinedTeams), query)
}

export default function Search() {
  const [team, setTeam] = useState("")
  const [data, setData] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const [insights, setInsights] = useState({})
  const [compareTeamA, setCompareTeamA] = useState("")
  const [compareTeamB, setCompareTeamB] = useState("")
  const [comparison, setComparison] = useState(null)
  const [compareError, setCompareError] = useState("")

  async function search() {
    if (!team.trim()) return

    try {
      setData({ teams: [] })
      setInsights({})

      const normalizedQuery = normalizeText(team)
      const lastWord = normalizedQuery.split(/\s+/).filter(Boolean).pop()
      const aliasQuery =
        TEAM_ALIASES[normalizedQuery] || (lastWord ? TEAM_ALIASES[lastWord] : "")

      const searchAttempts = [...new Set([aliasQuery, team].filter(Boolean))]

      let combinedTeams = []
      for (const attempt of searchAttempts) {
        const teams = await fetchTeamsForQuery(attempt)
        combinedTeams = combinedTeams.concat(teams)
      }

      const uniqueTeams = dedupeTeamsById(combinedTeams)
      const sortedTeams = sortTeamsByMatch(uniqueTeams, aliasQuery || team)

      setData({ teams: sortedTeams })
    } catch (err) {
      console.error("Search error:", err)
      setData({ teams: [] })
    }
  }

  async function compareTeams() {
    if (!compareTeamA.trim() || !compareTeamB.trim()) return

    setCompareError("")
    setComparison(null)

    try {
      const [leftTeam, rightTeam] = await Promise.all([
        resolveComparisonTeam(compareTeamA),
        resolveComparisonTeam(compareTeamB),
      ])

      if (!leftTeam || !rightTeam) {
        setCompareError("One or both teams could not be found. Try a more exact team name.")
        return
      }

      setComparison({ left: leftTeam, right: rightTeam })
    } catch (err) {
      console.error("Compare error:", err)
      setCompareError("There was a problem comparing those teams.")
    }
  }

  async function getGameInsight(teamName, leagueName, teamId) {
    setLoadingId(teamId)

    try {
      const response = await fetch(`${API_BASE}/game-insight`, {
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
            "Give a short, clean insight about this team, its identity, style, strengths, and fan appeal.",
        }),
      })

      const result = await response.json()
      const message =
        result.insight ||
        result.result ||
        result.detail ||
        result.error ||
        "No insight available."

      setInsights((prev) => ({
        ...prev,
        [teamId]: message,
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

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <SearchInput
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="team name"
        />
        <HoverButton onClick={search}>Search</HoverButton>
      </div>

      <div
        style={{
          marginTop: 36,
          padding: 24,
          maxWidth: 980,
          borderRadius: 18,
          background: "linear-gradient(135deg, #f7faff 0%, #eef4ff 100%)",
          border: "1px solid #dbe4f1",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>Team Comparison</h3>
        <p style={{ marginTop: 0, marginBottom: 18, color: "#55657d" }}>
          Compare two teams side by side by league, stadium, country, and more.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <SearchInput
            value={compareTeamA}
            onChange={(e) => setCompareTeamA(e.target.value)}
            placeholder="first team"
          />
          <SearchInput
            value={compareTeamB}
            onChange={(e) => setCompareTeamB(e.target.value)}
            placeholder="second team"
          />
          <HoverButton onClick={compareTeams}>Compare Teams</HoverButton>
        </div>

        {compareError && <p style={{ marginTop: 16, color: "#c62828" }}>{compareError}</p>}

        {comparison && (
          <div
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            <ComparisonCard team={comparison.left} />
            <ComparisonCard team={comparison.right} />
          </div>
        )}
      </div>

      {teams.map((t) => (
        <TeamCard
          key={t.idTeam}
          team={t}
          insight={insights[t.idTeam]}
          loadingId={loadingId}
          onInsight={getGameInsight}
        />
      ))}
    </div>
  )
}