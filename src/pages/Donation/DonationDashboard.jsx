import React, { useEffect, useState, useCallback } from "react";
import {
  Bar,
  Pie,
  Doughnut,
  Line,
  PolarArea,
  Radar,
  Bubble
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { listAllBanks } from "../../api/bankApi";
import { listAllDonations } from "../../api/donationApi";
import "../../styles/dashboardDonation.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Animation configurations
const ANIMATION_CONFIG = {
  duration: 2000,
  easing: "easeOutQuart",
  delay: 300,
  loop: false
};

// Color palettes for charts
const COLOR_PALETTES = {
  vibrant: [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(199, 199, 199, 0.8)",
    "rgba(83, 102, 255, 0.8)",
    "rgba(40, 159, 64, 0.8)",
    "rgba(210, 99, 132, 0.8)"
  ],
  pastel: [
    "rgba(255, 138, 168, 0.7)",
    "rgba(124, 198, 254, 0.7)",
    "rgba(255, 223, 128, 0.7)",
    "rgba(125, 222, 222, 0.7)",
    "rgba(193, 162, 255, 0.7)",
    "rgba(255, 194, 128, 0.7)",
    "rgba(229, 229, 229, 0.7)",
    "rgba(143, 162, 255, 0.7)",
    "rgba(110, 199, 134, 0.7)",
    "rgba(240, 138, 168, 0.7)"
  ]
};

function DonationDashboard() {
  const [donations, setDonations] = useState([]);
  const [allBanks, setAllBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [chartOrder, setChartOrder] = useState([
    "month",
    "donor",
    "bank",
    "trend",
    "radar"
  ]);
  const [colorPalette, setColorPalette] = useState("vibrant");
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const donationTypes = ["All", "Bank", "UPI", "Gateway"];
  const timeRanges = [
    { value: "all", label: "All Time" },
    { value: "year", label: "This Year" },
    { value: "month", label: "This Month" },
    { value: "week", label: "This Week" }
  ];

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  // Fetch data with useCallback to memoize the function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [donationData, allBankData] = await Promise.all([
        listAllDonations(),
        listAllBanks()
      ]);
      setDonations(donationData);
      setAllBanks(allBankData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      setMessage("Failed to load dashboard data.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Set initial theme based on system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPrefersDark);
    document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }, [fetchData]);

  // Filter donations based on selected criteria
  const filteredDonations = useCallback(() => {
    let result = donations.filter(d => {
      const bankMatch =
        selectedBank === "All" ||
        (d.bankName || d.upiId || d.gateway || "Other") === selectedBank;
      const typeMatch =
        selectedType === "All" || (d.method || "Unknown") === selectedType;
      return bankMatch && typeMatch;
    });

    // Apply time range filter
    const now = new Date();
    if (selectedTimeRange !== "all") {
      result = result.filter(d => {
        const donationDate = d.createdAt ? new Date(d.createdAt) : new Date(0);
        switch (selectedTimeRange) {
          case "year":
            return donationDate.getFullYear() === now.getFullYear();
          case "month":
            return (
              donationDate.getFullYear() === now.getFullYear() &&
              donationDate.getMonth() === now.getMonth()
            );
          case "week":
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return donationDate >= oneWeekAgo;
          default:
            return true;
        }
      });
    }

    return result;
  }, [donations, selectedBank, selectedType, selectedTimeRange]);

  // Process data for charts
  const processChartData = useCallback(() => {
    const filteredData = filteredDonations();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Monthly data
    const monthWiseData = Array(12).fill(0);
    const monthWiseCount = Array(12).fill(0);
    
    // Donor data
    const donorMap = {};
    
    // Bank data
    const bankMap = {};
    
    // Process each donation
    filteredData.forEach(d => {
      const donationDate = d.createdAt ? new Date(d.createdAt) : new Date();
      const month = donationDate.getMonth();
      const amount = d.amount || 0;
      
      // Monthly totals
      monthWiseData[month] += amount;
      monthWiseCount[month] += 1;
      
      // Donor totals
      donorMap[d.donorName] = (donorMap[d.donorName] || 0) + amount;
      
      // Bank totals
      const bankName = d.bankName || d.upiId || d.gateway || "Other";
      bankMap[bankName] = (bankMap[bankName] || 0) + amount;
    });
    
    // Get top 5 donors
    const topDonors = Object.entries(donorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Calculate average donation by month
    const avgDonationByMonth = monthWiseData.map((total, i) => 
      monthWiseCount[i] > 0 ? total / monthWiseCount[i] : 0
    );
    
    // Prepare radar data (comparison by payment method)
    const methodMap = {};
    filteredData.forEach(d => {
      const method = d.method || "Unknown";
      methodMap[method] = (methodMap[method] || 0) + (d.amount || 0);
    });
    
    return {
      monthWiseData,
      monthWiseCount,
      avgDonationByMonth,
      topDonors,
      bankMap,
      methodMap
    };
  }, [filteredDonations]);

  const chartData = processChartData();
  const colors = COLOR_PALETTES[colorPalette];

  // Update chart options for dark mode
  const getChartOptions = (baseOptions) => {
    const gridColor = darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    const textColor = darkMode ? "#ccc" : "#666";
    
    return {
      ...baseOptions,
      scales: baseOptions.scales ? {
        ...baseOptions.scales,
        y: baseOptions.scales.y ? {
          ...baseOptions.scales.y,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        } : undefined,
        x: baseOptions.scales.x ? {
          ...baseOptions.scales.x,
          grid: {
            display: false
          },
          ticks: {
            color: textColor
          }
        } : undefined,
        r: baseOptions.scales.r ? {
          ...baseOptions.scales.r,
          grid: {
            color: gridColor
          },
          angleLines: {
            color: gridColor
          },
          pointLabels: {
            color: textColor
          },
          ticks: {
            color: textColor,
            backdropColor: darkMode ? "#1e1e1e" : "#fff"
          }
        } : undefined
      } : undefined,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins?.legend,
          labels: {
            color: textColor
          }
        },
        title: {
          ...baseOptions.plugins?.title,
          color: textColor
        }
      }
    };
  };

  // Chart configurations
  const charts = {
    month: {
      title: "Monthly Donations",
      type: Bar,
      data: {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
          {
            label: "Total Amount",
            data: chartData.monthWiseData,
            backgroundColor: colors[0],
            borderColor: colors[0].replace("0.8", "1"),
            borderWidth: 2,
            borderRadius: 6,
            barPercentage: 0.7
          },
          {
            label: "Donation Count",
            data: chartData.monthWiseCount,
            backgroundColor: colors[1],
            borderColor: colors[1].replace("0.8", "1"),
            borderWidth: 2,
            borderRadius: 6,
            barPercentage: 0.7
          }
        ]
      },
      options: getChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Monthly Donations (Amount & Count)"
          }
        },
        animation: animationEnabled ? {
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          delay: ANIMATION_CONFIG.delay
        } : false,
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      })
    },
    donor: {
      title: "Top Donors",
      type: Pie,
      data: {
        labels: chartData.topDonors.map(d => d[0]),
        datasets: [
          {
            data: chartData.topDonors.map(d => d[1]),
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace("0.8", "1")),
            borderWidth: 2,
            hoverOffset: 20
          }
        ]
      },
      options: getChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Top 5 Donors by Contribution"
          }
        },
        animation: animationEnabled ? {
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          delay: ANIMATION_CONFIG.delay
        } : false,
        cutout: "0%"
      })
    },
    bank: {
      title: "Bank-wise Donations",
      type: Doughnut,
      data: {
        labels: Object.keys(chartData.bankMap),
        datasets: [
          {
            data: Object.values(chartData.bankMap),
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace("0.8", "1")),
            borderWidth: 2,
            hoverOffset: 20
          }
        ]
      },
      options: getChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Contributions by Payment Method"
          }
        },
        animation: animationEnabled ? {
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          delay: ANIMATION_CONFIG.delay
        } : false,
        cutout: "50%"
      })
    },
    trend: {
      title: "Donation Trends",
      type: Line,
      data: {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
          {
            label: "Total Amount",
            data: chartData.monthWiseData,
            borderColor: colors[0],
            backgroundColor: colors[0].replace("0.8", "0.2"),
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors[0],
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: "Average Donation",
            data: chartData.avgDonationByMonth,
            borderColor: colors[1],
            backgroundColor: colors[1].replace("0.8", "0.2"),
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors[1],
            pointRadius: 5,
            pointHoverRadius: 8
          }
        ]
      },
      options: getChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Monthly Donation Trends"
          }
        },
        animation: animationEnabled ? {
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          delay: ANIMATION_CONFIG.delay
        } : false,
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      })
    },
    radar: {
      title: "Payment Method Analysis",
      type: Radar,
      data: {
        labels: Object.keys(chartData.methodMap),
        datasets: [
          {
            label: "Amount by Method",
            data: Object.values(chartData.methodMap),
            backgroundColor: colors[0].replace("0.8", "0.2"),
            borderColor: colors[0],
            pointBackgroundColor: colors[0],
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: colors[0],
            pointRadius: 5,
            pointHoverRadius: 8
          }
        ]
      },
      options: getChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Contributions by Payment Method"
          }
        },
        animation: animationEnabled ? {
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          delay: ANIMATION_CONFIG.delay
        } : false,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0
          }
        }
      })
    }
  };

  const handleDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(chartOrder);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setChartOrder(items);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading donation dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Donation Analytics Dashboard</h1>
        <div className="dashboard-controls">
          <button 
            className="refresh-btn"
            onClick={fetchData}
            title="Refresh Data"
          >
            ↻ Refresh
          </button>
          <select
            value={colorPalette}
            onChange={e => setColorPalette(e.target.value)}
            className="palette-selector"
          >
            <option value="vibrant">Vibrant Colors</option>
            <option value="pastel">Pastel Colors</option>
          </select>
          <label className="animation-toggle">
            <input
              type="checkbox"
              checked={animationEnabled}
              onChange={() => setAnimationEnabled(!animationEnabled)}
            />
            Animations
          </label>
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {message && <div className="dashboard-message">{message}</div>}

      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Bank:</label>
          <select
            value={selectedBank}
            onChange={e => setSelectedBank(e.target.value)}
          >
            <option value="All">All Banks</option>
            {allBanks.map(b => (
              <option key={b.id} value={b.bankName || b.upiId || b.gateway}>
                {b.label} ({b.bankName || b.upiId || b.gateway})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            {donationTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Time Range:</label>
          <select
            value={selectedTimeRange}
            onChange={e => setSelectedTimeRange(e.target.value)}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Donations</h3>
          <p className="summary-value">
            ₹{filteredDonations().reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Donation Count</h3>
          <p className="summary-value">{filteredDonations().length}</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Donation</h3>
          <p className="summary-value">
            ₹{(filteredDonations().reduce((sum, d) => sum + (d.amount || 0), 0) / 
              (filteredDonations().length || 1)).toFixed(2)}
          </p>
        </div>
        <div className="summary-card">
          <h3>Top Donor</h3>
          <p className="summary-value">
            {chartData.topDonors[0]?.[0] || "N/A"}
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="charts" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={`charts-container ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {chartOrder.map((chartKey, index) => {
                const chart = charts[chartKey];
                if (!chart) return null;
                
                const ChartComponent = chart.type;
                return (
                  <Draggable
                    key={chartKey}
                    draggableId={chartKey}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`chart-box ${snapshot.isDragging ? "dragging" : ""}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div className="chart-header" {...provided.dragHandleProps}>
                          <h3>{chart.title}</h3>
                          <span className="drag-handle">≡</span>
                        </div>
                        <div className="chart-content">
                          <ChartComponent data={chart.data} options={chart.options} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="data-tables">
        <div className="table-section">
          <h3>All Donations</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Bank / UPI / Gateway</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations().map((d, index) => (
                  <tr key={index}>
                    <td>{d.donorName}</td>
                    <td>{d.email || "-"}</td>
                    <td>₹ {(d.amount || 0).toLocaleString()}</td>
                    <td>{d.bankName || d.upiId || d.gateway || "N/A"}</td>
                    <td>{d.method || "Unknown"}</td>
                    <td>
                      {d.createdAt
                        ? new Date(d.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section">
          <h3>All Bank Accounts</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Bank Name</th>
                  <th>UPI ID</th>
                  <th>Gateway</th>
                  <th>Added By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBanks.map(b => (
                  <tr key={b.id}>
                    <td>{b.label}</td>
                    <td>{b.bankName}</td>
                    <td>{b.upiId || "-"}</td>
                    <td>{b.gateway || "-"}</td>
                    <td>{b.addedByAdmin}</td>
                    <td>
                      <span className={`status ${b.active ? "active" : "inactive"}`}>
                        {b.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationDashboard;