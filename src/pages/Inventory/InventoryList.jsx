import React, { useEffect, useState } from "react";
import { getAllInventoryItems, deleteInventoryItem } from "../../api/inventoryApi";
import "../../styles/InventoryList.css";
import Notification from "../../components/Notification";

function InventoryList({ refreshFlag }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: "", category: "" });
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // Load inventory items
  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAllInventoryItems();
      setItems(data);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setMessage("Failed to load inventory items.");
      setShowNotification(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, [refreshFlag]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteInventoryItem(id);
      setMessage("Inventory item deleted successfully.");
      setShowNotification(true);
      setTimeout(() => loadItems(), 100);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete item.");
      setShowNotification(true);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      (item.itemName || "").toLowerCase().includes(filter.name.toLowerCase()) &&
      (item.category || "").toLowerCase().includes(filter.category.toLowerCase())
  );

  if (loading) return <div className="loading">Loading inventory...</div>;

  return (
    <div className="inventory-list-container">
      <h2>Inventory List</h2>

      {/* Filter Section */}
      <div className="inventory-filter">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="empty-message">No inventory items found.</p>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.description}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default InventoryList;
