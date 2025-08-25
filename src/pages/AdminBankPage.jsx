import React, { useState, useEffect } from "react";
import { listAllBanks, createBank, deleteBank } from "../api/bankApi";
import "../styles/AdminBank.css";

export default function AdminBankPage() {
  const [banks, setBanks] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    label: "",
    paymentType: "BANK",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
    staticQrImageUrl: "",
    gateway: "",
    keyId: "",
    keySecret: "",
    active: true,
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const data = await listAllBanks();
      setBanks(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load bank accounts");
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const adminName = localStorage.getItem("adminName") || "Admin";
      await createBank(form, adminName);
      setMessage("Payment account added successfully!");
      setForm({
        label: "",
        paymentType: "BANK",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        upiId: "",
        staticQrImageUrl: "",
        gateway: "",
        keyId: "",
        keySecret: "",
        active: true,
      });
      fetchBanks();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add payment account");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBank(id);
      fetchBanks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-bank">
      <h2>Add Payment Account</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit} className="admin-bank-form">
        <input
          name="label"
          placeholder="Label"
          value={form.label}
          onChange={handleChange}
          required
        />

        <select
          name="paymentType"
          value={form.paymentType}
          onChange={handleChange}
        >
          <option value="BANK">Bank</option>
          <option value="UPI">UPI</option>
          <option value="GATEWAY">Gateway</option>
        </select>

        {form.paymentType === "BANK" && (
          <>
            <input
              name="bankName"
              placeholder="Bank Name"
              value={form.bankName}
              onChange={handleChange}
              required
            />
            <input
              name="accountNumber"
              placeholder="Account Number"
              value={form.accountNumber}
              onChange={handleChange}
              required
            />
            <input
              name="ifsc"
              placeholder="IFSC Code"
              value={form.ifsc}
              onChange={handleChange}
              required
            />
          </>
        )}

        {form.paymentType === "UPI" && (
          <>
            <input
              name="upiId"
              placeholder="UPI ID"
              value={form.upiId}
              onChange={handleChange}
              required
            />
            <input
              name="staticQrImageUrl"
              placeholder="QR Image URL (optional)"
              value={form.staticQrImageUrl}
              onChange={handleChange}
            />
          </>
        )}

        {form.paymentType === "GATEWAY" && (
          <>
            <input
              name="gateway"
              placeholder="Gateway Name"
              value={form.gateway}
              onChange={handleChange}
              required
            />
            <input
              name="keyId"
              placeholder="Key ID"
              value={form.keyId}
              onChange={handleChange}
              required
            />
            <input
              name="keySecret"
              placeholder="Key Secret"
              value={form.keySecret}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Save</button>
      </form>

      <h3>All Payment Accounts</h3>
      <ul>
        {banks.map((b) => (
          <li key={b.id}>
            {b.label} ({b.paymentType}) - Added by {b.addedByAdmin}
            <button className="delete-btn" onClick={() => handleDelete(b.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
