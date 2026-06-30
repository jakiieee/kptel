import { useState, useEffect } from "react";
import { Router, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import "../styles/fortiswitch.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import {
  fortiSwitchAssetService,
  FORTISWITCH_MANUFACTURERS,
  FORTISWITCH_STATUSES,
} from "../services/fortiSwitchAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  manufactur: "",
  location: "",
  type: "FortiSwitch",
  status: "IN STORE",
  badge: "store",
  size: "",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function NetworkFortiSwitch() {
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
      const data = await fortiSwitchAssetService.list();
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
      const statusInfo = FORTISWITCH_STATUSES.find((s) => s.value === value);
      setFormData((prev) => ({ ...prev, status: value, badge: statusInfo?.badge || "store" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!formData.entityId || !formData.serialNumber || !formData.manufactur) {
      alert("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      if (isEdit) {
        const updated = await fortiSwitchAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await fortiSwitchAssetService.create(formData);
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
      await fortiSwitchAssetService.remove(deleteTarget.id);
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
          <div className="fts-topbar">
            <h1 className="fts-title">FortiSwitch / MSW</h1>

            <div className="fts-topbar-right">
              <div className="fts-summary-card fts-summary-purple">
                <span className="fts-summary-label">Total Stock</span>
                <span className="fts-summary-value">{totalStock} Unit</span>
              </div>
              <div className="fts-summary-card fts-summary-green">
                <span className="fts-summary-label">In Use</span>
                <span className="fts-summary-value">{inUse} Unit</span>
              </div>
              <div className="fts-summary-card fts-summary-blue">
                <span className="fts-summary-label">In Store</span>
                <span className="fts-summary-value">{inStore} Unit</span>
              </div>

              <button className="btn-add" onClick={openAdd}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="fts-section">
            <h2 className="fts-section-title">
              <Router size={22} />
              Master Tabel Data FortiSwitch
            </h2>

            <div className="fts-table-wrapper">
              <table className="fts-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Manufactur</th>
                    <th>Location</th>
                    <th>Type</th>
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
                      <td>{a.manufactur}</td>
                      <td>{a.location}</td>
                      <td>{a.type}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="fts-action-group">
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
        <div className="fts-modal-overlay" onClick={closeForm}>
          <div className="fts-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="fts-modal-header">
              <h2 className="fts-modal-title">{isEdit ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="fts-modal-close" onClick={closeForm}>
                ×
              </button>
            </div>

            <div className="fts-modal-body">
              <div className="fts-form-row">
                <div className="fts-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. MSW-SITE-25001"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="fts-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="fts-form-group">
                  <label>Manufactur</label>
                  <select
                    value={formData.manufactur}
                    onChange={(e) => handleFormChange("manufactur", e.target.value)}
                  >
                    <option value="">Select Manufactur</option>
                    {FORTISWITCH_MANUFACTURERS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fts-form-group">
                  <label>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                  />
                </div>

                <div className="fts-form-group">
                  <label>Type</label>
                  <input
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                  />
                </div>

                <div className="fts-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {FORTISWITCH_STATUSES.map((s) => (
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

            <div className="fts-modal-footer">
              <button className="fts-btn-cancel" onClick={closeForm}>
                Cancel
              </button>
              <button className="fts-btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="FortiSwitch Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete FortiSwitch Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
