import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
  uploadAdminProfilePic,
} from "../../api/admin/adminApi";

import "../../styles/UserProfile.css";
import Loader from "../../components/common/Loader";
import Notification from "../../components/Notification";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    fetchProfile();
  }, [location.pathname, navigate]);

  // Backend se profile fetch karo
  const fetchProfile = async () => {
    try {
      const res = await getAdminProfile();
      let profile = null;

      // Backend response format check
      if (res?.data) {
        if (Array.isArray(res.data)) {
          profile = res.data[0]; // agar array me aa raha hai
        } else if (res.data.data) {
          profile = res.data.data; // agar object me aa raha hai
        } else {
          profile = res.data; // direct object
        }
      } else {
        profile = res;
      }

      if (!profile) throw new Error("Profile data is empty");

      setAdmin(profile);
      setEditedData(profile);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setAdmin(null);
      showNotification("Failed to load profile", "error");
      if (err.message.toLowerCase().includes("unauthorized")) {
        navigate("/admin/login", { replace: true });
      }
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2200);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setEditedData(admin);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleSave = async () => {
    try {
      await updateAdminProfile(editedData);
      if (selectedFile) await uploadAdminProfilePic(selectedFile);

      await fetchProfile();
      setEditMode(false);
      setSelectedFile(null);
      setPreview(null);
      showNotification("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      showNotification("Failed to update profile!", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAdminProfile();
        showNotification("Account deleted!");
        setTimeout(() => {
          localStorage.clear();
          navigate("/admin/register", { replace: true });
        }, 2200);
      } catch (err) {
        console.error("Delete failed:", err);
        showNotification("Failed to delete account!", "error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login", { replace: true });
  };

  if (!admin) return <Loader text="Loading profile..." />;

  return (
    <div className="profile-rect-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="profile-rect-left">
        <img
          src={
            preview
              ? preview
              : admin.profilePic
              ? admin.profilePic.startsWith("http")
                ? admin.profilePic
                : `http://localhost:8080/${admin.profilePic}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  admin.name
                )}&background=2e7d32&color=fff&size=200`
          }
          alt="Admin Avatar"
        />
        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        )}

        <h2>{admin.name}</h2>
        <p className="role">{admin.role}</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-rect-right">
        <h3>Admin Details</h3>
        <div className="detail-grid">
          <label>Email:</label>
          <p>{admin.email}</p>

          <label>Phone:</label>
          {editMode ? (
            <input
              name="phone"
              value={editedData.phone || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{admin.phone || "Not Provided"}</p>
          )}

          <label>Address:</label>
          {editMode ? (
            <input
              name="address"
              value={editedData.address || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{admin.address || "Not Provided"}</p>
          )}

          <label>DOB:</label>
          {editMode ? (
            <input
              type="date"
              name="dob"
              value={editedData.dob || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{admin.dob || "Not Provided"}</p>
          )}

          <label>Gender:</label>
          {editMode ? (
            <select
              name="gender"
              value={editedData.gender || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p>{admin.gender || "Not Provided"}</p>
          )}
        </div>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleEditToggle}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
              <button className="cancel-btn" onClick={handleDelete}>
                Delete Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
