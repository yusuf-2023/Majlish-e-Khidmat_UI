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

  // useEffect hook to fetch profile data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Agar token nahi hai, to user ko login page par redirect karein
      window.location.href = "/user/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        // Check karein ki profile data empty na ho
        if (!profile) {
          throw new Error("Profile data is empty");
        }
        
        setUser(profile);
        setEditedData(profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        showNotification("Failed to load profile. Please log in again.", "error");
        localStorage.clear();
        // window.location.href = "/user/login";
      }
    };
    fetchProfile();
  }, []); // [] iska matlab hai ki yeh hook sirf ek baar component load hone par chalega

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
    // Edit mode off hone par editedData ko reset karein
    if (!editMode) {
      setEditedData(user);
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      // Step 1: Profile details update
      // hum updated profile details ko store kar rahe hain
      const updatedProfileData = await updateUserProfile(editedData);
      showNotification("Profile details updated successfully!", "success");

      // Step 2: Picture upload
      if (selectedFile) {
        try {
          // File upload hone par naya profile pic ka URL milta hai
          const uploadResponse = await uploadUserProfilePic(selectedFile);
          showNotification("Profile picture updated successfully!", "success");
        } catch (uploadError) {
          console.error("Failed to upload profile picture:", uploadError);
          showNotification("Profile picture upload failed!", "error");
          // Upload fail hone par bhi details update ho chuke hain, isliye yahan se throw nahi kar rahe
        }
      }
      
      // Step 3: Latest profile data fetch karein to update the UI
      const latestProfile = await getUserProfile();

      if (!latestProfile) {
        throw new Error("Updated profile data is empty");
      }

      setUser(latestProfile);
      setEditMode(false);
      setSelectedFile(null);
      setPreview(null);

    } catch (err) {
      console.error("Update failed:", err);
      showNotification(err.message || "Failed to update profile!", "error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }
    try {
      await deleteUserProfile();
      showNotification("Account deleted!", "success");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/user/register";
      }, 2200);
    } catch (err) {
      console.error("Delete failed:", err);
      showNotification("Failed to delete account!", "error");
    }
  };

  if (!user) {
    return <Loader text="Loading profile..." />;
  }

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

        {editMode && (
          <div className="file-input-container">
            <button
              className="file-upload-btn"
              onClick={() => document.getElementById('file-upload').click()}
            >
              Choose Profile Picture
            </button>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              style={{ display: 'none' }}
            />
          </div>
        )}
        
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
