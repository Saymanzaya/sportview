export default function Home() {
  const featureCards = [
    {
      title: "Search Teams",
      text: "Look up teams across different leagues, then open a full team page with players, stadium details, match history, and more.",
    },
    {
      title: "Find Tickets",
      text: "Search events, check featured games, jump to ticket links, and open stadium directions without bouncing around a bunch of different sites.",
    },
    {
      title: "Quick Insights",
      text: "Use the AI tools when you want a fast summary about a team or a simple recommendation before choosing a game to watch.",
    },
  ]

  const quickSteps = [
    "Search for a team and open its details page to learn more about the roster, stadium, and recent games.",
    "Search tickets to find events, compare options, and open official ticket pages.",
    "Use the AI buttons if you want a short explanation instead of digging through everything yourself.",
  ]

  return (
    <div style={{ padding: 40 }}>
      <section
        style={{
          padding: 32,
          borderRadius: 24,
          background: "linear-gradient(135deg, #114b5f 0%, #1a759f 45%, #f4fbff 100%)",
          color: "white",
          boxShadow: "0 22px 50px rgba(17, 75, 95, 0.18)",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            margin: 0,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontSize: 13,
            fontWeight: "bold",
            color: "#d8f3ff",
          }}
        >
          SportView
        </p>

        <h1 style={{ margin: "14px 0 16px", maxWidth: 720, fontSize: 52 }}>
          A simple way to explore teams, find games, and decide what is worth watching.
        </h1>

        <p
          style={{
            maxWidth: 700,
            fontSize: 19,
            lineHeight: 1.7,
            color: "#eefbff",
            marginBottom: 0,
          }}
        >
          SportView was built to make sports search feel less overwhelming. Instead of jumping
          between ticket sites, team pages, and random searches, you can explore teams, compare
          matchups, and find event info in one place.
        </p>
      </section>

      <section style={{ marginTop: 34 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {featureCards.map((card) => (
            <div
              key={card.title}
              style={{
                padding: 24,
                borderRadius: 20,
                background: "#f8fbff",
                border: "1px solid #dbe4f1",
                boxShadow: "0 12px 26px rgba(15, 23, 42, 0.06)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 28 }}>{card.title}</h3>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: 34,
          padding: 28,
          borderRadius: 22,
          background: "linear-gradient(135deg, #ffffff 0%, #edf7fb 100%)",
          border: "1px solid #dbe4f1",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 34 }}>How To Use It</h2>

        <div style={{ display: "grid", gap: 14 }}>
          {quickSteps.map((step, index) => (
            <div
              key={step}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: 18,
                borderRadius: 16,
                background: "white",
                border: "1px solid #dbe4f1",
              }}
            >
              <div
                style={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#1a759f",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </div>
              <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
