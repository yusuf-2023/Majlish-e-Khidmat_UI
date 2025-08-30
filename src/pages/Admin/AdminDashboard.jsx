import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import "../../styles/AdminDashboard.css";
import Notification from "../../components/Notification";

// API imports
import {
  getAllAdmins,
  deleteAdminProfile,
  updateAdminProfile,
} from "../../api/admin/adminApi";
import {
  getAllUsers,
  deleteUserProfile,
  updateUserProfile,
} from "../../api/user/userApi";
import { getAllVolunteers } from "../../api/Volunteer/volunteerApi";
import { getAllEvents } from "../../api/event/eventApi";
import { getAllCampaigns } from "../../api/Campaign/campaignApi";
import { fetchStats } from "../../api/stats/statsApi";
import { uploadAdminProfilePic } from "../../api/admin/adminApi";
import { uploadUserProfilePic } from "../../api/user/userApi";

Chart.register(...registerables, ChartDataLabels);

const AdminDashboard = () => {
  const location = useLocation();

  const [state, setState] = useState({
    admins: [],
    users: [],
    volunteers: [],
    events: [],
    campaigns: [],
    stats: {
      volunteers: 0,
      donations: 0,
      communities: 0,
      events: 0,
      campaigns: 0,
      monthlyData: [],
      totalAdmins: 0,
      totalUsers: 0,
      monthlyUserGrowth: [],
      monthlyAdminGrowth: [],
    },
    loading: true,
    error: "",
    search: "",
    page: 1,
    sortConfig: { field: "name", direction: "asc" },
    editingItemId: null,
    editData: { id: null, name: "", email: "", file: null },
    undoDelete: null,
    selectedIds: new Set(),
    bulkAction: "",
    chartType: "pie",
    userAdminChartType: "pie",
    growthChartType: "line",
    activeTab: "admins", // admins | users
    notification: null,
  });

  const perPage = 8;
  const loggedInEmail = localStorage.getItem("userEmail") || localStorage.getItem("email");

  // Show notification
  const showNotification = useCallback((message) => {
    setState(prev => ({ ...prev, notification: message }));
    setTimeout(() => setState(prev => ({ ...prev, notification: null })), 3000);
  }, []);

  // auth guard — redirect to login if no token/email
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!loggedInEmail || !token) {
      window.location.href = "/admin/login";
    }
  }, [loggedInEmail]);

  // Refs used by undo timer
  const undoRef = useRef(null);
  const activeTabRef = useRef(state.activeTab);
  useEffect(() => {
    undoRef.current = state.undoDelete;
  }, [state.undoDelete]);
  useEffect(() => {
    activeTabRef.current = state.activeTab;
  }, [state.activeTab]);

  // ---------- helper: normalize API response to array ----------
  const extractArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    // axios-like responses: res.data or res.data.data
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    // Try shallow search for first array value in res.data
    if (res.data && typeof res.data === "object") {
      const vals = Object.values(res.data);
      for (let v of vals) {
        if (Array.isArray(v)) return v;
      }
    }
    return [];
  };

  // ================= DATA FETCH =================
  const fetchEverything = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      // Fetch all data in parallel
      const [adminsRes, usersRes, volunteersRes, eventsRes, campaignsRes] = await Promise.all([
        getAllAdmins().catch((e) => {
          console.warn("getAllAdmins failed:", e);
          return [];
        }),
        getAllUsers().catch((e) => {
          console.warn("getAllUsers failed:", e);
          return [];
        }),
        getAllVolunteers().catch((e) => {
          console.warn("getAllVolunteers failed:", e);
          return [];
        }),
        getAllEvents().catch((e) => {
          console.warn("getAllEvents failed:", e);
          return [];
        }),
        getAllCampaigns().catch((e) => {
          console.warn("getAllCampaigns failed:", e);
          return [];
        }),
      ]);

      const adminsArr = extractArray(adminsRes);
      const usersArr = extractArray(usersRes);
      const volunteersArr = extractArray(volunteersRes);
      const eventsArr = extractArray(eventsRes);
      const campaignsArr = extractArray(campaignsRes);

      // Try stats endpoint; if missing fallback to counting lists
      let statsObj = {};
      try {
        const s = await fetchStats();
        statsObj = s?.data || s || {};
      } catch (error) {
        console.error("fetchStats failed:", error);
        // fallback: compute counts from fetched data
        statsObj = {
          volunteers: volunteersArr.length,
          donations: 0,
          events: eventsArr.length,
          campaigns: campaignsArr.length,
          monthlyData: [],
          monthlyUserGrowth: [],
          monthlyAdminGrowth: [],
          totalAdmins: adminsArr.length,
          totalUsers: usersArr.length,
        };
      }

      // normalize monthly arrays if present
      const monthlyData = Array.isArray(statsObj?.monthlyData) ? statsObj.monthlyData : [];
      const monthlyUserGrowth = Array.isArray(statsObj?.monthlyUserGrowth) ? statsObj.monthlyUserGrowth : [];
      const monthlyAdminGrowth = Array.isArray(statsObj?.monthlyAdminGrowth) ? statsObj.monthlyAdminGrowth : [];

      // Finally set state
      setState((prev) => ({
        ...prev,
        admins: adminsArr,
        users: usersArr,
        volunteers: volunteersArr,
        events: eventsArr,
        campaigns: campaignsArr,
        stats: {
          volunteers: Number(statsObj?.volunteers) || volunteersArr.length || 0,
          donations: Number(statsObj?.donations) || 0,
          events: Number(statsObj?.events) || eventsArr.length || 0,
          campaigns: Number(statsObj?.campaigns) || campaignsArr.length || 0,
          monthlyData,
          totalAdmins: Number(statsObj?.totalAdmins) || adminsArr.length,
          totalUsers: Number(statsObj?.totalUsers) || usersArr.length,
          monthlyUserGrowth,
          monthlyAdminGrowth,
        },
        loading: false,
      }));
    } catch (err) {
      console.error("fetchEverything error:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setState((prev) => ({ ...prev, loading: false, error: "Unauthorized. Redirecting to login..." }));
        window.location.href = "/admin/login";
        return;
      }
      setState((prev) => ({ ...prev, loading: false, error: err?.message || "Failed to load data" }));
    }
  }, []);

  useEffect(() => {
    fetchEverything();
    const interval = setInterval(fetchEverything, 30000);
    return () => clearInterval(interval);
  }, [location.pathname, fetchEverything]);

  // Use this state to get the current dark mode status from the body class
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode class on body
    setIsDarkMode(document.body.classList.contains("dark-mode"));
    
    // Set up a mutation observer to detect changes to the body class
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // ================= CHART DATA =================
  const statsChartData = useMemo(() => {
    const s = state.stats;
    const baseData = {
      labels: ["Volunteers", "Donations", "Events", "Campaigns"],
      datasets: [
        {
          label: "Statistics",
          data: [
            Number(s.volunteers) || 0,
            Number(s.donations) || 0,
            Number(s.events) || 0,
            Number(s.campaigns) || 0,
          ],
          backgroundColor: [
            "rgba(75,192,192,0.6)",
            "rgba(54,162,235,0.6)",
            "rgba(255,206,86,0.6)",
            "rgba(153,102,255,0.6)",
            "rgba(255,99,132,0.6)",
          ],
          borderColor: [
            "rgba(75,192,192,1)",
            "rgba(54,162,235,1)",
            "rgba(255,206,86,1)",
            "rgba(153,102,255,1)",
            "rgba(255,99,132,1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    if ((state.chartType === "line" || state.chartType === "bar") && Array.isArray(s.monthlyData) && s.monthlyData.length > 0) {
      return {
        labels: s.monthlyData.map((d) => d.month),
        datasets: [
          { label: "Volunteers", data: s.monthlyData.map((d) => Number(d.volunteers) || 0), backgroundColor: "rgba(75,192,192,0.6)", borderColor: "rgba(75,192,192,1)", borderWidth: 2, tension: 0.4, fill: true },
          { label: "Donations", data: s.monthlyData.map((d) => Number(d.donations) || 0), backgroundColor: "rgba(54,162,235,0.6)", borderColor: "rgba(54,162,235,1)", borderWidth: 2, tension: 0.4, fill: true },
          { label: "Communities", data: s.monthlyData.map((d) => Number(d.communities) || 0), backgroundColor: "rgba(255,206,86,0.6)", borderColor: "rgba(255,206,86,1)", borderWidth: 2, tension: 0.4, fill: true },
          { label: "Events", data: s.monthlyData.map((d) => Number(d.events) || 0), backgroundColor: "rgba(153,102,255,0.6)", borderColor: "rgba(153,102,255,1)", borderWidth: 2, tension: 0.4, fill: true },
          { label: "Campaigns", data: s.monthlyData.map((d) => Number(d.campaigns) || 0), backgroundColor: "rgba(255,99,132,0.6)", borderColor: "rgba(255,99,132,1)", borderWidth: 2, tension: 0.4, fill: true },
        ],
      };
    }

    return baseData;
  }, [state.stats, state.chartType]);

  const userAdminChartData = useMemo(
    () => ({
      labels: ["Admins", "Users"],
      datasets: [
        {
          data: [Number(state.stats.totalAdmins) || state.admins.length || 0, Number(state.stats.totalUsers) || state.users.length || 0],
          backgroundColor: ["rgba(153,102,255,0.6)", "rgba(255,159,64,0.6)"],
          borderColor: ["rgba(153,102,255,1)", "rgba(255,159,64,1)"],
          borderWidth: 1,
          hoverOffset: 20,
        },
      ],
    }),
    [state.stats.totalAdmins, state.stats.totalUsers, state.admins.length, state.users.length]
  );

  const growthChartData = useMemo(
    () => ({
      labels: state.stats.monthlyUserGrowth?.map((d) => d.month) || [],
      datasets: [
        {
          label: "User Growth",
          data: state.stats.monthlyUserGrowth?.map((d) => Number(d.count) || 0) || [],
          backgroundColor: "rgba(54,162,235,0.6)",
          borderColor: "rgba(54,162,235,1)",
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Admin Growth",
          data: state.stats.monthlyAdminGrowth?.map((d) => Number(d.count) || 0) || [],
          backgroundColor: "rgba(255,99,132,0.6)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    }),
    [state.stats.monthlyUserGrowth, state.stats.monthlyAdminGrowth]
  );

  // Chart options (concise)
  const commonChartOptions = useCallback(
    (title) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: isDarkMode ? "#fff" : "#666" } },
        title: { display: true, text: title, color: isDarkMode ? "#fff" : "#333", font: { size: 16 } },
        datalabels: { color: isDarkMode ? "#fff" : "#333", font: { weight: "bold", size: 12 } },
      },
      animation: { duration: 900, easing: "easeInOutQuart" },
      scales: {
        x: {
          ticks: { color: isDarkMode ? "#bbb" : "#666" },
          grid: { color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
        },
        y: {
          ticks: { color: isDarkMode ? "#bbb" : "#666" },
          grid: { color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
        },
      },
    }),
    [isDarkMode]
  );

  // Render helpers
  const renderStatsChart = () => {
    switch (state.chartType) {
      case "bar":
        return <Bar data={statsChartData} options={commonChartOptions("Platform Statistics (Bar)")} />;
      case "line":
        return <Line data={statsChartData} options={commonChartOptions("Platform Statistics (Line)")} />;
      default:
        return <Pie data={statsChartData} options={commonChartOptions("Platform Statistics (Pie)")} />;
    }
  };

  const renderUserAdminChart = () => {
    switch (state.userAdminChartType) {
      case "bar":
        return <Bar data={userAdminChartData} options={commonChartOptions("Admins vs Users (Bar)")} />;
      case "doughnut":
        return <Doughnut data={userAdminChartData} options={commonChartOptions("Admins vs Users (Doughnut)")} />;
      default:
        return <Pie data={userAdminChartData} options={commonChartOptions("Admins vs Users (Pie)")} />;
    }
  };

  const renderGrowthChart = () => {
    switch (state.growthChartType) {
      case "bar":
        return <Bar data={growthChartData} options={commonChartOptions("Monthly Growth (Bar)")} />;
      default:
        return <Line data={growthChartData} options={commonChartOptions("Monthly Growth (Line)")} />;
    }
  };

  // =============== Filtering, Sorting, Pagination =================
  const sortedAdmins = useMemo(() => {
    return [...state.admins].sort((a, b) => {
      const f = state.sortConfig.field;
      const av = (a?.[f] ?? "").toString().toLowerCase();
      const bv = (b?.[f] ?? "").toString().toLowerCase();
      if (av < bv) return state.sortConfig.direction === "asc" ? -1 : 1;
      if (av > bv) return state.sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [state.admins, state.sortConfig]);

  const filteredAdmins = useMemo(() => {
    const q = state.search.toLowerCase();
    return sortedAdmins.filter(
      (a) => (a?.name || "").toLowerCase().includes(q) || (a?.email || "").toLowerCase().includes(q)
    );
  }, [sortedAdmins, state.search]);

  const filteredUsers = useMemo(() => {
    const q = state.search.toLowerCase();
    return state.users.filter(
      (u) => (u?.name || "").toLowerCase().includes(q) || (u?.email || "").toLowerCase().includes(q)
    );
  }, [state.users, state.search]);

  const list = state.activeTab === "admins" ? filteredAdmins : filteredUsers;
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const paginatedData = useMemo(() => {
    const start = (state.page - 1) * perPage;
    return list.slice(start, start + perPage);
  }, [list, state.page]);

  // =============== Actions: edit / delete / undo / bulk =================
  const handleSort = useCallback((field) => {
    setState((prev) => ({
      ...prev,
      sortConfig: {
        field,
        direction: prev.sortConfig.field === field && prev.sortConfig.direction === "asc" ? "desc" : "asc",
      },
    }));
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const isAdminsTab = state.activeTab === "admins";
      const collectionKey = isAdminsTab ? "admins" : "users";
      const itemToDelete = state[collectionKey].find((x) => x.id === id);
      if (!itemToDelete) return;

      setState((prev) => ({
        ...prev,
        undoDelete: { ...itemToDelete, type: collectionKey },
        [collectionKey]: prev[collectionKey].filter((x) => x.id !== id),
        selectedIds: new Set([...prev.selectedIds].filter((x) => x !== id)),
        stats: {
          ...prev.stats,
          totalAdmins: isAdminsTab ? Math.max(0, prev.stats.totalAdmins - 1) : prev.stats.totalAdmins,
          totalUsers: !isAdminsTab ? Math.max(0, prev.stats.totalUsers - 1) : prev.stats.totalUsers,
        },
      }));

      setTimeout(async () => {
        const pending = undoRef.current;
        const tab = activeTabRef.current;
        if (pending?.id === id) {
          try {
            if (tab === "admins") {
              if (typeof deleteAdminProfile === "function") await deleteAdminProfile(id).catch((e) => console.warn("deleteAdminProfile err", e));
            } else {
              if (typeof deleteUserProfile === "function") await deleteUserProfile(id).catch((e) => console.warn("deleteUserProfile err", e));
            }
            showNotification(`${isAdminsTab ? "Admin" : "User"} deleted successfully`);
          } catch (e) {
            console.error("delete API failed:", e);
            showNotification("Failed to delete");
          } finally {
            setState((prev) => ({ ...prev, undoDelete: null }));
          }
        }
      }, 5000);
    },
    [state.activeTab, state.admins, state.users, state.stats, showNotification]
  );

  const undoDeleteAction = useCallback(() => {
    if (!state.undoDelete) return;
    const key = state.undoDelete.type === "admins" ? "admins" : "users";
    setState((prev) => ({
      ...prev,
      [key]: [...prev[key], prev.undoDelete],
      undoDelete: null,
      stats: {
        ...prev.stats,
        totalAdmins: key === "admins" ? prev.stats.totalAdmins + 1 : prev.stats.totalAdmins,
        totalUsers: key === "users" ? prev.stats.totalUsers + 1 : prev.stats.totalUsers,
      },
    }));
    showNotification("Delete action undone");
  }, [state.undoDelete, showNotification]);

  const handleEditClick = useCallback((item) => {
    setState((prev) => ({
      ...prev,
      editingItemId: item.id,
      editData: { id: item.id, name: item.name || "", email: item.email || "", file: null },
    }));
  }, []);

  const handleEditFileChange = useCallback((file) => {
    setState((prev) => ({ ...prev, editData: { ...prev.editData, file } }));
  }, []);

  const handleEditSubmit = useCallback(
    async (id) => {
      try {
        if (state.activeTab === "admins") {
          if (typeof updateAdminProfile === "function")
            await updateAdminProfile({ id: state.editData.id || id, name: state.editData.name, email: state.editData.email });
        } else {
          if (typeof updateUserProfile === "function")
            await updateUserProfile({ id: state.editData.id || id, name: state.editData.name, email: state.editData.email });
        }

        // file upload if present
        if (state.editData.file) {
          try {
            if (state.activeTab === "admins" && typeof uploadAdminProfilePic === "function") {
              await uploadAdminProfilePic(state.editData.file);
            } else if (state.activeTab === "users" && typeof uploadUserProfilePic === "function") {
              await uploadUserProfilePic(state.editData.file);
            }
          } catch (fileErr) {
            console.error("file upload after edit failed:", fileErr);
            setState((prev) => ({ ...prev, error: "Profile updated but file upload failed" }));
          }
        }

        setState((prev) => ({ ...prev, editingItemId: null, editData: { id: null, name: "", email: "", file: null } }));
        showNotification("Profile updated successfully");
        await fetchEverything();
      } catch (err) {
        console.error("update profile error:", err);
        setState((prev) => ({ ...prev, error: err?.message || "Failed to update profile" }));
        showNotification("Failed to update profile");
      }
    },
    [state.activeTab, state.editData, fetchEverything, showNotification]
  );

  const handleBulkSelect = useCallback((id) => {
    setState((prev) => {
      const s = new Set(prev.selectedIds);
      s.has(id) ? s.delete(id) : s.add(id);
      return { ...prev, selectedIds: s };
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setState((prev) => {
      const ids = (prev.activeTab === "admins" ? filteredAdmins : filteredUsers).map((x) => x.id);
      const s = prev.selectedIds.size > 0 && prev.selectedIds.size === ids.length ? new Set() : new Set(ids);
      return { ...prev, selectedIds: s };
    });
  }, [filteredAdmins, filteredUsers, state.activeTab]);

  const handleBulkAction = useCallback(async () => {
    if (!state.bulkAction || state.selectedIds.size === 0) return;
    try {
      if (state.bulkAction === "delete") {
        const isAdminsTab = state.activeTab === "admins";
        const key = isAdminsTab ? "admins" : "users";
        const items = state[key].filter((x) => state.selectedIds.has(x.id));
        setState((prev) => ({
          ...prev,
          [key]: prev[key].filter((x) => !prev.selectedIds.has(x.id)),
          selectedIds: new Set(),
          stats: {
            ...prev.stats,
            totalAdmins: isAdminsTab ? Math.max(0, prev.stats.totalAdmins - items.length) : prev.stats.totalAdmins,
            totalUsers: !isAdminsTab ? Math.max(0, prev.stats.totalUsers - items.length) : prev.stats.totalUsers,
          },
        }));

        // call delete API for each (best-effort)
        if (isAdminsTab) {
          await Promise.all(items.map((it) => (typeof deleteAdminProfile === "function" ? deleteAdminProfile(it.id).catch((e) => console.warn("bulk delete admin failed", e)) : Promise.resolve())));
        } else {
          await Promise.all(items.map((it) => (typeof deleteUserProfile === "function" ? deleteUserProfile(it.id).catch((e) => console.warn("bulk delete user failed", e)) : Promise.resolve())));
        }
        showNotification(`Deleted ${items.length} ${isAdminsTab ? 'admins' : 'users'} successfully`);
      }
    } catch (err) {
      console.error("bulk action failed:", err);
      setState((prev) => ({ ...prev, error: "Bulk operation failed" }));
      showNotification("Bulk operation failed");
      await fetchEverything();
    }
  }, [state.bulkAction, state.selectedIds, state.activeTab, state.admins, state.users, fetchEverything, showNotification]);

  const changeChartType = useCallback((type) => setState((p) => ({ ...p, chartType: type })), []);
  const changeUserAdminChartType = useCallback((type) => setState((p) => ({ ...p, userAdminChartType: type })), []);
  const changeGrowthChartType = useCallback((type) => setState((p) => ({ ...p, growthChartType: type })), []);
  const changeTab = useCallback((tab) => setState((p) => ({ ...p, activeTab: tab, page: 1, selectedIds: new Set() })), []);

  const exportCSV = useCallback(() => {
    const data = state.activeTab === "admins" ? state.admins : state.users;
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = ["Name,Email", ...data.map((item) => `${esc(item.name)},${esc(item.email)}`)];
    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${state.activeTab}.csv`;
    link.click();
    link.remove();
    showNotification(`Exported ${state.activeTab} data successfully`);
  }, [state.admins, state.users, state.activeTab, showNotification]);

  // ================= RENDER =================
  return (
    <div className={`admin-dashboard ${isDarkMode ? "dark" : ""}`} style={{ padding: 20 }}>
      {state.notification && <Notification message={state.notification} onClose={() => setState(prev => ({ ...prev, notification: null }))} />}
      
      <h2 className="admin-dashboard-header">Admin Dashboard</h2>

      <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        <div className="chart-container" style={{ background: isDarkMode ? "#333" : "#fff", padding: 12, borderRadius: 8 }}>
          <div className="chart-wrapper" style={{ height: 260 }}>{renderStatsChart()}</div>
          <div className="chart-controls" style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button className={`chart-btn ${state.chartType === "pie" ? "active" : ""}`} onClick={() => changeChartType("pie")}>Pie</button>
            <button className={`chart-btn ${state.chartType === "bar" ? "active" : ""}`} onClick={() => changeChartType("bar")}>Bar</button>
            <button className={`chart-btn ${state.chartType === "line" ? "active" : ""}`} onClick={() => changeChartType("line")}>Line</button>
          </div>
        </div>

        <div className="chart-container" style={{ background: isDarkMode ? "#333" : "#fff", padding: 12, borderRadius: 8 }}>
          <div className="chart-wrapper" style={{ height: 260 }}>{renderUserAdminChart()}</div>
          <div className="chart-controls" style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button className={`chart-btn ${state.userAdminChartType === "pie" ? "active" : ""}`} onClick={() => changeUserAdminChartType("pie")}>Pie</button>
            <button className={`chart-btn ${state.userAdminChartType === "bar" ? "active" : ""}`} onClick={() => changeUserAdminChartType("bar")}>Bar</button>
            <button className={`chart-btn ${state.userAdminChartType === "doughnut" ? "active" : ""}`} onClick={() => changeUserAdminChartType("doughnut")}>Doughnut</button>
          </div>
          <div className="chart-info" style={{ marginTop: 12 }}>
            <div className="info-item"><span className="info-label" style={{ color: isDarkMode ? "#fff" : "#666" }}>Total Admins:</span> <span className="info-value" style={{ color: isDarkMode ? "#fff" : "#333" }}>{state.stats.totalAdmins}</span></div>
            <div className="info-item"><span className="info-label" style={{ color: isDarkMode ? "#fff" : "#666" }}>Total Users:</span> <span className="info-value" style={{ color: isDarkMode ? "#fff" : "#333" }}>{state.stats.totalUsers}</span></div>
            <div className="info-item"><span className="info-label" style={{ color: isDarkMode ? "#fff" : "#666" }}>Total Volunteers:</span> <span className="info-value" style={{ color: isDarkMode ? "#fff" : "#333" }}>{state.stats.volunteers}</span></div>
          </div>
        </div>

        <div className="chart-container full-width" style={{ gridColumn: "1 / -1", background: isDarkMode ? "#333" : "#fff", padding: 12, borderRadius: 8 }}>
          <div className="chart-wrapper" style={{ height: 280 }}>{renderGrowthChart()}</div>
          <div className="chart-controls" style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button className={`chart-btn ${state.growthChartType === "line" ? "active" : ""}`} onClick={() => changeGrowthChartType("line")}>Line</button>
            <button className={`chart-btn ${state.growthChartType === "bar" ? "active" : ""}`} onClick={() => changeGrowthChartType("bar")}>Bar</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button className={`tab-btn ${state.activeTab === "admins" ? "active" : ""}`} onClick={() => changeTab("admins")}>Admins</button>
        <button className={`tab-btn ${state.activeTab === "users" ? "active" : ""}`} onClick={() => changeTab("users")}>Users</button>
      </div>

      {/* Controls */}
      <div className="control-bar" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        <button className="Ads-refresh-btn" onClick={fetchEverything}>Refresh</button>
        <button className="export-btn" onClick={exportCSV}>Export CSV</button>
        <input type="text" placeholder={`Search ${state.activeTab}...`} value={state.search} onChange={(e) => setState((prev) => ({ ...prev, search: e.target.value, page: 1 }))} />
      </div>

      {/* Bulk actions */}
      {state.selectedIds.size > 0 && (
        <div className="bulk-actions" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <select value={state.bulkAction} onChange={(e) => setState((prev) => ({ ...prev, bulkAction: e.target.value }))}>
            <option value="">Select action</option>
            {state.activeTab === "users" && <option value="delete">Delete selected</option>}
          </select>
          <button onClick={handleBulkAction}>Apply</button>
          <span>{state.selectedIds.size} selected</span>
        </div>
      )}

      {/* Sort */}
      <div className="sort-section" style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={() => handleSort("name")}>Sort by Name {state.sortConfig.field === "name" && (state.sortConfig.direction === "asc" ? "↑" : "↓")}</button>
        <button onClick={() => handleSort("email")}>Sort by Email {state.sortConfig.field === "email" && (state.sortConfig.direction === "asc" ? "↑" : "↓")}</button>
      </div>

      {/* Undo */}
      {state.undoDelete && (
        <div className="undo-alert" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <span>{state.undoDelete.type === "admins" ? "Admin" : "User"} deleted.</span>
          <button onClick={undoDeleteAction}>Undo</button>
        </div>
      )}

      {state.loading && <div className="loading-animation" style={{ marginTop: 12 }}>Loading...</div>}
      {state.error && <p className="error-text" style={{ color: "red", marginTop: 8 }}>{state.error}</p>}

      {/* Data grid */}
      <div className="data-grid" style={{ marginTop: 16 }}>
        {paginatedData.length > 0 ? (
          <>
            <div className="data-item header" style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 220px", gap: 8, alignItems: "center", padding: "8px 4px", borderBottom: "1px solid #eee" }}>
              <input type="checkbox" checked={state.selectedIds.size > 0 && state.selectedIds.size === list.length} onChange={handleSelectAll} />
              <span>Name</span>
              <span>Email</span>
              <span>Actions</span>
            </div>

            {paginatedData.map((item) => (
              <div key={item.id} className={`data-item ${state.selectedIds.has(item.id) ? "selected" : ""}`} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 220px", gap: 8, alignItems: "center", padding: "8px 4px", borderBottom: "1px solid #f5f5f5" }}>
                <input 
                  type="checkbox" 
                  checked={state.selectedIds.has(item.id)} 
                  onChange={() => handleBulkSelect(item.id)} 
                  disabled={state.activeTab === "admins" && item.email !== loggedInEmail}
                />

                {state.editingItemId === item.id ? (
                  <>
                    <input value={state.editData.name} onChange={(e) => setState((prev) => ({ ...prev, editData: { ...prev.editData, name: e.target.value } }))} />
                    <input value={state.editData.email} onChange={(e) => setState((prev) => ({ ...prev, editData: { ...prev.editData, email: e.target.value } }))} />
                    <div className="card-actions" style={{ display: "flex", gap: 6 }}>
                      <label style={{ display: "inline-block" }}>
                        <input type="file" style={{ display: "none" }} onChange={(e) => handleEditFileChange(e.target.files?.[0] || null)} />
                        <button type="button">Choose Picture</button>
                      </label>
                      <button onClick={() => handleEditSubmit(item.id)}>Save</button>
                      <button onClick={() => setState((prev) => ({ ...prev, editingItemId: null, editData: { id: null, name: "", email: "", file: null } }))}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{item.name}</span>
                    <span>{item.email}</span>
                    <div className="card-actions" style={{ display: "flex", gap: 6 }}>
                      {/* Permission-based action buttons */}
                      {state.activeTab === "users" && (
                        <>
                          <button onClick={() => handleEditClick(item)}>Edit</button>
                          <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </>
                      )}
                      {state.activeTab === "admins" && item.email === loggedInEmail && (
                        <button onClick={() => handleEditClick(item)}>Edit</button>
                      )}
                      {state.activeTab === "admins" && item.email !== loggedInEmail && (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>View only</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        ) : (
          !state.loading && <p>No {state.activeTab} found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-bar" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button disabled={state.page === 1} onClick={() => setState((prev) => ({ ...prev, page: 1 }))}>First</button>
        <button disabled={state.page === 1} onClick={() => setState((prev) => ({ ...prev, page: prev.page - 1 }))}>Prev</button>
        <span>Page {state.page} of {totalPages}</span>
        <button disabled={state.page === totalPages} onClick={() => setState((prev) => ({ ...prev, page: prev.page + 1 }))}>Next</button>
        <button disabled={state.page === totalPages} onClick={() => setState((prev) => ({ ...prev, page: totalPages }))}>Last</button>
      </div>

      <div className="total-info" style={{ marginTop: 12 }}>
        Showing {paginatedData.length} of {list.length} {state.activeTab}
      </div>
    </div>
  );
};

export default AdminDashboard;