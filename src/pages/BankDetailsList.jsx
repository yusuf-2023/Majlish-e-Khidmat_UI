import React, { useEffect, useState } from "react";
import { listAllBanks, deleteBank, updateBank } from "../api/bankApi";
import "../styles/AdminBank.css";

export default function BankDetailsList() {
  const [banks, setBanks] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    label: "",
    bankName: "",
    upiId: "",
    active: true,
    gateway: "",
    keyId: "",
    keySecret: "",
    staticQrImageUrl: "",
  });

  // Fetch all banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const data = await listAllBanks();
      setBanks(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load bank accounts.");
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Start editing a bank
  const startEdit = (bank) => {
    setEditingId(bank.id);
    setForm({
      label: bank.label,
      bankName: bank.bankName,
      upiId: bank.upiId || "",
      active: bank.active,
      gateway: bank.gateway || "",
      keyId: bank.keyId || "",
      keySecret: bank.keySecret || "",
      staticQrImageUrl: bank.staticQrImageUrl || "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      label: "",
      bankName: "",
      upiId: "",
      active: true,
      gateway: "",
      keyId: "",
      keySecret: "",
      staticQrImageUrl: "",
    });
  };

  // Submit update
  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateBank(editingId, form);
      setMessage("Bank account updated successfully.");
      cancelEdit();
      fetchBanks();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update bank account.");
    }
  };

  // Delete bank
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return;
    try {
      await deleteBank(id);
      setMessage("Bank account deleted successfully.");
      fetchBanks();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete bank account.");
    }
  };

  return (
    <div className="admin-bank">
      <h2>Bank Accounts List</h2>
      {message && <p className="form-message">{message}</p>}

      {editingId && (
        <form onSubmit={submitEdit} className="admin-bank-form">
          <h3>Edit Bank Account</h3>
          <input
            name="label"
            placeholder="Label"
            value={form.label}
            onChange={handleChange}
            required
          />
          <input
            name="bankName"
            placeholder="Bank Name"
            value={form.bankName}
            onChange={handleChange}
            required
          />
          <input
            name="upiId"
            placeholder="UPI ID (optional)"
            value={form.upiId}
            onChange={handleChange}
          />
          <input
            name="gateway"
            placeholder="Gateway (optional)"
            value={form.gateway}
            onChange={handleChange}
          />
          <input
            name="keyId"
            placeholder="Key ID (optional)"
            value={form.keyId}
            onChange={handleChange}
          />
          <input
            name="keySecret"
            placeholder="Key Secret (optional)"
            value={form.keySecret}
            onChange={handleChange}
          />
          <input
            name="staticQrImageUrl"
            placeholder="Static QR Image URL (optional)"
            value={form.staticQrImageUrl}
            onChange={handleChange}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={cancelEdit}>Cancel</button>
        </form>
      )}

      <h3>All Bank Accounts</h3>
      <table className="bank-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Bank Name</th>
            <th>UPI ID</th>
            <th>Gateway</th>
            <th>Added By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b) => (
            <tr key={b.id}>
              <td>{b.label}</td>
              <td>{b.bankName}</td>
              <td>{b.upiId || "-"}</td>
              <td>{b.gateway || "-"}</td>
              <td>{b.addedByAdmin}</td>
              <td>{b.active ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => startEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
