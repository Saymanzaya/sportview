import { Routes, Route, Link } from "react-router-dom"

import Home from "./pages/Home"
import Search from "./pages/Search"
import Tickets from "./pages/Tickets"
import FAQ from "./pages/FAQ"

export default function App() {
  return (
    <div style={{fontFamily:"Arial"}}>

      {/* -------- NAV BAR -------- */}

      <nav style={{
        padding:20,
        background:"#111",
        display:"flex",
        gap:20
      }}>
        <Link to="/" style={{color:"white"}}>Home</Link>
        <Link to="/search" style={{color:"white"}}>Search</Link>
        <Link to="/tickets" style={{color:"white"}}>Tickets</Link>
        <Link to="/faq" style={{color:"white"}}>FAQ</Link>
      </nav>

      {/* -------- ROUTES -------- */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

    </div>
  )
}
