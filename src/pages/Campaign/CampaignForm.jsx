import React, { useState, useEffect } from "react";
import { createCampaign } from "../../api/Campaign/campaignApi";
import "../../styles/Campaign.css";
import Notification from "../../components/Notification";

function CampaignForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textLines = [
    "Create Impactful ",
    "Reach Communities",
    "Make a Difference"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textLines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [textLines.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: "", type: "success" });

    try {
      const response = await createCampaign(formData);
      setNotification({
        message: response?.message || "Campaign created successfully!",
        type: "success",
      });
      setFormData({ title: "", description: "", startDate: "", endDate: "" });
    } catch (err) {
      console.error(err);
      setNotification({ message: "Failed to create campaign.", type: "error" });
    }

    setLoading(false);
  };

  return (
    <div className="campaign-form-page">
      {/* Left Image - 65% */}
      <div className="campaign-form-left">
        <div className="campaign-image-content">
          <div className="animated-text-slider">
            {textLines.map((text, index) => (
              <h1 
                key={index} 
                className={`animated-text-line ${index === currentTextIndex ? 'active' : ''}`}
              >
                {text}
              </h1>
            ))}
          </div>
          <p className="animated-subtext">Launch well-organized campaigns that connect with communities and create positive change through strategic outreach and engagement.</p>
        </div>
      </div>

      {/* Right Form - 35% */}
      <div className="campaign-form-right">
        <div className="campaign-form-container">
          <h2>Create Campaign</h2>
          <form onSubmit={handleSubmit} className="campaign-create-form">
            <div className="campaign-form-row">
              <label className="campaign-form-label">Title:</label>
              <input 
                className="campaign-form-input" 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="campaign-form-row">
              <label className="campaign-form-label">Description:</label>
              <textarea 
                className="campaign-form-textarea" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="campaign-form-row">
              <label className="campaign-form-label">Start Date:</label>
              <input 
                className="campaign-form-input" 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="campaign-form-row">
              <label className="campaign-form-label">End Date:</label>
              <input 
                className="campaign-form-input" 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button className="campaign-submit-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </form>

          {notification.message && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: "", type: "success" })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignForm;