
import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [backend, setBackend] = useState(null);
  const [aiService, setAiService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkConnections = async () => {
    setLoading(true);
    setError("");

    try {
      const [backendResult, aiResult] =
        await Promise.allSettled([
          api.get("/health"),
          fetch("/ai/health")
            .then(async (response) => {
              if (!response.ok) {
                throw new Error("AI service unavailable");
              }
              return response.json();
            })
        ]);

      if (backendResult.status === "fulfilled") {
        setBackend(backendResult.value.data);
      } else {
        setBackend(null);
      }

      if (aiResult.status === "fulfilled") {
        setAiService(aiResult.value);
      } else {
        setAiService(null);
      }

      if (
        backendResult.status === "rejected" ||
        aiResult.status === "rejected"
      ) {
        setError(
          "One or more services are unavailable. Check your terminals."
        );
      }

    } catch (err) {
      setError("Unable to check service connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnections();
  }, []);

  const StatusCard = ({ title, status }) => (
    <div className="status-card">
      <div className="status-heading">
        <h3>{title}</h3>
        <span
          className={
            status === "connected" || status === "running"
              ? "status-dot online"
              : "status-dot offline"
          }
        />
      </div>

      <p className="status-value">
        {status || "Not connected"}
      </p>
    </div>
  );

  const databaseStatus =
    backend?.databases || {};

  return (
    <main className="app-container">

      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">M</span>
          <div>
            <h2>MediSense</h2>
            <p>Healthcare Intelligence Platform</p>
          </div>
        </div>

        <span className="environment">
          DEVELOPMENT
        </span>
      </header>

      <section className="hero">
        <span className="eyebrow">
          SYSTEM INITIALIZATION
        </span>

        <h1>
          Welcome to <span>MediSense</span>
        </h1>

        <p>
          Building an intelligent healthcare platform
          powered by AI, data analytics and modern
          web technologies.
        </p>

        <button
          onClick={checkConnections}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Connections"}
        </button>
      </section>

      <section className="connection-section">
        <h2>Service Connections</h2>

        <p className="section-description">
          Monitor the availability of MediSense
          application services.
        </p>

        <div className="status-grid">

          <StatusCard
            title="Node.js Backend"
            status={backend?.backend === "running"
              ? "connected"
              : null}
          />

          <StatusCard
            title="PostgreSQL"
            status={databaseStatus.postgresql}
          />

          <StatusCard
            title="MongoDB"
            status={databaseStatus.mongodb}
          />

          <StatusCard
            title="Flask AI Service"
            status={aiService?.status}
          />

        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {!loading && backend && (
          <p className="system-status">
            Backend: {backend.success
              ? "All databases connected"
              : "Database connection needs attention"}
          </p>
        )}
      </section>

      <footer>
        MediSense © 2026 | AI Healthcare
        Intelligence Platform
      </footer>

    </main>
  );
}

export default App;
