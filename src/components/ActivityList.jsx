import React, { useContext } from "react";
import ActivityCard from "../pages/activity/ActivityCard";
import { AuthContext } from "../context/AuthContext";
import "../styles/ActivityPage.css";

const ActivityList = ({ activities, fetchActivities, onShowNotification }) => {
    const { role, user } = useContext(AuthContext);

    if (!activities || activities.length === 0) {
        return <p className="no-activities">No activities found.</p>;
    }

    return (
        <div className="activities-grid">
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    role={role}
                    user={user}
                    fetchActivities={fetchActivities}
                    onShowNotification={onShowNotification}
                />
            ))}
        </div>
    );
};

export default ActivityList;