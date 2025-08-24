import React, { useState, useEffect } from "react";
import { registerVolunteer } from "../../api/Volunteer/volunteerApi";
import "../../styles/Volunteer.css";
import Notification from "../../components/Notification";

const messages = [
  "Join us to make a difference 💙",
  "Your help can change lives 🌟",
  "Be a hero for someone in need 👐",
  "Support our charity and spread hope 💛",
];

function VolunteerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    skills: "",
    occupation: "",
    education: "",
    experience: "",
    availability: "",
    profilePicture: null,
  });

  const [savedVolunteer, setSavedVolunteer] = useState(null); // Backend saved volunteer
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Animated headline
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowNotification(false);

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      const response = await registerVolunteer(data);
      setSavedVolunteer(response); // Save returned volunteer
      setMessage("Volunteer registered successfully!");

      // Reset form except for savedVolunteer
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
        skills: "",
        occupation: "",
        education: "",
        experience: "",
        availability: "",
        profilePicture: null,
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to register volunteer.");
    }

    setShowNotification(true);
    setLoading(false);
  };

  const getProfilePictureUrl = () => {
    if (formData.profilePicture) {
      // Preview before submission
      return URL.createObjectURL(formData.profilePicture);
    } else if (savedVolunteer?.profilePicture) {
      // After save, show backend image
      return `http://localhost:8080/uploads/profile-pics/${savedVolunteer.profilePicture}`;
    }
    return null;
  };

  return (
    <div className="volunteer-register-page">
      <div className="volunteer-register-left">
        <div className="volunteer-register-headline">
          <h1>Are you ready to become a volunteer?</h1>
          <p className="volunteer-animated-message">{messages[headlineIndex]}</p>
        </div>
      </div>

      <div className="volunteer-register-right">
        <div className="volunteer-register-form-container">
          <h2>Hey Volunteer, Register Now</h2>

          <form onSubmit={handleSubmit} className="volunteer-register-form">
            {/* Name */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Name</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Email</label>
              <input
                className="volunteer-form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Phone</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Address</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Gender */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Gender</label>
              <select
                className="volunteer-form-select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* DOB */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Date of Birth</label>
              <input
                className="volunteer-form-input"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            {/* Skills */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Skills</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            {/* Occupation */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Occupation</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>

            {/* Education */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Education</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            {/* Experience */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Experience</label>
              <input
                className="volunteer-form-input"
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            {/* Availability */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Availability</label>
              <select
                className="volunteer-form-select"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="WEEKDAYS">Weekdays</option>
                <option value="WEEKENDS">Weekends</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            {/* Profile Picture */}
            <div className="volunteer-form-row">
              <label className="volunteer-form-label">Profile Picture</label>
              <input
                className="volunteer-form-input"
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Image preview */}
            {getProfilePictureUrl() && (
              <img
                src={getProfilePictureUrl()}
                alt="Profile"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  marginLeft: "10px",
                  marginTop: "5px",
                }}
              />
            )}

            <button
              type="submit"
              className="volunteer-register-btn"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {showNotification && <Notification message={message} />}
        </div>
      </div>
    </div>
  );
}

export default VolunteerRegister;
