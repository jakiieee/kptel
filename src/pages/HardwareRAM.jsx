import { useState, useEffect } from "react";
import { MemoryStick, Plus, Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import "../styles/ram.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { ramAssetService, RAM_YEARS, RAM_STATUSES } from "../services/ramAssetService";

const yearFilters = ["All Years", ...RAM_YEARS];

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  type: "longdim",
  size: "",
  type2: "",
  speed: "",
  brand: "",
  assignTo: "",
  dept: "",
  entityPc: "",
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

export default function HardwareRAM() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [showYearDrop, setShowYearDrop] = useState(false);

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
      const data = await ramAssetService.list();
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

  const filtered = assets.filter((a) => {
    const matchSearch =
      a.entityId.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === "All Years" || a.year === yearFilter;
    return matchSearch && matchYear;
  });
  const hasResult = filtered.length > 0;

  const totalStock = filtered.length;
  const inUse = filtered.filter((a) => a.status === "IN USE").length;
  const inStore = filtered.filter((a) => a.status === "IN STORE").length;

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
      const statusInfo = RAM_STATUSES.find((s) => s.value === value);
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
        const updated = await ramAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await ramAssetService.create(formData);
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
      await ramAssetService.remove(deleteTarget.id);
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
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Entity ID...." />

      {loading ? (
        <p className="dash-loading-text">Loading assets...</p>
      ) : hasResult ? (
        <>
          <div className="ram-topbar">
            <h1 className="ram-title">RAM Inventory</h1>

            <div className="ram-topbar-right">
              <div className="ram-summary-card ram-summary-yellow">
                <span className="ram-summary-label">Total Stock</span>
                <span className="ram-summary-value">{totalStock} Unit</span>
              </div>
              <div className="ram-summary-card ram-summary-green">
                <span className="ram-summary-label">In Use</span>
                <span className="ram-summary-value">{inUse} Unit</span>
              </div>
              <div className="ram-summary-card ram-summary-blue">
                <span className="ram-summary-label">In Store</span>
                <span className="ram-summary-value">{inStore} Unit</span>
              </div>

              <div className="ram-year-wrap">
                <button
                  className="ram-year-btn"
                  onClick={() => setShowYearDrop(!showYearDrop)}
                >
                  {yearFilter}
                  <ChevronDown size={16} />
                </button>
                {showYearDrop && (
                  <div className="ram-year-drop">
                    {yearFilters.map((y) => (
                      <div
                        key={y}
                        className={`ram-year-option ${yearFilter === y ? "active" : ""}`}
                        onClick={() => {
                          setYearFilter(y);
                          setShowYearDrop(false);
                        }}
                      >
                        {y}
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

          <section className="ram-section">
            <h2 className="ram-section-title">
              <MemoryStick size={22} />
              Master Tabel Data RAM
            </h2>

            <div className="ram-table-wrapper">
              <table className="ram-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Type 2</th>
                    <th>Speed</th>
                    <th>Brand</th>
                    <th>Assign To</th>
                    <th>Dept</th>
                    <th>Entity PC</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}.</td>
                      <td>{a.entityId}</td>
                      <td>{a.serialNumber}</td>
                      <td>{a.type}</td>
                      <td>{a.size}</td>
                      <td>{a.type2}</td>
                      <td>{a.speed}</td>
                      <td>{a.brand}</td>
                      <td>{a.assignTo}</td>
                      <td>{a.dept}</td>
                      <td>{a.entityPc}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="ram-action-group">
                          <button className="btn-view" onClick={() => setViewTarget(a)} title="View">
                            <Eye size={18} />
                          </button>
                          <button className="btn-edit" onClick={() => openEditModal(a)} title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteTarget(a)}
                            title="Delete"
                          >
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
        <div className="ram-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="ram-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ram-modal-header">
              <h2 className="ram-modal-title">{formData.id ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="ram-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="ram-modal-body">
              <div className="ram-form-row">
                <div className="ram-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. SSD-SITE-23001"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Serial Number</label>
                  <input
                    placeholder="e.g. RAM-SITE-25011"
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Size</label>
                  <input
                    placeholder="e.g. 8GB"
                    value={formData.size}
                    onChange={(e) => handleFormChange("size", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Type</label>
                  <input
                    placeholder="e.g. DDR4"
                    value={formData.type2}
                    onChange={(e) => handleFormChange("type2", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Speed</label>
                  <input
                    placeholder="e.g. 3200Mhz"
                    value={formData.speed}
                    onChange={(e) => handleFormChange("speed", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Brand</label>
                  <input
                    placeholder="e.g. Kingston"
                    value={formData.brand}
                    onChange={(e) => handleFormChange("brand", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Assign To</label>
                  <input
                    value={formData.assignTo}
                    onChange={(e) => handleFormChange("assignTo", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Entity PC</label>
                  <input
                    value={formData.entityPc}
                    onChange={(e) => handleFormChange("entityPc", e.target.value)}
                  />
                </div>

                <div className="ram-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {RAM_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ram-form-group">
                  <label>Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleFormChange("year", e.target.value)}
                  >
                    {RAM_YEARS.map((y) => (
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

            <div className="ram-modal-footer">
              <button
                className="ram-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="ram-btn-save" onClick={saveAsset} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="RAM Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete RAM Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
