import { Plus, Eye, Pencil, Trash2, Database, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/ssd.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { ssdAssetService, SSD_YEARS, SSD_STATUSES } from "../services/ssdAssetService";

const yearFilters = ["All Years", ...SSD_YEARS];

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  assignTo: "",
  dept: "",
  pcName: "",
  type: "",
  status: "IN USE",
  badge: "good",
  year: String(new Date().getFullYear()),
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function StorageSSD() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Years");
  const [showStatusDrop, setShowStatusDrop] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAssets() {
      setLoading(true);
      const data = await ssdAssetService.list();
      if (isMounted) {
        setAssets(data);
        setLoading(false);
      }
    }
    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = assets.filter((item) => {
    const matchSearch =
      item.entityId.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchYear = statusFilter === "All Years" || item.year === statusFilter;
    return matchSearch && matchYear;
  });
  const hasResult = filtered.length > 0;

  const summary = [
    { label: "Total Stock", value: filtered.length, color: "#C837FF" },
    {
      label: "In Use",
      value: filtered.filter((i) => i.status === "IN USE").length,
      color: "#43C943",
    },
    {
      label: "In Store",
      value: filtered.filter((i) => i.status === "IN STORE").length,
      color: "#42A5F5",
    },
  ];

  function openAddModal() {
    setFormData(emptyForm);
    setShowFormModal(true);
  }

  function openEditModal(asset) {
    setFormData(asset);
    setShowFormModal(true);
  }

  function handleFormChange(field, value) {
    if (field === "status") {
      const statusInfo = SSD_STATUSES.find((s) => s.value === value);
      setFormData((prev) => ({ ...prev, status: value, badge: statusInfo?.badge || "store" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function saveAsset() {
    if (!formData.entityId.trim() || !formData.serialNumber.trim()) {
      alert("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      if (formData.id) {
        const updated = await ssdAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await ssdAssetService.create(formData);
        setAssets((prev) => [...prev, created]);
      }
      setShowFormModal(false);
    } catch (err) {
      alert(err.message || "Failed to save asset.");
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await ssdAssetService.remove(deleteTarget.id);
      setAssets((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Failed to delete asset.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Entity ID..." />

      {loading ? (
        <p className="dash-loading-text">Loading assets...</p>
      ) : hasResult ? (
        <>
          <div className="dashboard-top">
            <h1 className="ssd-title">SSD Inventory</h1>

            <div className="ssd-summary-grid">
              {summary.map((item) => (
                <div key={item.label} className="ssd-summary-card">
                  <div className="ssd-summary-bar" style={{ background: item.color }} />
                  <p className="ssd-summary-label">{item.label}</p>
                  <p className="ssd-summary-value">{item.value} Unit</p>
                </div>
              ))}
            </div>

            <div className="ssd-header-actions">
              <div className="ssd-filter-wrap">
                <button
                  className="ssd-filter-btn"
                  onClick={() => setShowStatusDrop(!showStatusDrop)}
                >
                  {statusFilter}
                  <ChevronDown size={16} />
                </button>

                {showStatusDrop && (
                  <div className="ssd-filter-drop">
                    {yearFilters.map((status) => (
                      <div
                        key={status}
                        className={`ssd-filter-option ${statusFilter === status ? "active" : ""}`}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusDrop(false);
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn-add" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="ssd-section">
            <h2 className="ssd-section-title">
              <Database size={22} />
              Master Table Data SSD
            </h2>
            <div className="ssd-table-wrapper">
              <table className="ssd-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Assign To</th>
                    <th>Dept</th>
                    <th>PC Name</th>
                    <th>Type & Capacity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.entityId}</td>
                      <td>{item.serialNumber}</td>
                      <td>{item.assignTo}</td>
                      <td>{item.dept}</td>
                      <td>{item.pcName}</td>
                      <td>{item.type}</td>
                      <td>
                        <span className={badgeClass(item.badge)}>{item.status}</span>
                      </td>
                      <td>
                        <div className="ssd-action-group">
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
        <div className="ssd-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="ssd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ssd-modal-header">
              <h2 className="ssd-modal-title">{formData.id ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="ssd-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="ssd-modal-body">
              <div className="ssd-form-row">
                <div className="ssd-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. SSD-SITE-23005"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="ssd-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="ssd-form-group">
                  <label>Assign To</label>
                  <input
                    value={formData.assignTo}
                    onChange={(e) => handleFormChange("assignTo", e.target.value)}
                  />
                </div>

                <div className="ssd-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="ssd-form-group">
                  <label>PC Name</label>
                  <input
                    value={formData.pcName}
                    onChange={(e) => handleFormChange("pcName", e.target.value)}
                  />
                </div>

                <div className="ssd-form-group">
                  <label>Type & Capacity</label>
                  <input
                    placeholder="e.g. SSD 2.5 (250GB)"
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                  />
                </div>

                <div className="ssd-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {SSD_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ssd-form-group">
                  <label>Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleFormChange("year", e.target.value)}
                  >
                    {SSD_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
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

            <div className="ssd-modal-footer">
              <button
                className="ssd-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="ssd-btn-save" onClick={saveAsset} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="SSD Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete SSD Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
