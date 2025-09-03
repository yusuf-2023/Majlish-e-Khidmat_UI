import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addActivity } from "../../api/activity/activityApi";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import Notification from "../../components/Notification";
import { FaImage, FaTimes, FaSmile, FaCalendarAlt } from "react-icons/fa";
import EmojiPicker from "../../components/EmojiPicker";
import "../../styles/ActivityPage.css";

const ActivityAddPage = () => {
  const { role, user } = useContext(AuthContext);
  const [form, setForm] = useState({
    activityName: "",
    description: "",
    activityDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const showNotification = (message, type = "info", isUndoable = false, onUndo = null, duration = 3000) => {
    setNotification({ message, type, isUndoable, onUndo, duration });
    if (!isUndoable) {
      setTimeout(() => setNotification(null), duration);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setImageFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEmojiSelect = (emoji) => {
    setForm({ ...form, description: form.description + emoji });
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "ADMIN") {
      showNotification("Only administrators can add activities.", "warning");
      return;
    }
    if (!form.activityName || !form.description || !form.activityDate) {
      showNotification("Please fill all fields.", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("activityName", form.activityName);
    formData.append("description", form.description);
    formData.append("activityDate", form.activityDate);
    formData.append("createdBy", user?.username);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    try {
      setLoading(true);
      await addActivity(formData);
      setForm({ activityName: "", description: "", activityDate: "" });
      setImageFile(null);
      setImagePreview(null);
      showNotification("Activity added successfully!", "success", false, null, 3000);
      setTimeout(() => {
        navigate("/admin/activities/list");
      }, 3000);
    } catch (error) {
      console.error("Add Activity Error:", error.response || error.message);
      showNotification("Failed to add activity.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-add-page section-content">
      {loading && <Loader text="Adding Activity..." />}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          isUndoable={notification.isUndoable}
          onUndo={notification.onUndo}
          duration={notification.duration}
        />
      )}
      <form className="activity-form-compact glass-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Create New Activity</h3>
          <button type="button" className="close-btn" onClick={() => navigate(-1)}>
            <FaTimes />
          </button>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="activityName"
            placeholder="Activity Name"
            value={form.activityName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group textarea-with-emoji">
          <textarea
            ref={textareaRef}
            name="description"
            placeholder="What's happening?"
            value={form.description}
            onChange={handleChange}
            required
            className="form-textarea"
            rows={2}
          />
          <button type="button" className="emoji-trigger" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker-container" ref={emojiPickerRef}>
              <EmojiPicker onSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="activityDate" className="date-label">
            <FaCalendarAlt /> Activity Date:
          </label>
          <input
            id="activityDate"
            type="datetime-local"
            name="activityDate"
            value={form.activityDate}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="image-upload-container">
          {imagePreview ? (
            <div className="image-preview-wrapper">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button type="button" className="remove-image-btn" onClick={removeImage}>
                <FaTimes />
              </button>
            </div>
          ) : (
            <label className="image-upload-label">
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="image-input"
              />
              <div className="image-upload-placeholder">
                <FaImage className="upload-icon" />
                <span>Add Image</span>
              </div>
            </label>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Post Activity
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityAddPage;