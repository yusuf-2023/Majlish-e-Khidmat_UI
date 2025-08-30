import React, { useEffect, useState } from "react";
import { getAllCampaigns } from "../../api/Campaign/campaignApi";
import "../../styles/CampaignList.css";

function CampaignList() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadCampaigns = async () => {
            setLoading(true);
            try {
                const data = await getAllCampaigns();
                setCampaigns(data);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
            }
            setLoading(false);
        };

        loadCampaigns();
    }, []);

    // Filter campaigns by search
    const filteredCampaigns = campaigns.filter(
        (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading">Loading campaigns...</div>;

    return (
        <div className="campaign-list-container">
            <h2>Campaign List</h2>

            {/* Search Box */}
            <input
                type="text"
                className="campaign-search"
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filteredCampaigns.length === 0 ? (
                <p>No campaigns found.</p>
            ) : (
                <div className="campaign-table-wrapper">
                    <table className="campaign-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.map((campaign, index) => (
                                <tr key={campaign.id} className={`row-${index % 3}`}>
                                    <td>{campaign.title}</td>
                                    <td>{campaign.description}</td>
                                    <td>{campaign.startDate}</td>
                                    <td>{campaign.endDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CampaignList;