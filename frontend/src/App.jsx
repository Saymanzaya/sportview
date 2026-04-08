import { Routes, Route, Link } from "react-router-dom"
import { useState } from "react"

import Home from "./pages/Home"
import Search from "./pages/Search"
import TeamDetails from "./pages/TeamDetails"
import Tickets from "./pages/Tickets"
import FAQ from "./pages/FAQ"

function NavItem({ to, children }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        padding: "10px 10px",
        borderRadius: 10,
        textDecoration: "none",
        background: hovered ? "rgba(255, 255, 255, 0.18)" : "transparent",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "background 0.2s ease, transform 0.2s ease",
      }}
    >
      {children}
    </Link>
  )
}

export default function App() {
  return (
    <div style={{ fontFamily: "Arial" }}>
      <nav
        style={{
          padding: 20,
          background: "linear-gradient(135deg, #1a759f 0%, #2a9d8f 100%)",
          display: "flex",
          gap: 22,
          boxShadow: "0 10px 24px rgba(26, 117, 159, 0.18)",
        }}
      >
        <NavItem to="/">Home</NavItem>
        <NavItem to="/search">Search</NavItem>
        <NavItem to="/tickets">Tickets</NavItem>
        <NavItem to="/faq">FAQ</NavItem>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </div>
  )
}
