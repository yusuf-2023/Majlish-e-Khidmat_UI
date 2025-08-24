// File: majlishekhidmat-frontend/src/pages/Admin/AdminStatsUpdate.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";


const AdminStatsUpdate = () => {
  const [stats, setStats] = useState({
    totalUsers: "",
    totalDonations: "",
    totalEvents: ""
  });
  const [message, setMessage] = useState("");

  // Fetch current stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8080/api/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats({ ...stats, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:8080/api/stats/update",
        stats,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Update Stats</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Total Users:
          <input
            type="number"
            name="totalUsers"
            value={stats.totalUsers}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Total Donations:
          <input
            type="number"
            name="totalDonations"
            value={stats.totalDonations}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Total Events:
          <input
            type="number"
            name="totalEvents"
            value={stats.totalEvents}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Stats</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminStatsUpdate;
