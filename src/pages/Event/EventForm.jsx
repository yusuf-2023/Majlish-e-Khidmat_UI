import React, { useState, useEffect, useContext } from "react";
import { createEvent, getEventById } from "../../api/event/eventApi";
import Notification from "../../components/Notification";
import "../../styles/Event.css";
import { AuthContext } from "../../context/AuthContext";

const EventForm = ({ eventId }) => {
  const { role } = useContext(AuthContext); // Get role from AuthContext
  const [event, setEvent] = useState({
    name: "",
    location: "",
    date: "",
    description: "",
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (eventId) {
      getEventById(eventId)
        .then((data) =>
          setEvent({
            name: data.name,
            location: data.location,
            date: data.date.slice(0, 16),
            description: data.description,
          })
        )
        .catch((err) => console.error(err));
    }
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || (role !== "ADMIN" && role !== "USER")) {
      setNotification("You are not allowed to create events");
      return;
    }

    try {
      await createEvent(event);
      setNotification("Event created successfully!");
      setEvent({ name: "", location: "", date: "", description: "" });
    } catch (err) {
      console.error(err);
      setNotification("Error creating event");
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <div className="event-page-container">
      <div className="event-image-section">
        <div className="event-image-overlay">
          <h2>Create Memorable Events</h2>
          <p>Plan your events with ease and precision. Our platform helps you organize everything in one place.</p>
        </div>
      </div>
      
      <div className="event-form-section">
        <div className="event-form-container">
          <h2>{eventId ? "Event Details" : "Create Event"}</h2>

          {notification && (
            <Notification
              message={notification}
              onClose={handleNotificationClose}
              duration={2000}
              className="event-notification"
            />
          )}

          {!eventId && (
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="name">Event Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter event name"
                  value={event.name}
                  onChange={handleChange}
                  required
                  className="event-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter event location"
                  value={event.location}
                  onChange={handleChange}
                  required
                  className="event-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date & Time</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={event.date}
                  onChange={handleChange}
                  required
                  className="event-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event"
                  value={event.description}
                  onChange={handleChange}
                  required
                  className="event-textarea"
                />
              </div>
              
              <button type="submit" className="event-button">
                Create Event
              </button>
            </form>
          )}

          {eventId && (
            <div className="event-details">
              <p><strong>Name:</strong> {event.name}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Description:</strong> {event.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventForm;