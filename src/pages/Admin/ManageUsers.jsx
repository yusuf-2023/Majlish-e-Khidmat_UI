import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  blockUser,
} from "../../api/admin/adminUserApi";
import "../../styles/ManageUsers.css";
import Notification from "../../components/Notification";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function ManageUsers({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUserEmail, setEditingUserEmail] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    blocked: false,
  });
  const [undoDeleteUser, setUndoDeleteUser] = useState(null);

  // Notification state: { message: string, type: "success" | "error" }
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setNotification({ message: "Failed to load users.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    const userToDelete = users.find((u) => u.email === email);
    setUndoDeleteUser(userToDelete);
    setUsers(users.filter((u) => u.email !== email));
    setNotification({ message: "User deleted. You can undo this action.", type: "success" });

    setTimeout(async () => {
      if (undoDeleteUser && undoDeleteUser.email === email) {
        try {
          await deleteUser(email);
          setUndoDeleteUser(null);
          setNotification({ message: "User deleted permanently.", type: "success" });
        } catch {
          setNotification({ message: "Failed to delete user.", type: "error" });
          fetchUsers();
        }
      }
    }, 5000);
  };

  const undoDelete = () => {
    if (undoDeleteUser) {
      setUsers((prev) => [...prev, undoDeleteUser]);
      setUndoDeleteUser(null);
      setNotification({ message: "User deletion undone.", type: "success" });
    }
  };

  const handleEditClick = (user) => {
    setEditingUserEmail(user.email);
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      gender: user.gender,
      blocked: user.blocked || false,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await updateUser(editData.email, editData);
      setEditingUserEmail(null);
      fetchUsers();
      setNotification({ message: "User updated successfully.", type: "success" });
    } catch {
      setNotification({ message: "Failed to update user.", type: "error" });
    }
  };

  const handleBlockToggle = async (email, currentStatus) => {
    try {
      await blockUser(email, !currentStatus);
      fetchUsers();
      setNotification({ message: `User ${!currentStatus ? "blocked" : "unblocked"} successfully.`, type: "success" });
    } catch {
      setNotification({ message: "Failed to update block status.", type: "error" });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.blocked).length;
  const blockedUsers = users.filter((u) => u.blocked).length;

  return (
    <div className={`manage-users-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Fixed Header */}
      <header className="mu-header">
        <h2 className="mu-title">Manage Users</h2>
        <div className="mu-controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mu-search"
          />
          <div className="mu-stats">
            <span className="mu-badge">Total: {totalUsers}</span>
            <span className="mu-badge mu-badge-muted">Active: {activeUsers}</span>
            <span className="mu-badge mu-badge-warning">Blocked: {blockedUsers}</span>
          </div>
        </div>
      </header>

      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {undoDeleteUser && (
        <div className="mu-undo">
          <span>User deleted.</span>
          <button className="btn-undo" onClick={undoDelete}>
            Undo
          </button>
        </div>
      )}

      {loading && <p className="mu-msg">Loading users...</p>}

      {/* Scrollable Table Body */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name / Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th className="actions-col"> Actions </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="mu-msg">
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="avatar">
                    {user.profilePic ? (
                      <img
                        src={
                          user.profilePic.startsWith("http")
                            ? user.profilePic
                            : `${BASE_URL}/${user.profilePic}`
                        }
                        alt={user.name}
                        className="profile-pic"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="avatar-initials">
                        {(user.name || "")
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                {editingUserEmail === user.email ? (
                  <>
                    <td colSpan="4">
                      <div className="user-edit">
                        <input
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="input"
                        />
                        <input
                          name="email"
                          value={editData.email}
                          disabled
                          className="input"
                        />
                        <input
                          name="phone"
                          value={editData.phone}
                          onChange={handleEditChange}
                          className="input"
                          placeholder="Phone"
                        />
                        <input
                          name="address"
                          value={editData.address}
                          onChange={handleEditChange}
                          className="input"
                          placeholder="Address"
                        />
                        <input
                          name="dob"
                          type="date"
                          value={editData.dob || ""}
                          onChange={handleEditChange}
                          className="input"
                        />
                        <select
                          name="gender"
                          value={editData.gender}
                          onChange={handleEditChange}
                          className="input"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <label className="input-checkbox">
                          <input
                            type="checkbox"
                            name="blocked"
                            checked={editData.blocked}
                            onChange={handleEditChange}
                          />
                          Blocked
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="edit-actions">
                        <button className="btn-save" onClick={handleEditSubmit}>
                          Save
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setEditingUserEmail(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <div className="name">{user.name}</div>
                      <div className="email">{user.email}</div>
                    </td>
                    <td>{user.phone || "—"}</td>
                    <td>{user.address || "—"}</td>
                    <td>
                      {user.blocked ? (
                        <span className="tag tag-blocked">Blocked</span>
                      ) : (
                        <span className="tag tag-active">Active</span>
                      )}
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          className="action edit-btn"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="action delete-btn"
                          onClick={() => handleDelete(user.email)}
                        >
                          Delete
                        </button>
                        <button
                          className={`action ${
                            user.blocked ? "unblock-btn" : "block-btn"
                          }`}
                          onClick={() => handleBlockToggle(user.email, user.blocked)}
                        >
                          {user.blocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
