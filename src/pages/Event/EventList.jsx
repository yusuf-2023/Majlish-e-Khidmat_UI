// src/pages/Event/EventList.jsx
import React, { useEffect, useState, useContext } from "react";
import { getAllEvents, deleteEvent } from "../../api/event/eventApi";
import Notification from "../../components/Notification";
import "../../styles/EventList.css";
import { AuthContext } from "../../context/AuthContext";

const EventList = () => {
  const { role } = useContext(AuthContext);
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
    fetchEvents(); // Role check hata diya, dono users fetch karenge
  }, []);

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
        <div className="eventlist-responsive-table">
          <table className="eventlist-table">
            <thead>
              <tr>
                <th className="eventlist-th">Name</th>
                <th className="eventlist-th">Location</th>
                <th className="eventlist-th">Date</th>
                <th className="eventlist-th">Description</th>
                {role === "ADMIN" && <th className="eventlist-th">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="eventlist-tr">
                  <td className="eventlist-td" data-label="Name">{ev.name}</td>
                  <td className="eventlist-td" data-label="Location">{ev.location}</td>
                  <td className="eventlist-td" data-label="Date">{new Date(ev.date).toLocaleString()}</td>
                  <td className="eventlist-td" data-label="Description">{ev.description}</td>
                  {role === "ADMIN" && (
                    <td className="eventlist-td" data-label="Actions">
                      <button className="eventlist-btn" onClick={() => handleDelete(ev.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventList;
