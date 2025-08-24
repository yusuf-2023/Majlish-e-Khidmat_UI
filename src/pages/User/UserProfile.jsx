import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadUserProfilePic,
} from "../../api/user/userApi";
import "../../styles/UserProfile.css";
import Loader from "../../components/common/Loader";
import Notification from "../../components/Notification";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return (window.location.href = "/user/login");

    getUserProfile()
      .then((res) => {
        setUser(res);
        setEditedData(res);
      })
      .catch(() => {
        localStorage.clear();
        window.location.href = "/user/login";
      });
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2200);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/user/login";
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setEditedData(user);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleChange = (e) => setEditedData({ ...editedData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await updateUserProfile(editedData);
      if (selectedFile) await uploadUserProfilePic(selectedFile);
      const updated = await getUserProfile();
      setUser(updated);
      setEditMode(false);
      setSelectedFile(null);
      setPreview(null);
      showNotification("Profile updated successfully!");
    } catch {
      showNotification("Failed to update profile!", "error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteUserProfile();
      showNotification("Account deleted!");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/user/register";
      }, 2200);
    } catch {
      showNotification("Failed to delete account!", "error");
    }
  };

  if (!user) return <Loader text="Loading profile..." />;

  return (
    <div className="profile-rect-container">
      {notification && (
        <Notification message={notification.message} onClose={() => setNotification(null)} type={notification.type} />
      )}

      <div className="profile-rect-left">
        <img
          src={preview ? preview : user.profilePic ? `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${user.profilePic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2e7d32&color=fff&size=200`}
          alt="User Avatar"
        />
        {editMode && <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; setSelectedFile(file); if (file) setPreview(URL.createObjectURL(file)); }} className="file-input" />}
        <h2>{user.name}</h2>
        <p className="role">{user.role}</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-rect-right">
        <h3>User Details</h3>
        <div className="detail-grid">
          <label>Email:</label><p>{user.email}</p>
          <label>Phone:</label>{editMode ? <input name="phone" value={editedData.phone || ""} onChange={handleChange} /> : <p>{user.phone || "Not Provided"}</p>}
          <label>Address:</label>{editMode ? <input name="address" value={editedData.address || ""} onChange={handleChange} /> : <p>{user.address || "Not Provided"}</p>}
          <label>DOB:</label>{editMode ? <input type="date" name="dob" value={editedData.dob || ""} onChange={handleChange} /> : <p>{user.dob || "Not Provided"}</p>}
          <label>Gender:</label>{editMode ? <select name="gender" value={editedData.gender || ""} onChange={handleChange}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select> : <p>{user.gender || "Not Provided"}</p>}
        </div>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleEditToggle}>Cancel</button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={handleEditToggle}>Edit Profile</button>
              <button className="cancel-btn" onClick={handleDelete}>Delete Account</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
