import React, { useEffect, useState } from "react";
import { getAllFeedback, deleteFeedback } from "../../api/feedbackApi";
import "../../styles/Feedbacklist.css";

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await getAllFeedback();
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(id);
        setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  return (
    <div className="feedback-list-container">
      <h2>📋 User Feedback List</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <div className="feedback-table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={fb.id || index}>
                  <td>{index + 1}</td>
                  <td>{fb.name}</td>
                  <td>{fb.email}</td>
                  <td>{fb.message}</td>
                  <td>{new Date(fb.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="feedback-delete-btn"
                      onClick={() => handleDelete(fb.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FeedbackList;
