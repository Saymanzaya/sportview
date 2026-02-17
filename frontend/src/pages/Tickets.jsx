import { useState } from "react"

export default function Tickets() {

  const [query, setQuery] = useState("")
  const [events, setEvents] = useState(null)

  async function search() {
    const r = await fetch(`http://127.0.0.1:8000/tickets?q=${query}`)
    const j = await r.json()
    setEvents(j)
  }

  return (
    <div style={{padding:40}}>

      <h2>Find Tickets</h2>

      <input
        value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder="team or event"
      />

      <button onClick={search}>Search</button>

      {events?._embedded?.events?.map(ev => (
        <div key={ev.id} style={{marginTop:20}}>
          <h3>{ev.name}</h3>
          <p>{ev.dates.start.localDate}</p>
          <p>{ev._embedded.venues[0].name}</p>

          <a href={ev.url} target="_blank">
            Buy Tickets
          </a>
        </div>
      ))}

    </div>
  )
}
