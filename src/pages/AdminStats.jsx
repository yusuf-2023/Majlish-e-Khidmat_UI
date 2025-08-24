import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "../styles/AdminStats.css";


function AdminStats() {
  const [stats, setStats] = useState({ volunteers: 0, donations: 0, communities: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch stats once on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:8080/api/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        toast.error("Error fetching stats");
        console.error(error);
      }
    }
    fetchStats();
  }, []);

  // Validate inputs: allow only positive integers
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Accept only digits or empty string to allow clearing
    if (/^\d*$/.test(value)) {
      setStats((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
    }
  };

  // Submit updated stats
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/stats/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update stats");
      }
      const msg = await response.text();
      toast.success(msg);
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className={styles.title}>Update Site Statistics</h2>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <label className={styles.label}>
          Volunteers
          <input
            type="text"
            name="volunteers"
            value={stats.volunteers}
            onChange={handleChange}
            placeholder="Volunteers"
            className={styles.input}
            aria-label="Volunteers count"
          />
        </label>
        <label className={styles.label}>
          Donations
          <input
            type="text"
            name="donations"
            value={stats.donations}
            onChange={handleChange}
            placeholder="Donations"
            className={styles.input}
            aria-label="Donations count"
          />
        </label>
        <label className={styles.label}>
          Communities
          <input
            type="text"
            name="communities"
            value={stats.communities}
            onChange={handleChange}
            placeholder="Communities"
            className={styles.input}
            aria-label="Communities count"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className={styles.button}
          aria-busy={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AdminStats;
