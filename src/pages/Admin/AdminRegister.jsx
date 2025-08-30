import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminRegister } from "../../api/admin/adminApi";
import "../../styles/AdminRegister.css";
import Notification from "../../components/Notification";
import {
    FaUsersCog,
    FaChartLine,
    FaDatabase,
    FaClipboardCheck,
    FaUserShield,
    FaTools,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

function AdminRegister() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        role: "ADMIN",
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // ===== Topics with icons for the banner carousel =====
    const topics = [
        { icon: <FaUsersCog />, text: "Manage Users & Roles" },
        { icon: <FaChartLine />, text: "Monitor Analytics" },
        { icon: <FaDatabase />, text: "Oversee Data" },
        { icon: <FaClipboardCheck />, text: "Verify Donations" },
        { icon: <FaUserShield />, text: "Ensure Security" },
        { icon: <FaTools />, text: "System Management" },
    ];

    const [currentTopic, setCurrentTopic] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTopic((prev) => (prev + 1) % topics.length);
        }, 3000); // 3s per topic
        return () => clearInterval(interval);
    }, [topics.length]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (formData.dob && !dobRegex.test(formData.dob)) {
                setError("Invalid date format. Please use YYYY-MM-DD.");
                setIsLoading(false);
                return;
            }
            
            await adminRegister(formData, selectedFile);

            setNotificationMsg(`${formData.role} registered successfully!`);
            setShowNotification(true);
            
            setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                dob: "",
                gender: "",
                role: "ADMIN",
            });
            setSelectedFile(null);

            setTimeout(() => {
                setShowNotification(false);
                navigate("/auth/login");
            }, 2000);
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showNotification && (
                <Notification
                    message={notificationMsg}
                    onClose={() => setShowNotification(false)}
                />
            )}

            <div className="admin-register-container">
                <div className="admin-register-left-panel">
                    <div 
                        className="admin-register-banner"
                        style={{ backgroundImage: `url("/child10.jpg")` }}
                    >
                        <div className="banner-overlay">
                            <div className="topic-carousel-container">
                                <div className="topic-carousel-item active">
                                    <span className="topic-carousel-icon">{topics[currentTopic].icon}</span>
                                    <span className="topic-carousel-text">{topics[currentTopic].text}</span>
                                </div>
                            </div>
                            <div className="banner-footer">
                                <p>© 2023 Admin Portal. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-register-right-panel">
                    <div className="admin-register-form-container">
                        <div className="form-header">
                            <h2>Create Admin Account</h2>
                            <p className="form-subtitle">
                                Set up an account to manage the platform
                            </p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="admin-register-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group password-group">
                                <label htmlFor="password">Password *</label>
                                <div className="password-input-container">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <span 
                                        className="password-toggle"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        placeholder="Optional"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="gender">Gender *</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">Role *</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="SUPERADMIN">Super Admin</option>
                                        <option value="MODERATOR">Moderator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="profilePic" className="file-input-label">
                                    Profile Picture (Optional)
                                </label>
                                <div className="file-input-container">
                                    <input
                                        id="profilePic"
                                        type="file"
                                        name="profilePic"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file-input"
                                    />
                                    <label htmlFor="profilePic" className="file-input-button">
                                        Choose File
                                    </label>
                                    <span className="file-name">
                                        {selectedFile ? selectedFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-container">
                                    <input type="checkbox" required />
                                    <span className="checkmark"></span>
                                    I agree to the <Link to="/terms">Terms and Conditions</Link>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create admin account'}
                            </button>
                        </form>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <p className="register-link">
                            Already have an account? <Link to="/auth/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminRegister;