import { Activity, Plus, Eye, Pencil, Trash2, ChevronDown, ImagePlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "../styles/health.css";
import "../styles/dashboard.css"; 
import "../styles/animations.css";
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
  lastCheckDate: "",
  category: "Storage Management",
  subCategory: "HDD Health",
  dept: "",
  type: "",
  deviceType: "",
  deviceId: "",
  health: "",
  employeeName: "",
  condition: "Null",
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
  const fileInputRef = useRef(null);
  const [assetImage, setAssetImage] = useState(null);
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
      const monthName = value
        ? new Date(value).toLocaleString("en-US", { month: "long" })
        : formData.month;
      setFormData((prev) => ({ ...prev, pmDate: value, month: monthName }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function saveReport() {
    if (!formData.employeeName.trim() || !formData.deviceId.trim()) {
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
                <div key={item.label} className="health-summary-card stagger-item">
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

              <button className="btn-add-dashboard" onClick={openAddModal}>
                <Plus size={18} />
                Add New Report
              </button>
            </div>
          </div>

          <section className="health-section stagger-item">
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

      {showFormModal && (
        <div
          className="dash-modal-overlay"
          onClick={() => {
            setShowFormModal(false);
            setFormData(emptyForm);
            setAssetImage(null);
          }}
        >
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h2 className="dash-modal-title">Add New Asset</h2>
              <button
                className="dash-modal-close"
                onClick={() => {
                  setShowFormModal(false);
                  setFormData(emptyForm);
                  setAssetImage(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="dash-modal-body">

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Employe Name</label>
                  <input
                    placeholder="..."
                    value={formData.employeeNameName}
                    onChange={(e) =>
                      handleFormChange("employeeName", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Last Check Date</label>
                  <input
                    type="date"
                    value={formData.lastCheckDate}
                    onChange={(e) =>
                      handleFormChange("lastCheckDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Category</label>
                  <input
                    value={formData.category}
                    readOnly
                  />
                </div>

                <div className="dash-form-group">
                  <label>Device ID</label>
                  <input
                    placeholder="..."
                    value={formData.deviceId}
                    onChange={(e)=>
                      handleFormChange("deviceId", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Sub Category</label>
                  <input
                    value={formData.subCategory}
                    readOnly
                  />
                </div>

                <div className="dash-form-group">
                  <label>Device Type</label>
                  <input
                    placeholder="..."
                    value={formData.deviceType}
                    onChange={(e)=>
                      handleFormChange("deviceType", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Department</label>
                  <input
                    placeholder="..."
                    value={formData.department}
                    onChange={(e) =>
                      handleFormChange("department", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Type</label>
                  <input
                    placeholder="..."
                    value={formData.type}
                    onChange={(e) =>
                      handleFormChange("type", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Health (%)</label>
                  <input
                    placeholder="..."
                    value={formData.health}
                    onChange={(e) =>
                      handleFormChange("health", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      handleFormChange("condition", e.target.value)
                    }
                  >
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                    <option value="Very Bad">Very Bad</option>
                    <option value="Null">Very Bad</option>
                  </select>
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group full photo-upload-field">
                  <label>Photo</label>
                  <label className="photo-upload-box">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setAssetImage(URL.createObjectURL(file));
                      }}
                    />
                    {assetImage ? (
                      <img
                        src={assetImage}
                        alt="Preview"
                        className="photo-upload-preview"
                      />
                    ) : (
                      <div className="photo-upload-placeholder">
                        < ImagePlus size={22} />
                        <span>Click to upload</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

            </div>

            <div className="dash-modal-footer">
              <button
                className="dash-btn-cancel"
                onClick={() => {
                  setShowFormModal(false);
                  setFormData(emptyForm);
                  setAssetImage(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="dash-btn-save"
                onClick={saveReport}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PhotoViewModal
        open={!!viewTarget}
        title="Device Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.deviceId}
        onClose={() => setViewTarget(null)}
      />

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
