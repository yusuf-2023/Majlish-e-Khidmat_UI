import React, { useEffect, useState, useContext } from "react";
import {
  getAllVolunteers,
  deleteVolunteer,
  updateVolunteer,
} from "../../api/Volunteer/volunteerApi";
import Notification from "../../components/Notification";
import "../../styles/VolunteerList.css";

// AuthContext
import { AuthContext } from "../../context/AuthContext";

function VolunteerList() {
  const { role } = useContext(AuthContext); // ✅ AuthContext

  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [expandedId, setExpandedId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ New: multi-select & undo delete
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [undoDeleteVolunteers, setUndoDeleteVolunteers] = useState([]);

  const API_BASE_URL = window.location.origin.includes("localhost")
    ? "http://localhost:8080"
    : window.location.origin;

  // Fetch volunteers
  useEffect(() => {
    const loadVolunteers = async () => {
      setLoading(true);
      try {
        const data = await getAllVolunteers();
        setVolunteers(data);
        setFilteredVolunteers(data);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
        showNotification("Failed to load volunteers", "error");
      }
      setLoading(false);
    };
    loadVolunteers();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = volunteers.filter(
      (v) =>
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.phone?.includes(search) ||
        v.email?.toLowerCase().includes(search.toLowerCase()) ||
        (v.address && v.address.toLowerCase().includes(search.toLowerCase())) ||
        (v.skills && v.skills.toLowerCase().includes(search.toLowerCase())) ||
        (v.experience &&
          v.experience.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredVolunteers(filtered);
  }, [search, volunteers]);

  // Notification system
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  // Get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.includes("\\")) {
      const filename = imagePath.split("\\").pop();
      return `${API_BASE_URL}/uploads/${filename}`;
    }
    if (!imagePath.includes("/")) {
      return `${API_BASE_URL}/uploads/${imagePath}`;
    }
    return `${API_BASE_URL}${imagePath}`;
  };

  // Edit functions
  const handleEditClick = (volunteer) => {
    if (role !== "ADMIN") {
      showNotification(
        "Only administrators can update volunteer information.",
        "error"
      );
      return;
    }
    setEditId(volunteer.id);
    setEditFormData({ ...volunteer });
    setExpandedId(volunteer.id);
    setImagePreview(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditFormData({});
    setExpandedId(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setEditFormData({ ...editFormData, [name]: file });

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
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleSaveEdit = async (id) => {
    if (role !== "ADMIN") {
      showNotification(
        "Only administrators can update volunteer information.",
        "error"
      );
      return;
    }
    try {
      const data = new FormData();
      for (const key in editFormData) {
        if (editFormData[key] !== null && editFormData[key] !== undefined) {
          data.append(key, editFormData[key]);
        }
      }
      await updateVolunteer(id, data);
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...editFormData } : v))
      );
      setEditId(null);
      setEditFormData({});
      setExpandedId(null);
      setImagePreview(null);
      showNotification("Volunteer updated successfully", "success");
    } catch (err) {
      console.error("Failed to update volunteer:", err);
      showNotification("Failed to update volunteer", "error");
    }
  };

  // ✅ Multi-delete & Undo Delete logic
  const handleDelete = (id) => {
    if (role !== "ADMIN") {
      showNotification("Only administrators can delete volunteers.", "error");
      return;
    }
    const volunteerToDelete = volunteers.find((v) => v.id === id);
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
    const timeoutId = setTimeout(async () => {
      try {
        await deleteVolunteer(id);
        setUndoDeleteVolunteers((prev) =>
          prev.filter((v) => v.id !== id)
        );
        showNotification("Volunteer deleted permanently", "success");
      } catch {
        showNotification("Failed to delete volunteer", "error");
        setVolunteers((prev) => [...prev, volunteerToDelete]);
      }
    }, 5000);
    setUndoDeleteVolunteers((prev) => [...prev, { ...volunteerToDelete, timeoutId }]);
    showNotification("Volunteer deleted. Undo available for 5 seconds", "success");
  };

  const undoDelete = (id) => {
    const undoVolunteer = undoDeleteVolunteers.find((v) => v.id === id);
    if (!undoVolunteer) return;
    clearTimeout(undoVolunteer.timeoutId);
    setVolunteers((prev) => [...prev, undoVolunteer]);
    setUndoDeleteVolunteers((prev) => prev.filter((v) => v.id !== id));
    showNotification("Volunteer deletion undone", "success");
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    if (editId === id) {
      handleCancelEdit();
    }
  };

  // ✅ Multi-select checkbox handlers
  const toggleSelectVolunteer = (id) => {
    setSelectedVolunteers((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map((v) => v.id));
    }
  };

  const handleDeleteSelected = () => {
    selectedVolunteers.forEach((id) => handleDelete(id));
    setSelectedVolunteers([]);
  };

  if (loading) return <div className="vl-loading">Loading volunteers...</div>;

  return (
    <div className="vl-admin-container">
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() =>
            setNotification({ show: false, message: "", type: "" })
          }
        />
      )}

      <div className="vl-header">
        <h2>Volunteer Management</h2>
        <div className="vl-header-actions">
          <button
            className="vl-btn vl-btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh 🔄
          </button>
          {selectedVolunteers.length > 0 && (
            <button
              className="vl-btn vl-btn-danger"
              onClick={handleDeleteSelected}
            >
              Delete Selected 🗑️
            </button>
          )}
        </div>
      </div>

      <div className="vl-search-container">
        <div className="vl-search-box">
          <i className="vl-search-icon"></i>
          <input
            type="text"
            placeholder="Search volunteers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="vl-search-input"
          />
        </div>
        <div className="vl-results-count">
          {filteredVolunteers.length} of {volunteers.length} volunteers
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <div className="vl-no-results">
          <i className="vl-no-results-icon">👥</i>
          <h3>No volunteers found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="vl-table-container">
          <table className="vl-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedVolunteers.length === volunteers.length &&
                      volunteers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer) => {
                const imageUrl = getImageUrl(volunteer.profilePicture);
                return (
                  <React.Fragment key={volunteer.id}>
                    <tr className={expandedId === volunteer.id ? "vl-expanded" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedVolunteers.includes(volunteer.id)}
                          onChange={() => toggleSelectVolunteer(volunteer.id)}
                        />
                      </td>
                      <td>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={volunteer.name}
                            className="vl-avatar"
                            onError={(e) => {
                              e.target.style.display = "none";
                              const placeholder = document.getElementById(
                                `vl-placeholder-${volunteer.id}`
                              );
                              if (placeholder) placeholder.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          id={`vl-placeholder-${volunteer.id}`}
                          className="vl-avatar-placeholder"
                          style={{ display: imageUrl ? "none" : "flex" }}
                        >
                          {volunteer.name
                            ? volunteer.name.charAt(0).toUpperCase()
                            : "V"}
                        </div>
                      </td>
                      <td>
                        <div className="vl-name">{volunteer.name}</div>
                      </td>
                      <td>{volunteer.email}</td>
                      <td>{volunteer.phone || "N/A"}</td>
                      <td>
                        <div className="vl-skills">{volunteer.skills || "N/A"}</div>
                      </td>
                      <td>
                        <span
                          className={`vl-availability-tag vl-${volunteer.availability?.toLowerCase()}`}
                        >
                          {volunteer.availability || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="vl-action-buttons">
                          <button
                            className="vl-btn vl-btn-icon"
                            onClick={() => toggleExpand(volunteer.id)}
                            title="View details"
                          >
                            {expandedId === volunteer.id ? "▲" : "▼"}
                          </button>
                          {role === "ADMIN" && (
                            <>
                              <button
                                className="vl-btn vl-btn-icon vl-btn-edit"
                                onClick={() => handleEditClick(volunteer)}
                                title="Edit"
                              >
                                🖉
                              </button>
                              <button
                                className="vl-btn vl-btn-icon vl-btn-delete"
                                onClick={() => handleDelete(volunteer.id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                              {undoDeleteVolunteers.some(
                                (v) => v.id === volunteer.id
                              ) && (
                                <button
                                  className="vl-btn vl-btn-warning"
                                  onClick={() => undoDelete(volunteer.id)}
                                >
                                  Undo ⏪
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {expandedId === volunteer.id && (
                      <tr className="vl-details-row">
                        <td colSpan="8">
                          <div className="vl-details">
                            <h4>Volunteer Details</h4>
                            <div className="vl-details-grid">
                              <div className="vl-detail-group">
                                <label>Address:</label>
                                <span>{volunteer.address || "N/A"}</span>
                              </div>
                              <div className="vl-detail-group">
                                <label>Date of Birth:</label>
                                <span>{volunteer.dob || "N/A"}</span>
                              </div>
                              <div className="vl-detail-group">
                                <label>Gender:</label>
                                <span>{volunteer.gender || "N/A"}</span>
                              </div>
                              <div className="vl-detail-group">
                                <label>Occupation:</label>
                                <span>{volunteer.occupation || "N/A"}</span>
                              </div>
                              <div className="vl-detail-group">
                                <label>Education:</label>
                                <span>{volunteer.education || "N/A"}</span>
                              </div>
                              <div className="vl-detail-group">
                                <label>Experience:</label>
                                <span>{volunteer.experience || "N/A"}</span>
                              </div>
                            </div>

                            {editId === volunteer.id && (
                              <div className="vl-edit-form">
                                <h4>Edit Volunteer</h4>
                                <div className="vl-form-grid">
                                  {Object.entries({
                                    name: "Name",
                                    email: "Email",
                                    phone: "Phone",
                                    address: "Address",
                                    dob: "Date of Birth",
                                    skills: "Skills",
                                    occupation: "Occupation",
                                    education: "Education",
                                    experience: "Experience",
                                  }).map(([key, label]) => (
                                    <div className="vl-form-group" key={key}>
                                      <label>{label}:</label>
                                      <input
                                        type={
                                          key === "email"
                                            ? "email"
                                            : key === "dob"
                                            ? "date"
                                            : "text"
                                        }
                                        name={key}
                                        value={editFormData[key] || ""}
                                        onChange={handleInputChange}
                                        className="vl-form-input"
                                      />
                                    </div>
                                  ))}
                                  <div className="vl-form-group">
                                    <label>Gender:</label>
                                    <select
                                      name="gender"
                                      value={editFormData.gender || ""}
                                      onChange={handleInputChange}
                                      className="vl-form-input"
                                    >
                                      <option value="">Select</option>
                                      <option value="MALE">Male</option>
                                      <option value="FEMALE">Female</option>
                                      <option value="OTHER">Other</option>
                                    </select>
                                  </div>
                                  <div className="vl-form-group">
                                    <label>Availability:</label>
                                    <select
                                      name="availability"
                                      value={editFormData.availability || ""}
                                      onChange={handleInputChange}
                                      className="vl-form-input"
                                    >
                                      <option value="">Select</option>
                                      <option value="WEEKDAYS">Weekdays</option>
                                      <option value="WEEKENDS">Weekends</option>
                                      <option value="BOTH">Both</option>
                                    </select>
                                  </div>
                                  <div className="vl-form-group vl-form-group-image">
                                    <label>Profile Picture:</label>
                                    <div className="vl-image-upload-container">
                                      <div className="vl-image-preview">
                                        {imagePreview ? (
                                          <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="vl-image-preview-img"
                                          />
                                        ) : (
                                          <div className="vl-image-placeholder">
                                            {volunteer.name
                                              ? volunteer.name
                                                  .charAt(0)
                                                  .toUpperCase()
                                              : "V"}
                                          </div>
                                        )}
                                      </div>
                                      <input
                                        type="file"
                                        name="profilePicture"
                                        id={`profilePicture-${volunteer.id}`}
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="vl-image-input"
                                      />
                                      <label
                                        htmlFor={`profilePicture-${volunteer.id}`}
                                        className="vl-image-upload-btn"
                                      >
                                        Choose Image
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="vl-form-actions">
                                  <button
                                    className="vl-btn vl-btn-success"
                                    onClick={() => handleSaveEdit(volunteer.id)}
                                  >
                                    Save Changes 💾
                                  </button>
                                  <button
                                    className="vl-btn vl-btn-secondary"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel ❌
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VolunteerList;
