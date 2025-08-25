import React, { useEffect, useState } from "react";
import {
  getActivities,
  addActivity,
  deleteActivity,
} from "../api/activity/activityApi";
import "../styles/ActivityPage.css";
import { useNavigate } from "react-router-dom";

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    activityName: "",
    description: "",
    activityDate: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await getActivities();
      setActivities(res.data);
    } catch (err) {
      console.error("Fetch Activities Error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.activityName || !form.description || !form.activityDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addActivity(form);
      setForm({ activityName: "", description: "", activityDate: "" });
      fetchActivities();
      alert("Activity added successfully!");
    } catch (error) {
      console.error("Add Activity Error:", error.response || error.message);
      alert("Failed to add activity. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      fetchActivities();
    } catch (error) {
      console.error("Delete Activity Error:", error.response || error.message);
      alert("Failed to delete activity");
    }
  };

  return (
    <div className="activity-page section-content">
      {/* Form */}
      <form className="activity-form glass-card" onSubmit={handleSubmit}>
        <div className="activity-form-header">
          <button
            type="button"
            className="back-arrow"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>
          <h2 className="section-title">All Activities</h2>
        </div>

        <input
          type="text"
          name="activityName"
          placeholder="Activity Name"
          value={form.activityName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="activityDate"
          value={form.activityDate}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-green">
          Add Activity
        </button>
      </form>

      {/* Activities Grid */}
      <div className="activities-grid">
        {activities.length === 0 ? (
          <p className="no-activities">No activities found.</p>
        ) : (
          activities.map((activity) => (
            <div className="activity-card glass-card" key={activity.id}>
              <h3 className="card-title">{activity.activityName}</h3>
              <p className="card-description">{activity.description}</p>
              <span className="activity-date">
                {new Date(activity.activityDate).toLocaleDateString()}{" "}
                {new Date(activity.activityDate).toLocaleTimeString()}
              </span>
              <button
                className="btn-danger"
                onClick={() => handleDelete(activity.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
