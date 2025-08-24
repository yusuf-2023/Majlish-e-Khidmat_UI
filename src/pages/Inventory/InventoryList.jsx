import React, { useEffect, useState } from "react";
import { getAllInventoryItems } from "../../api/inventoryApi";
import "../../styles/Inventory.css";


function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await getAllInventoryItems();
        setItems(data);
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      }
      setLoading(false);
    };

    loadItems();
  }, []);

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="inventory-list-container">
      <h2>Inventory List</h2>
      {items.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InventoryList;
