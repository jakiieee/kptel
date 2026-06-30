import { useState, useEffect } from "react";
import { Cast as CastIcon, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import "../styles/cast.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { castAssetService, CAST_STATUSES } from "../services/castAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  assignTo: "",
  dept: "",
  entity: "",
  status: "IN STORE",
  badge: "store",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function DeviceOfficeOutputCast() {
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
      const data = await castAssetService.list();
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
      const statusInfo = CAST_STATUSES.find((s) => s.value === value);
      setFormData((prev) => ({ ...prev, status: value, badge: statusInfo?.badge || "store" }));
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
        const updated = await castAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await castAssetService.create(formData);
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
      await castAssetService.remove(deleteTarget.id);
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
            <h1 className="cast-title">Cast Device</h1>

            <div className="cast-header-actions">
              <div className="cast-summary-grid">
                <div className="cast-summary-card">
                  <div className="cast-summary-bar" style={{ background: "#f5a623" }} />
                  <p className="cast-summary-label">Total Stock</p>
                  <p className="cast-summary-value">{totalStock} Unit</p>
                </div>
                <div className="cast-summary-card">
                  <div className="cast-summary-bar" style={{ background: "#43a047" }} />
                  <p className="cast-summary-label">In Use</p>
                  <p className="cast-summary-value">{inUse} Unit</p>
                </div>
                <div className="cast-summary-card">
                  <div className="cast-summary-bar" style={{ background: "#1e88e5" }} />
                  <p className="cast-summary-label">In Store</p>
                  <p className="cast-summary-value">{inStore} Unit</p>
                </div>
              </div>

              <button className="btn-add" onClick={openAdd}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="cast-section">
            <h2 className="cast-section-title">
              <CastIcon size={22} />
              Master Tabel Data Cast Device
            </h2>

            <div className="cast-table-wrapper">
              <table className="cast-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Assign To</th>
                    <th>Dept</th>
                    <th>Entity</th>
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
                      <td>{a.assignTo}</td>
                      <td>{a.dept}</td>
                      <td>{a.entity}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="cast-action-group">
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
        <div className="cast-modal-overlay" onClick={closeForm}>
          <div className="cast-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cast-modal-header">
              <h2 className="cast-modal-title">{isEdit ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="cast-modal-close" onClick={closeForm}>
                ×
              </button>
            </div>

            <div className="cast-modal-body">
              <div className="cast-form-row">
                <div className="cast-form-group">
                  <label>Entity ID</label>
                  <input
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="cast-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="cast-form-group">
                  <label>Assign To</label>
                  <input
                    value={formData.assignTo}
                    onChange={(e) => handleFormChange("assignTo", e.target.value)}
                  />
                </div>

                <div className="cast-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="cast-form-group">
                  <label>Entity</label>
                  <input
                    value={formData.entity}
                    onChange={(e) => handleFormChange("entity", e.target.value)}
                  />
                </div>

                <div className="cast-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {CAST_STATUSES.map((s) => (
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

            <div className="cast-modal-footer">
              <button className="cast-btn-cancel" onClick={closeForm}>
                Cancel
              </button>
              <button className="cast-btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="Cast Device Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Cast Device Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
