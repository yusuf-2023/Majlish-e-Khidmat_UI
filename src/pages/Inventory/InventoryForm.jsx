import React, { useState } from "react";
import createInventoryItem from "../../api/inventoryApi";
import "../../styles/Inventory.css";
import Notification from "../../components/Notification"; // ✅ Notification import

function InventoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

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
      const response = await createInventoryItem(formData);
      setMessage(response?.message || "Inventory item added successfully!");
      setFormData({ name: "", quantity: 0, description: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add inventory item.");
    }

    setShowNotification(true); // ✅ Notification trigger
    setLoading(false);
  };

  return (
    <div className="inventory-form-container">
      <h2>Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="inventory-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>

      {/* ✅ Notification Component */}
      {showNotification && (
        <Notification
          message={message}
          onClose={() => setShowNotification(false)}
          duration={2500}
        />
      )}
    </div>
  );
}

export default InventoryForm;
