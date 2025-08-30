import React, { useState, useEffect } from "react";
import { addInventoryItem } from "../../api/inventoryApi";
import "../../styles/Inventory.css";
import Notification from "../../components/Notification";
import { FaBoxes, FaChartLine, FaStore, FaTruckLoading } from "react-icons/fa";

function InventoryForm({ onItemAdded }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: 0,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // ===== Topics with icons for the banner carousel =====
  const topics = [
    { icon: <FaBoxes />, text: "Efficiently Manage Stock" },
    { icon: <FaChartLine />, text: "Gain Inventory Insights" },
    { icon: <FaStore />, text: "Organize Store Resources" },
    { icon: <FaTruckLoading />, text: "Track & Control Assets" },
  ];

  const [currentTopic, setCurrentTopic] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length);
    }, 5000); // Slower animation, 5s per topic
    return () => clearInterval(interval);
  }, [topics.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowNotification(false);

    try {
      await addInventoryItem(formData);
      setMessage("Inventory item added successfully!");
      setFormData({ itemName: "", category: "", quantity: 0, description: "" });
      if (onItemAdded) onItemAdded();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add inventory item.");
    }

    setShowNotification(true);
    setLoading(false);
  };

  return (
    <div className="inventory-split-container">
      <div className="inventory-image-section">
        <div className="inventory-text-content">
          <div className="inventory-text-wrapper">
            <h1 className="inventory-text">{topics[currentTopic].text}</h1>
          </div>
        </div>
      </div>

      <div className="inventory-form-section">
        <div className="inventory-form-container">
          <h2>Add Inventory Item</h2>
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="form-group">
              <label htmlFor="itemName">Item Name:</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Adding..." : "Add Item"}
            </button>
          </form>

          {showNotification && (
            <Notification
              message={message}
              onClose={() => setShowNotification(false)}
              duration={2500}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryForm;
