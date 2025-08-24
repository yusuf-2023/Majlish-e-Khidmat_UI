// src/pages/Home/AdminStatsPanel.jsx
import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { fetchStats, updateStats } from "../../api/statsApi";
import "../../styles/pages/Home.css"; // Optional CSS for layout

function AdminStatsPanel() {
  const [stats, setStats] = useState({
    volunteers: 0,
    donations: 0,
    communities: 0,
  });

  const [inputStats, setInputStats] = useState({ ...stats });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch stats from backend
  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchStats();
      setStats(data);
      setInputStats(data);
    };
    loadStats();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputStats((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // Update stats on backend
  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateStats(inputStats);
    setMessage(result);
    const updated = await fetchStats();
    setStats(updated);
    setInputStats(updated);
    setLoading(false);
  };

  return (
    <div className="admin-stats-panel">
      <h2>Admin Dashboard Stats</h2>

      <div className="stats-cards-container">
        <StatCard target={stats.volunteers} label="Volunteers" />
        <StatCard target={stats.donations} label="Donations" />
        <StatCard target={stats.communities} label="Communities" />
      </div>

      <div className="stats-update-form">
        <h3>Update Stats</h3>
        <label>
          Volunteers:
          <input
            type="number"
            name="volunteers"
            value={inputStats.volunteers}
            onChange={handleChange}
          />
        </label>
        <label>
          Donations:
          <input
            type="number"
            name="donations"
            value={inputStats.donations}
            onChange={handleChange}
          />
        </label>
        <label>
          Communities:
          <input
            type="number"
            name="communities"
            value={inputStats.communities}
            onChange={handleChange}
          />
        </label>

        <button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Stats"}
        </button>
        {message && <p className="update-message">{message}</p>}
      </div>
    </div>
  );
}

export default AdminStatsPanel;
