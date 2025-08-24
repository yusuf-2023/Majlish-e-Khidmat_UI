import React, { useEffect, useState } from "react";
import { getAllDonations } from "../../api/donationApi";
import "../../styles/Donation.css";

function DonationList() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      setLoading(true);
      try {
        const data = await getAllDonations(); // DTO list expected
        setDonations(data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
      setLoading(false);
    };

    loadDonations();
  }, []);

  if (loading) return <div>Loading donations...</div>;

  return (
    <div className="donation-list-container">
      <h2>Donation List</h2>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table className="donation-table">
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.donorName}</td>
                <td>{donation.amount}</td>
                <td>{donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : "N/A"}</td>
                <td>{donation.paymentMethod || "N/A"}</td>
                <td>{donation.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DonationList;
