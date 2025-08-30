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

  // Function to format account number for display
  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return "";
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  return (
    <div className="admin-bank-page">
      <div className="admin-bank-left">
        <div className="admin-bank-headline">
          <h1>Manage Payment Accounts</h1>
          <p>Securely manage all your payment methods in one place</p>
        </div>
      </div>

      <div className="admin-bank-right">
        <div className="admin-bank-container">
          <h2>Add Payment Account</h2>
          {message && <p className="admin-bank-message">{message}</p>}
          
          <form onSubmit={handleSubmit} className="admin-bank-form">
            <div className="admin-bank-form-row">
              <div className="admin-bank-form-group">
                <label className="admin-bank-label">Label</label>
                <input
                  className="admin-bank-input"
                  name="label"
                  placeholder="Account Label"
                  value={form.label}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-bank-form-group">
                <label className="admin-bank-label">Payment Type</label>
                <select
                  className="admin-bank-select"
                  name="paymentType"
                  value={form.paymentType}
                  onChange={handleChange}
                >
                  <option value="BANK">Bank</option>
                  <option value="UPI">UPI</option>
                  <option value="GATEWAY">Gateway</option>
                </select>
              </div>
            </div>

            {form.paymentType === "BANK" && (
              <>
                <div className="admin-bank-form-row">
                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">Bank Name</label>
                    <input
                      className="admin-bank-input"
                      name="bankName"
                      placeholder="Bank Name"
                      value={form.bankName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">Account Number</label>
                    <input
                      className="admin-bank-input"
                      name="accountNumber"
                      placeholder="Account Number"
                      value={form.accountNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="admin-bank-form-row">
                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">IFSC Code</label>
                    <input
                      className="admin-bank-input"
                      name="ifsc"
                      placeholder="IFSC Code"
                      value={form.ifsc}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {form.paymentType === "UPI" && (
              <>
                <div className="admin-bank-form-row">
                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">UPI ID</label>
                    <input
                      className="admin-bank-input"
                      name="upiId"
                      placeholder="UPI ID"
                      value={form.upiId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="admin-bank-form-row">
                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">QR Image URL</label>
                    <input
                      className="admin-bank-input"
                      name="staticQrImageUrl"
                      placeholder="QR Image URL (optional)"
                      value={form.staticQrImageUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {form.paymentType === "GATEWAY" && (
              <>
                <div className="admin-bank-form-row">
                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">Gateway Name</label>
                    <input
                      className="admin-bank-input"
                      name="gateway"
                      placeholder="Gateway Name"
                      value={form.gateway}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="admin-bank-form-row">
                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">Key ID</label>
                    <input
                      className="admin-bank-input"
                      name="keyId"
                      placeholder="Key ID"
                      value={form.keyId}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-bank-form-group">
                    <label className="admin-bank-label">Key Secret</label>
                    <input
                      className="admin-bank-input"
                      name="keySecret"
                      placeholder="Key Secret"
                      value={form.keySecret}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="admin-bank-submit-btn">
              Save Payment Account
            </button>
          </form>

          <div className="admin-bank-accounts">
            <h3>All Payment Accounts</h3>
            
            {banks.length === 0 ? (
              <div className="admin-bank-empty">
                <p>No payment accounts added yet.</p>
              </div>
            ) : (
              <div className="admin-bank-list">
                {banks.map((b) => (
                  <div key={b.id} className="admin-bank-card">
                    <div className="admin-bank-card-header">
                      <h4>{b.label}</h4>
                      <span className={`admin-bank-status ${b.active ? 'active' : 'inactive'}`}>
                        {b.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="admin-bank-card-body">
                      <div className="admin-bank-detail">
                        <span className="admin-bank-detail-label">Type:</span>
                        <span className="admin-bank-detail-value">{b.paymentType}</span>
                      </div>
                      
                      <div className="admin-bank-detail">
                        <span className="admin-bank-detail-label">Added by:</span>
                        <span className="admin-bank-detail-value">{b.addedByAdmin}</span>
                      </div>
                      
                      {b.paymentType === "BANK" && (
                        <>
                          {b.bankName && (
                            <div className="admin-bank-detail">
                              <span className="admin-bank-detail-label">Bank:</span>
                              <span className="admin-bank-detail-value">{b.bankName}</span>
                            </div>
                          )}
                          <div className="admin-bank-detail">
                            <span className="admin-bank-detail-label">Account:</span>
                            <span className="admin-bank-detail-value">{formatAccountNumber(b.accountNumber)}</span>
                          </div>
                          {b.ifsc && (
                            <div className="admin-bank-detail">
                              <span className="admin-bank-detail-label">IFSC:</span>
                              <span className="admin-bank-detail-value">{b.ifsc}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {b.paymentType === "UPI" && b.upiId && (
                        <div className="admin-bank-detail">
                          <span className="admin-bank-detail-label">UPI ID:</span>
                          <span className="admin-bank-detail-value">{b.upiId}</span>
                        </div>
                      )}
                      
                      {b.paymentType === "GATEWAY" && b.gateway && (
                        <div className="admin-bank-detail">
                          <span className="admin-bank-detail-label">Gateway:</span>
                          <span className="admin-bank-detail-value">{b.gateway}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="admin-bank-card-footer">
                      <button
                        className="admin-bank-delete-btn"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}