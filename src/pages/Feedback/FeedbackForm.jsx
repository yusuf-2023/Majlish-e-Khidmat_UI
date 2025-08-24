import React, { useState } from "react";
import { submitFeedback } from "../../api/feedbackApi";
import "../../styles/Feedback.css";
import Notification from "../../components/Notification"; // ✅ Notification import

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    setShowNotification(false);

    try {
      // ✅ Correct API call
      const response = await submitFeedback(formData);
      setResponseMessage(
        response?.message || "Feedback submitted successfully!"
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setResponseMessage("Failed to submit feedback.");
    }

    setShowNotification(true); // ✅ Trigger notification
    setLoading(false);
  };

  return (
    <div className="feedback-form-container">
      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {/* ✅ Notification Component */}
      {showNotification && (
        <Notification
          message={responseMessage}
          onClose={() => setShowNotification(false)}
          duration={2500}
        />
      )}
    </div>
  );
}

export default FeedbackForm;
