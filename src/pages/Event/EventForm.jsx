// src/pages/Event/EventForm.jsx
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
    <div className="event-container">
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
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={event.name}
            onChange={handleChange}
            required
            className="event-input"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={event.location}
            onChange={handleChange}
            required
            className="event-input"
          />
          <input
            type="datetime-local"
            name="date"
            value={event.date}
            onChange={handleChange}
            required
            className="event-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={event.description}
            onChange={handleChange}
            required
            className="event-textarea"
          />
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
  );
};

export default EventForm;
