// src/pages/AdminStats.jsx
import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { fetchStats, updateStats } from "../api/statsApi";

import "../styles/AdminStats.css";


function AdminStats() {
  const [stats, setStats] = useState({ volunteers: 0, donations: 0, communities: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formStats, setFormStats] = useState(stats);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const data = await fetchStats();
      setStats(data);
      setFormStats(data);
      setLoading(false);
    };

    loadStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormStats({ ...formStats, [name]: Number(value) });
  };

  const handleUpdate = async () => {
    const result = await updateStats(formStats);
    console.log(result);
    setStats(formStats);
    setEditing(false);
  };

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="admin-stats-page">
      <h2>Admin Statistics</h2>

      <div className="stats-cards">
        <StatCard target={stats.volunteers} label="Volunteers" />
        <StatCard target={stats.donations} label="Donations" />
        <StatCard target={stats.communities} label="Communities" />
      </div>

      <button onClick={() => setEditing(true)}>Edit Stats</button>

      {editing && (
        <div className="stats-edit-modal">
          <h3>Update Stats</h3>
          <label>
            Volunteers:
            <input
              type="number"
              name="volunteers"
              value={formStats.volunteers}
              onChange={handleChange}
            />
          </label>
          <label>
            Donations:
            <input
              type="number"
              name="donations"
              value={formStats.donations}
              onChange={handleChange}
            />
          </label>
          <label>
            Communities:
            <input
              type="number"
              name="communities"
              value={formStats.communities}
              onChange={handleChange}
            />
          </label>
          <div className="modal-buttons">
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStats;
