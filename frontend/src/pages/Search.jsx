import { useState } from "react"

export default function Search() {

  const [team, setTeam] = useState("")
  const [data, setData] = useState(null)

  async function search() {
    const r = await fetch(`http://127.0.0.1:8000/sports?q=${team}`)
    const j = await r.json()
    setData(j)
  }

  return (
    <div style={{padding:40}}>

      <h2>Search Teams</h2>

      <input
        value={team}
        onChange={e=>setTeam(e.target.value)}
        placeholder="team name"
      />

      <button onClick={search}>Search</button>

      {data?.teams?.map(t => (
        <div key={t.idTeam} style={{marginTop:20}}>
          <img src={t.strBadge} width="60"/>
          <h3>{t.strTeam}</h3>
          <p>{t.strLeague}</p>
        </div>
      ))}

    </div>
  )
}
