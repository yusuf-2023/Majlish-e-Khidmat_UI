import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { getActivities } from "../../api/activity/activityApi";
import ActivityList from "../../components/ActivityList";
import Loader from "../../components/common/Loader";
import Notification from "../../components/Notification";
import { FaPlusCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext"; // Add this
import "../../styles/ActivityPage.css";

const ActivityListPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const location = useLocation();

    const { role } = useContext(AuthContext); // Add this

    // This function will be passed down as a prop
    const handleShowNotification = useCallback((message, type = "info", isUndoable = false, onUndo = null, duration = 3000) => {
        setNotification({ message, type, isUndoable, onUndo, duration });
    }, []);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await getActivities();
            setActivities(res.data);
        } catch (err) {
            console.error("Fetch Activities Error:", err);
            handleShowNotification("Failed to fetch activities. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        if (location.state && location.state.notification) {
            const { message, type, duration } = location.state.notification;
            handleShowNotification(message, type, false, null, duration);
        }
    }, [location.state, handleShowNotification]);

    if (loading) {
        return <Loader text="Loading Activities..." />;
    }

    return (
        <div className="activity-list-page section-content" style={{marginTop: '70px' }}>
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
            <div className="activities-header" style={{ marginTop: '60px' }}>
                <h2 className="section-title" style={{ color: 'var(--text-color)', textAlign: 'center' }}>All Activities</h2>
                {role === "ADMIN" && (
                    <Link to="/admin/activities/add" className="add-activity-btn">
                        <FaPlusCircle /> Add New Activity
                    </Link>
                )}
            </div>
            <div className="activities-grid">
                {activities && activities.length > 0 ? (
                    <ActivityList activities={activities} fetchActivities={fetchActivities} onShowNotification={handleShowNotification} />
                ) : (
                    <p className="no-activities">No activities found.</p>
                )}
            </div>
        </div>
    );
};

export default ActivityListPage;
