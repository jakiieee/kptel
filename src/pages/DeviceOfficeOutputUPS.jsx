import { useState, useEffect } from "react";
import { BatteryCharging, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import "../styles/ups.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { upsAssetService, UPS_STATUSES } from "../services/upsAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  capacity: "",
  assignTo: "",
  dept: "",
  pic: "",
  status: "IN USE",
  badge: "good",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function DeviceOfficeOutputUPS() {
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
      const data = await upsAssetService.list();
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
  const isEdit = Boolean(formData.id);

  const totalStock = filtered.length;
  const inUse = filtered.filter((a) => a.status === "IN USE").length;
  const inStore = filtered.filter((a) => a.status === "IN STORE").length;

  function openAdd() {
    setFormData(emptyForm);
    setShowFormModal(true);
  }

  function openEdit(item) {
    setFormData({ ...item });
    setShowFormModal(true);
  }

  function closeForm() {
    setShowFormModal(false);
    setFormData(emptyForm);
  }

  function handleFormChange(field, value) {
    if (field === "status") {
      const statusInfo = UPS_STATUSES.find((s) => s.value === value);
      setFormData((prev) => ({ ...prev, status: value, badge: statusInfo?.badge || "good" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!formData.entityId || !formData.serialNumber) {
      alert("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      if (isEdit) {
        const updated = await upsAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await upsAssetService.create(formData);
        setAssets((prev) => [...prev, created]);
      }
      closeForm();
    } catch (err) {
      alert(err.message || "Failed to save asset.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await upsAssetService.remove(deleteTarget.id);
      setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Failed to delete asset.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        search={search}
        onSearchChange={setSearch}
        placeholder="Search Entity ID or Serial Number..."
      />

      {loading ? (
        <p className="dash-loading-text">Loading assets...</p>
      ) : hasResult ? (
        <>
          <div className="dashboard-top">
            <h1 className="ups-title">UPS</h1>

            <div className="ups-header-actions">
              <div className="ups-summary-grid">
                <div className="ups-summary-card">
                  <div className="ups-summary-bar" style={{ background: "#f5a623" }} />
                  <p className="ups-summary-label">Total Stock</p>
                  <p className="ups-summary-value">{totalStock} Unit</p>
                </div>
                <div className="ups-summary-card">
                  <div className="ups-summary-bar" style={{ background: "#43a047" }} />
                  <p className="ups-summary-label">In Use</p>
                  <p className="ups-summary-value">{inUse} Unit</p>
                </div>
                <div className="ups-summary-card">
                  <div className="ups-summary-bar" style={{ background: "#1e88e5" }} />
                  <p className="ups-summary-label">In Store</p>
                  <p className="ups-summary-value">{inStore} Unit</p>
                </div>
              </div>

              <button className="btn-add" onClick={openAdd}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="ups-section">
            <h2 className="ups-section-title">
              <BatteryCharging size={22} />
              Master Tabel Data UPS
            </h2>

            <div className="ups-table-wrapper">
              <table className="ups-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Capacity</th>
                    <th>Assign To</th>
                    <th>Dept</th>
                    <th>PIC</th>
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
                      <td>{a.assignTo}</td>
                      <td>{a.dept}</td>
                      <td>{a.pic}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="ups-action-group">
                          <button className="btn-view" onClick={() => setViewTarget(a)}>
                            <Eye size={16} />
                          </button>
                          <button className="btn-edit" onClick={() => openEdit(a)}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn-delete" onClick={() => setDeleteTarget(a)}>
                            <Trash2 size={16} />
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

      {/* ADD / EDIT MODAL */}
      {showFormModal && (
        <div className="ups-modal-overlay" onClick={closeForm}>
          <div className="ups-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ups-modal-header">
              <h2 className="ups-modal-title">{isEdit ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="ups-modal-close" onClick={closeForm}>
                ×
              </button>
            </div>

            <div className="ups-modal-body">
              <div className="ups-form-row">
                <div className="ups-form-group">
                  <label>Entity ID</label>
                  <input
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="ups-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="ups-form-group">
                  <label>Capacity</label>
                  <input
                    placeholder="e.g. 1.5 KVA"
                    value={formData.capacity}
                    onChange={(e) => handleFormChange("capacity", e.target.value)}
                  />
                </div>

                <div className="ups-form-group">
                  <label>Assign To</label>
                  <input
                    value={formData.assignTo}
                    onChange={(e) => handleFormChange("assignTo", e.target.value)}
                  />
                </div>

                <div className="ups-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="ups-form-group">
                  <label>PIC</label>
                  <input
                    value={formData.pic}
                    onChange={(e) => handleFormChange("pic", e.target.value)}
                  />
                </div>

                <div className="ups-form-group full">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {UPS_STATUSES.map((s) => (
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

            <div className="ups-modal-footer">
              <button className="ups-btn-cancel" onClick={closeForm}>
                Cancel
              </button>
              <button className="ups-btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="UPS Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete UPS Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
