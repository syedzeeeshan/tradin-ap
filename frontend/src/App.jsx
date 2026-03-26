import { useEffect, useState } from "react";

function Card({ title, data }) {
  if (!data) return null;

  const color =
    data.signal === "BUY"
      ? "#16a34a"
      : data.signal === "SELL"
      ? "#dc2626"
      : "#6b7280";

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "20px",
      width: "280px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: "0.3s"
    }}>
      <h2 style={{ marginBottom: "10px" }}>{title}</h2>

      <h1 style={{ color, margin: "10px 0" }}>
        {data.signal}
      </h1>

      <p><strong>Confidence:</strong> {data.confidence}</p>
      <p><strong>Profit:</strong> {data.estimated_profit}%</p>

      <p style={{ fontSize: "14px", color: "#555" }}>
        {data.reason}
      </p>

      <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
        {data.timestamp && new Date(data.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}

function News({ news }) {
  if (!news) return null;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}> Market News</h2>

      {news.map((item, index) => {
        const color =
          item.sentiment === "positive"
            ? "#16a34a"
            : item.sentiment === "negative"
            ? "#dc2626"
            : "#6b7280";

        return (
          <div key={index} style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "15px",
            margin: "10px auto",
            width: "400px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
          }}>
            <p style={{ marginBottom: "5px" }}>{item.title}</p>
            <span style={{
              fontSize: "12px",
              color,
              fontWeight: "bold"
            }}>
              {item.sentiment.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("wss://tradin-ap.onrender.com/ws");

    ws.onopen = () => console.log("✅ Connected");

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    ws.onerror = (err) => console.error(err);

    return () => ws.close();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "40px"
      }}>
         Real-Time Trading Dashboard
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap"
      }}>
        <Card title="Gold" data={data.gold} />
        <Card title="Silver" data={data.silver} />
      </div>

      <div style={{ textAlign: "center" }}>
        <News news={data.news} />
      </div>
    </div>
  );
}

export default App;
