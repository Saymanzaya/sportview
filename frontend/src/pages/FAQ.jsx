export default function FAQ() {
  const faqs = [
    {
      question: "What is SportView?",
      answer:
        "SportView is a sports search app that helps you look up teams, check ticket events, compare teams, and get quick AI summaries without needing a bunch of tabs open.",
    },
    {
      question: "Where does the data come from?",
      answer:
        "The app pulls sports and ticket information from API sources like TheSportsDB and Ticketmaster, then organizes it into one easier experience.",
    },
    {
      question: "Do you sell tickets directly?",
      answer:
        "No. SportView does not sell tickets. It helps you discover events and sends you to official ticket pages.",
    },
    {
      question: "Can I compare two teams?",
      answer:
        "Yes. The Search page includes a team comparison section where you can look at two teams side by side and compare details like league, stadium, country, and more.",
    },
    {
      question: "Why might featured or recent match sections change?",
      answer:
        "Featured cards are there to help you discover games quickly, while searched content depends on live API responses. Because of that, what shows up can change over time.",
    },
    {
      question: "Is SportView free to use?",
      answer:
        "Yes. This is a student project demo made to show sports search, ticket discovery, and AI features in one place.",
    },
  ]

  return (
    <div style={{ padding: 40 }}>
      <section
        style={{
          padding: 30,
          borderRadius: 24,
          background: "linear-gradient(135deg, #fff7e8 0%, #fffdf6 50%, #edf7fb 100%)",
          border: "1px solid #e7dcc4",
          boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontSize: 13,
            fontWeight: "bold",
            color: "#9a6f1f",
          }}
        >
          Help Center
        </p>

        <h2 style={{ margin: "14px 0 12px", fontSize: 42 }}>Frequently Asked Questions</h2>
        <p style={{ margin: 0, maxWidth: 760, color: "#475569", lineHeight: 1.7 }}>
          Here are a few quick answers about what SportView does, how the data works, and what you
          can do inside the app.
        </p>
      </section>

      <section style={{ marginTop: 30 }}>
        <div style={{ display: "grid", gap: 16 }}>
          {faqs.map((item, index) => (
            <div
              key={item.question}
              style={{
                padding: 24,
                borderRadius: 20,
                background: "#ffffff",
                border: "1px solid #dbe4f1",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    minWidth: 38,
                    height: 38,
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
                <div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 24 }}>{item.question}</h3>
                  <p style={{ margin: 0, color: "#475569", lineHeight: 1.8 }}>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
