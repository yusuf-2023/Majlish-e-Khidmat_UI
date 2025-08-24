import React from "react";

function RazorpayButton({ order, donorName, onSuccess, onFailure }) {
  const handlePayment = () => {
    if (!window.Razorpay) {
      // Razorpay SDK नहीं loaded है
      onFailure(new Error("Razorpay SDK not loaded"));
      return;
    }

    const options = {
      key: order.keyId,
      amount: order.amountInPaise,
      currency: order.currency,
      name: "Donation",
      description: "Donation Payment",
      order_id: order.orderId,
      prefill: {
        name: donorName,
      },
      handler: function (response) {
        // Payment success
        onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          // User closed modal
          onFailure(new Error("Payment cancelled"));
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      onFailure(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      style={{ cursor: "pointer", padding: "8px 16px", background: "#528FF0", color: "#fff", border: "none", borderRadius: "4px" }}
    >
      Pay with Razorpay
    </button>
  );
}

export default RazorpayButton;
