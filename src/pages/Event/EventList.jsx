// src/pages/Event/EventList.jsx
import React, { useEffect, useState, useContext } from "react";
import { getAllEvents, deleteEvent } from "../../api/event/eventApi";
import Notification from "../../components/Notification";
import "../../styles/EventList.css";
import { AuthContext } from "../../context/AuthContext";

const EventList = () => {
  const { role } = useContext(AuthContext); // Get role from AuthContext
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setNotification("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "ADMIN") fetchEvents();
  }, [role]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this event?")) {
      try {
        await deleteEvent(id);
        setNotification("Event deleted successfully!");
        fetchEvents();
      } catch (err) {
        console.error(err);
        setNotification("Error deleting event");
      }
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  if (role !== "ADMIN") return <p className="eventlist-not-authorized">You are not authorized to view all events.</p>;
  if (loading) return <p className="eventlist-loading">Loading events...</p>;

  return (
    <div className="eventlist-container">
      <h2 className="eventlist-heading">All Events</h2>

      {notification && (
        <Notification
          message={notification}
          onClose={handleNotificationClose}
          duration={2000}
          className="eventlist-notification"
        />
      )}

      {events.length === 0 ? (
        <p className="eventlist-empty">No events found.</p>
      ) : (
        <table className="eventlist-table">
          <thead>
            <tr>
              <th className="eventlist-th">Name</th>
              <th className="eventlist-th">Location</th>
              <th className="eventlist-th">Date</th>
              <th className="eventlist-th">Description</th>
              <th className="eventlist-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="eventlist-tr">
                <td className="eventlist-td">{ev.name}</td>
                <td className="eventlist-td">{ev.location}</td>
                <td className="eventlist-td">{new Date(ev.date).toLocaleString()}</td>
                <td className="eventlist-td">{ev.description}</td>
                <td className="eventlist-td">
                  <button className="eventlist-btn" onClick={() => handleDelete(ev.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventList;
