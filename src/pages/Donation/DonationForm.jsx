import React, { useEffect, useState } from "react";
import { listActiveBanks } from "../../api/bankApi";
import donationApi from "../../api/donationApi";
import RazorpayButton from "../../components/RazorpayButton";
import UpiQrBlock from "../../components/UpiQrBlock";
import "../../styles/Donation.css";
import Notification from "../../components/Notification";

function DonationForm() {
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({
    donorName: "",
    amount: "",
    accountId: "",
    method: "UPI",
  });
  const [order, setOrder] = useState(null);
  const [upiLink, setUpiLink] = useState("");
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    listActiveBanks()
      .then(setBanks)
      .catch(() => {
        setMessage("Failed to load active banks. Please login again.");
        setShowNotification(true);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const createOrder = async (e) => {
    e.preventDefault();
    setMessage("");
    setShowNotification(false);
    setOrder(null);
    setUpiLink("");

    const selected = banks.find((b) => b.id === Number(formData.accountId));
    if (!selected) {
      setMessage("Please select a valid account");
      setShowNotification(true);
      return;
    }

    if (formData.method === "UPI") {
      if (!selected.upiId) {
        setMessage("Selected account is not a UPI account");
        setShowNotification(true);
        return;
      }
      const link = `upi://pay?pa=${encodeURIComponent(selected.upiId)}&pn=${encodeURIComponent(selected.label)}&am=${encodeURIComponent(formData.amount)}&cu=INR&tn=Donation`;
      setUpiLink(link);
      return;
    }

    if (formData.method !== "UPI" && selected.paymentType !== "GATEWAY") {
      setMessage("Selected account is not a gateway account for Razorpay payment");
      setShowNotification(true);
      return;
    }

    try {
      const payload = {
        donorName: formData.donorName,
        amount: parseFloat(formData.amount),
        accountId: Number(formData.accountId),
        method: formData.method,
      };

      // DTO return expected from backend: CreateOrderResponse
      const ord = await donationApi.createOrder(payload);

      setOrder({
        orderId: ord.orderId,
        keyId: ord.keyId,
        amountInPaise: ord.amountInPaise,
        currency: ord.currency,
        receipt: ord.receipt,
        donationId: ord.donationId, // ✅ DTO field
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to create order. Try again later.");
      setShowNotification(true);
    }
  };

  const onRazorpaySuccess = async (r) => {
    if (!order) return;
    try {
      const res = await donationApi.verifyPayment({
        donationId: order.donationId,
        razorpayPaymentId: r.razorpay_payment_id,
        razorpayOrderId: r.razorpay_order_id,
        razorpaySignature: r.razorpay_signature,
      });

      setMessage(res.message || "Payment verified successfully!");
      setShowNotification(true);

      // Reset form
      setOrder(null);
      setUpiLink("");
      setFormData({ donorName: "", amount: "", accountId: "", method: "UPI" });
    } catch (err) {
      console.error(err);
      setMessage("Payment verification failed. Try again.");
      setShowNotification(true);
    }
  };

  return (
    <div className="donation-form-container">
      <h2>Donate</h2>
      <form onSubmit={createOrder} className="donation-form">
        <label>
          Donor Name:
          <input name="donorName" value={formData.donorName} onChange={handleChange} required />
        </label>

        <label>
          Amount (INR):
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="1" />
        </label>

        <label>
          Pay To (Account):
          <select name="accountId" value={formData.accountId} onChange={handleChange} required>
            <option value="" disabled>Select</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label} — {b.bankName} {b.upiId ? ` (UPI: ${b.upiId})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Method:
          <select name="method" value={formData.method} onChange={handleChange}>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NETBANKING">Netbanking</option>
          </select>
        </label>

        <button type="submit">Create Order</button>
      </form>

      {order && formData.method !== "UPI" && (
        <div className="pay-actions">
          <RazorpayButton
            order={order}
            donorName={formData.donorName}
            onSuccess={onRazorpaySuccess}
            onFailure={(e) => {
              setMessage(e.message || "Payment cancelled");
              setShowNotification(true);
            }}
          />
        </div>
      )}

      {upiLink && <div className="upi-block"><UpiQrBlock upiLink={upiLink} /></div>}

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

export default DonationForm;
