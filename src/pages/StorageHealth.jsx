import { Activity, Plus, Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/health.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import {
  healthReportService,
  HEALTH_MONTHS,
  HEALTH_STATUSES,
} from "../services/healthReportService";

const emptyForm = {
  id: null,
  employee: "",
  dept: "",
  pmDate: "",
  month: "January",
  deviceId: "",
  deviceType: "",
  health: "",
  type: "2'5",
  status: "GOOD",
  badge: "warning",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-warning";
}

export default function StorageHealth() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("All Month");
  const [showMonthDrop, setShowMonthDrop] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      setLoading(true);
      const data = await healthReportService.list();
      if (isMounted) {
        setReports(data);
        setLoading(false);
      }
    }
    loadReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = reports.filter((item) => {
    const matchSearch =
      item.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      item.employee.toLowerCase().includes(search.toLowerCase());
    const matchMonth = month === "All Month" || item.month === month;
    return matchSearch && matchMonth;
  });
  const hasResult = filtered.length > 0;

  const summary = [
    {
      label: "Healthy Device",
      value: filtered.filter((i) => i.status === "VERY GOOD").length,
      color: "#56d241",
    },
    {
      label: "Warning",
      value: filtered.filter((i) => i.status === "GOOD").length,
      color: "#ffe100",
    },
    {
      label: "Critical",
      value: filtered.filter((i) => i.status === "VERY BAD").length,
      color: "#e53935",
    },
  ];

  function openAddModal() {
    setFormData(emptyForm);
    setShowFormModal(true);
  }

  function openEditModal(report) {
    setFormData(report);
    setShowFormModal(true);
  }

  function handleFormChange(field, value) {
    if (field === "status") {
      const statusInfo = HEALTH_STATUSES.find((s) => s.value === value);
      setFormData((prev) => ({ ...prev, status: value, badge: statusInfo?.badge || "warning" }));
      return;
    }
    if (field === "pmDate") {
      // Sinkronkan otomatis nama bulan dari tanggal yang dipilih
      const monthName = value
        ? new Date(value).toLocaleString("en-US", { month: "long" })
        : formData.month;
      setFormData((prev) => ({ ...prev, pmDate: value, month: monthName }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function saveReport() {
    if (!formData.employee.trim() || !formData.deviceId.trim()) {
      alert("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      if (formData.id) {
        const updated = await healthReportService.update(formData.id, formData);
        setReports((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await healthReportService.create(formData);
        setReports((prev) => [...prev, created]);
      }
      setShowFormModal(false);
    } catch (err) {
      alert(err.message || "Failed to save report.");
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await healthReportService.remove(deleteTarget.id);
      setReports((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Failed to delete report.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Entity ID..." />

      {loading ? (
        <p className="dash-loading-text">Loading reports...</p>
      ) : hasResult ? (
        <>
          <div className="dashboard-top">
            <h1 className="health-title">HDD Health PM 2023</h1>

            <div className="health-summary-grid">
              {summary.map((item) => (
                <div key={item.label} className="health-summary-card">
                  <div className="health-summary-bar" style={{ background: item.color }} />
                  <p className="health-summary-label">{item.label}</p>
                  <p className="health-summary-value">{item.value} Unit</p>
                </div>
              ))}
            </div>

            <div className="health-header-actions">
              <div className="health-filter-wrap">
                <button
                  className="health-filter-btn"
                  onClick={() => setShowMonthDrop(!showMonthDrop)}
                >
                  {month}
                  <ChevronDown size={16} />
                </button>

                {showMonthDrop && (
                  <div className="health-filter-drop">
                    {HEALTH_MONTHS.map((item) => (
                      <div
                        key={item}
                        className={`health-filter-option ${month === item ? "active" : ""}`}
                        onClick={() => {
                          setMonth(item);
                          setShowMonthDrop(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn-add" onClick={openAddModal}>
                <Plus size={18} />
                Add New Report
              </button>
            </div>
          </div>

          <section className="health-section">
            <h2 className="health-section-title">
              <Activity size={22} />
              Master Table Data HDD Health
            </h2>
            <div className="health-table-wrapper">
              <table className="health-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Employee</th>
                    <th>Dept</th>
                    <th>PM Date</th>
                    <th>Device ID</th>
                    <th>Device Type</th>
                    <th>Health</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.employee}</td>
                      <td>{item.dept}</td>
                      <td>{item.pmDate}</td>
                      <td>{item.deviceId}</td>
                      <td>{item.deviceType}</td>
                      <td>{item.health}</td>
                      <td>{item.type}</td>
                      <td>
                        <span className={badgeClass(item.badge)}>{item.status}</span>
                      </td>
                      <td>
                        <div className="health-action-group">
                          <button className="btn-view" onClick={() => setViewTarget(item)}>
                            <Eye size={18} />
                          </button>
                          <button className="btn-edit" onClick={() => openEditModal(item)}>
                            <Pencil size={18} />
                          </button>
                          <button className="btn-delete" onClick={() => setDeleteTarget(item)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <NotFoundState />
      )}

      {/* MODAL: Add / Edit */}
      {showFormModal && (
        <div className="health-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="health-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="health-modal-header">
              <h2 className="health-modal-title">
                {formData.id ? "Edit Report" : "Add New Report"}
              </h2>
              <button className="health-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="health-modal-body">
              <div className="health-form-row">
                <div className="health-form-group">
                  <label>Employee</label>
                  <input
                    value={formData.employee}
                    onChange={(e) => handleFormChange("employee", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>PM Date</label>
                  <input
                    type="date"
                    value={formData.pmDate}
                    onChange={(e) => handleFormChange("pmDate", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>Device ID</label>
                  <input
                    placeholder="e.g. TEL-PC-17020"
                    value={formData.deviceId}
                    onChange={(e) => handleFormChange("deviceId", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>Device Type</label>
                  <input
                    placeholder="e.g. PC 7040"
                    value={formData.deviceType}
                    onChange={(e) => handleFormChange("deviceType", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>Health (%)</label>
                  <input
                    placeholder="e.g. 92%"
                    value={formData.health}
                    onChange={(e) => handleFormChange("health", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>Type</label>
                  <input
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                  />
                </div>

                <div className="health-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {HEALTH_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.value}
                      </option>
                    ))}
                  </select>
                </div>

                <PhotoUploadField
                  value={formData.photo}
                  onChange={(value) => handleFormChange("photo", value)}
                />
              </div>
            </div>

            <div className="health-modal-footer">
              <button
                className="health-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="health-btn-save" onClick={saveReport} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="Device Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.deviceId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Health Report"
        description="Are you sure you want to delete report for"
        itemLabel={deleteTarget ? `${deleteTarget.deviceId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
