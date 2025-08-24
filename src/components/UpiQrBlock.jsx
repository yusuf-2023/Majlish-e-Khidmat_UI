import React from "react";

function UpiQrBlock({ upiLink }) {
  return (
    <div className="upi-qr-container">
      <p>Scan this UPI QR to pay:</p>
      <a href={upiLink} target="_blank" rel="noopener noreferrer">
        {upiLink}
      </a>
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          upiLink
        )}`}
        alt="UPI QR"
      />
    </div>
  );
}

export default UpiQrBlock;
