import React, { useState } from "react";
import "../styles/admin.css";
import "../styles/animations.css";
import {
  Pencil,
  AlertTriangle,
  UserSquare2,
  Search,
  UserMinus,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const INITIAL_PENDING_REQUESTS = [
  {
    id: 1,
    name: "Anisa Novita Sari",
    department: "MSD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-059",
  },
  {
    id: 2,
    name: "Harun Alrasyid",
    department: "SFD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-74",
  },
  {
    id: 3,
    name: "Mulyono",
    department: "MQD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-112",
  },
  {
    id: 4,
    name: "Atika",
    department: "CWD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-275",
  },
];

const INITIAL_USERS = [
  {
    id: 1,
    name: "Anisa Novita Sari",
    department: "MSD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-059",
    status: "ADMIN",
  },
  {
    id: 2,
    name: "Harun Alrasyid",
    department: "SFD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-74",
    status: "ADMIN",
  },
  {
    id: 3,
    name: "Mulyono",
    department: "MQD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-112",
    status: "GUEST",
  },
  {
    id: 4,
    name: "Atika",
    department: "CWD",
    email: "usercobaa01@telpp.com",
    employeeId: "EMP-275",
    status: "ADMIN",
  },
];

const EMPTY_FORM = {
  fullName: "",
  department: "",
  employeeId: "",
  email: "",
  password: "",
};

export default function UserAccessManagement() {
  const { user: loggedInUser } = useAuth();
  const currentUser = loggedInUser || { name: "Guest", email: "" };

  const [pendingRequests, setPendingRequests] = useState(
    INITIAL_PENDING_REQUESTS
  );
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalAdmin = users.filter((u) => u.status === "ADMIN").length;
  const pendingCount = pendingRequests.length;
  // TODO: BACKEND - ganti dengan total user terdaftar dari endpoint GET /admin/users/count
  const totalRegistered = users.length + pendingRequests.length;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleApprove(id) {
    const approvedUser = pendingRequests.find((req) => req.id === id);
    if (!approvedUser) return;
    setUsers((prev) => [
      ...prev,
      {
        ...approvedUser,
        status: "GUEST",
      },
    ]);
    setPendingRequests((prev) =>
      prev.filter((req) => req.id !== id)
    );
  }

  function handleReject(id) {
    // TODO: BACKEND - panggil endpoint POST /admin/requests/:id/reject
    setPendingRequests((prev) => prev.filter((req) => req.id !== id));
  }

  function requestRemoveUser(user) {
    setDeleteTarget(user);
  }

  async function confirmRemoveUser() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    // TODO: BACKEND - panggil endpoint DELETE /admin/users/:id sebelum update state lokal
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setIsDeleting(false);
    setDeleteTarget(null);
  }

  function openEditModal(user) {
    setEditingUserId(user.id);
    setForm({
      fullName: user.name,
      department: user.department,
      employeeId: user.employeeId,
      email: user.email,
      password: "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUserId(null);
    setForm(EMPTY_FORM);
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveChanges() {
    // TODO: BACKEND - panggil endpoint PATCH /admin/users/:id dengan payload form ini
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUserId
          ? {
              ...u,
              name: form.fullName || u.name,
              department: form.department || u.department,
              employeeId: form.employeeId || u.employeeId,
              email: form.email || u.email,
            }
          : u
      )
    );
    closeModal();
  }

  return (
    <div className="uam-page">
  
      <header className="uam-header">
        <h1 className="uam-title">User Access Management</h1>
      </header>
      <div className="uam-header-rule" />

      <section className="uam-profile-row">
        <div className="uam-profile">
          <div className="uam-avatar">
            <svg
              viewBox="0 0 24 24"
              fill="#aaa"
              width="40"
              height="40"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div className="uam-profile-info">
            <p className="uam-profile-name">{currentUser.name}</p>
            <p className="uam-profile-email">{currentUser.email}</p>
          </div>
        </div>

        <div className="uam-stat-card uam-stat-card--admin stagger-item">
          <p className="uam-stat-label">Total Admin</p>
          <p className="uam-stat-value">{totalAdmin} User</p>
        </div>

        <div className="uam-stat-card uam-stat-card--pending stagger-item">
          <p className="uam-stat-label">Pending Requests</p>
          <p className="uam-stat-value">{pendingCount} User</p>
        </div>

        <div className="uam-stat-card uam-stat-card--registered stagger-item">
          <p className="uam-stat-label">Total Registered Users</p>
          <p className="uam-stat-value">{totalRegistered} User</p>
        </div>
      </section>

      <section className="uam-panel stagger-item">
        <h2 className="uam-panel-title">
          <AlertTriangle size={20} className="uam-icon uam-icon--warning" />
          Pending Admin Request
        </h2>

        <div className="uam-table-wrap">
          <table className="uam-table">
            <thead>
              <tr>
                <th className="uam-col-no">No</th>
                <th>Name</th>
                <th>Departement</th>
                <th>Email</th>
                <th>Employe ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="uam-empty-row">
                    No pending requests.
                  </td>
                </tr>
              ) : (
                pendingRequests.map((req, idx) => (
                  <tr key={req.id}>
                    <td className="uam-col-no">{idx + 1}.</td>
                    <td>{req.name}</td>
                    <td>{req.department}</td>
                    <td>{req.email}</td>
                    <td>{req.employeeId}</td>
                    <td>
                      <div className="uam-action-buttons">
                        <button
                          type="button"
                          className="uam-btn uam-btn--approve"
                          onClick={() => handleApprove(req.id)}
                        >
                          APPROVE
                        </button>
                        <button
                          type="button"
                          className="uam-btn uam-btn--reject"
                          onClick={() => handleReject(req.id)}
                        >
                          REJECT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="uam-panel stagger-item">
        <div className="uam-panel-header-row">
          <h2 className="uam-panel-title">
            <UserSquare2 size={20} className="uam-icon uam-icon--user" />
            Full Data Admin &amp; Users
          </h2>

          <div className="uam-search">
            <input
              type="text"
              placeholder="Search Name...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="uam-search-icon" />
          </div>
        </div>

        <div className="uam-table-wrap">
          <table className="uam-table">
            <thead>
              <tr>
                <th className="uam-col-no">No</th>
                <th>Name</th>
                <th>Dapartement</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="uam-empty-row">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id}>
                    <td className="uam-col-no">{idx + 1}.</td>
                    <td>{user.name}</td>
                    <td>{user.department}</td>
                    <td>{user.email}</td>
                    <td>{user.employeeId}</td>
                    <td>
                      <span
                        className={`uam-status-badge ${
                          user.status === "ADMIN"
                            ? "uam-status-badge--admin"
                            : "uam-status-badge--guest"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="uam-action-buttons">
                        <button
                          type="button"
                          className="uam-icon-btn uam-icon-btn--edit"
                          onClick={() => openEditModal(user)}
                          aria-label={`Edit ${user.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="uam-icon-btn uam-icon-btn--remove"
                          onClick={() => requestRemoveUser(user)}
                          aria-label={`Remove ${user.name}`}
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="uam-modal-overlay" onClick={closeModal}>
          <div
            className="uam-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="uam-modal-title"
          >
            <button
              type="button"
              className="uam-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 id="uam-modal-title" className="uam-modal-title">
              Edit Users Credentials
            </h2>

            <div className="uam-modal-grid">
              <div className="uam-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    handleFormChange("fullName", e.target.value)
                  }
                />
              </div>

              <div className="uam-field">
                <label htmlFor="department">Dapartement</label>
                <input
                  id="department"
                  type="text"
                  value={form.department}
                  onChange={(e) =>
                    handleFormChange("department", e.target.value)
                  }
                />
              </div>

              <div className="uam-field">
                <label htmlFor="employeeId">Employe ID</label>
                <input
                  id="employeeId"
                  type="text"
                  value={form.employeeId}
                  onChange={(e) =>
                    handleFormChange("employeeId", e.target.value)
                  }
                />
              </div>

              <div className="uam-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </div>

              <div className="uam-field">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    handleFormChange("password", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="uam-modal-actions">
              <button
                type="button"
                className="uam-btn uam-btn--cancel"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="uam-btn uam-btn--save"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Remove User"
        description="Are you sure you want to remove user"
        itemLabel={deleteTarget ? `${deleteTarget.name}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmRemoveUser}
        isDeleting={isDeleting}
      />
    </div>
  );
}
