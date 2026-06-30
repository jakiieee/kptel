import { useState, useEffect } from "react";
import { BatteryCharging, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import "../styles/battery.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { batteryAssetService, BATTERY_STATUSES } from "../services/batteryAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  capacity: "",
  location: "",
  dept: "",
  pcName: "",
  status: "IN STORE",
  badge: "store",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function HardwareBattery() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      const data = await batteryAssetService.list();
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

  const filtered = assets.filter(
    (a) =>
      a.entityId.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase())
  );
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
      const statusInfo = BATTERY_STATUSES.find((s) => s.value === value);
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
        const updated = await batteryAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await batteryAssetService.create(formData);
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
      await batteryAssetService.remove(deleteTarget.id);
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
          <div className="bat-topbar">
            <h1 className="bat-title">Battery NB Inventory</h1>

            <div className="bat-topbar-right">
              <div className="bat-summary-card bat-summary-purple">
                <span className="bat-summary-label">Total Stock</span>
                <span className="bat-summary-value">{totalStock} Unit</span>
              </div>
              <div className="bat-summary-card bat-summary-green">
                <span className="bat-summary-label">In Use</span>
                <span className="bat-summary-value">{inUse} Unit</span>
              </div>
              <div className="bat-summary-card bat-summary-blue">
                <span className="bat-summary-label">In Store</span>
                <span className="bat-summary-value">{inStore} Unit</span>
              </div>

              <button className="btn-add" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="bat-section">
            <h2 className="bat-section-title">
              <BatteryCharging size={22} />
              Master Tabel Data Battery NB
            </h2>

            <div className="battery-table-wrapper">
              <table className="bat-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Dept</th>
                    <th>PC Name</th>
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
                      <td>{a.capacity}</td>
                      <td>{a.location}</td>
                      <td>{a.dept}</td>
                      <td>{a.pcName}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="bat-action-group">
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
        <div className="bat-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="bat-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="bat-modal-header">
              <h2 className="bat-modal-title">{formData.id ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="bat-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="bat-modal-body">
              <div className="bat-form-row">
                <div className="bat-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. Batre-Site-24001"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="bat-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="bat-form-group">
                  <label>Capacity</label>
                  <input
                    placeholder="e.g. 60Wh"
                    value={formData.capacity}
                    onChange={(e) => handleFormChange("capacity", e.target.value)}
                  />
                </div>

                <div className="bat-form-group">
                  <label>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                  />
                </div>

                <div className="bat-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="bat-form-group">
                  <label>PC Name</label>
                  <input
                    value={formData.pcName}
                    onChange={(e) => handleFormChange("pcName", e.target.value)}
                  />
                </div>

                <div className="bat-form-group full">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {BATTERY_STATUSES.map((s) => (
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

            <div className="bat-modal-footer">
              <button
                className="bat-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="bat-btn-save" onClick={saveAsset} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="Battery Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Battery Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
