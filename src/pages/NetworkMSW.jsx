import { useState, useEffect } from "react";
import { Mouse as MouseIcon, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import "../styles/msw.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { mswAssetService, MSW_MANUFACTURERS } from "../services/mswAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  manufactur: "",
  location: "",
  assignTo: "",
  username: "",
  photo: "",
};

export default function NetworkMSW() {
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
      const data = await mswAssetService.list();
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
        const updated = await mswAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await mswAssetService.create(formData);
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
      await mswAssetService.remove(deleteTarget.id);
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
          <div className="msw-topbar">
            <h1 className="msw-title">Mouse Wireless (MSW)</h1>

            <div className="msw-topbar-right">
              <div className="msw-summary-card msw-summary-purple">
                <span className="msw-summary-label">Total Stock</span>
                <span className="msw-summary-value">{totalStock} Unit</span>
              </div>

              <button className="btn-add" onClick={openAdd}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="msw-section">
            <h2 className="msw-section-title">
              <MouseIcon size={22} />
              Master Tabel Data Mouse Wireless
            </h2>

            <div className="msw-table-wrapper">
              <table className="msw-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Manufactur</th>
                    <th>Location</th>
                    <th>Assign To</th>
                    <th>Username</th>
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
                      <td>{a.assignTo}</td>
                      <td>{a.username}</td>
                      <td>
                        <div className="msw-action-group">
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
        <div className="msw-modal-overlay" onClick={closeForm}>
          <div className="msw-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="msw-modal-header">
              <h2 className="msw-modal-title">{isEdit ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="msw-modal-close" onClick={closeForm}>
                ×
              </button>
            </div>

            <div className="msw-modal-body">
              <div className="msw-form-row">
                <div className="msw-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. MSW-SITE-25001"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="msw-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="msw-form-group">
                  <label>Manufactur</label>
                  <select
                    value={formData.manufactur}
                    onChange={(e) => handleFormChange("manufactur", e.target.value)}
                  >
                    <option value="">Select Manufactur</option>
                    {MSW_MANUFACTURERS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="msw-form-group">
                  <label>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                  />
                </div>

                <div className="msw-form-group">
                  <label>Assign To</label>
                  <input
                    value={formData.assignTo}
                    onChange={(e) => handleFormChange("assignTo", e.target.value)}
                  />
                </div>

                <div className="msw-form-group">
                  <label>Username</label>
                  <input
                    value={formData.username}
                    onChange={(e) => handleFormChange("username", e.target.value)}
                  />
                </div>

                <PhotoUploadField
                  value={formData.photo}
                  onChange={(value) => handleFormChange("photo", value)}
                />
              </div>
            </div>

            <div className="msw-modal-footer">
              <button className="msw-btn-cancel" onClick={closeForm}>
                Cancel
              </button>
              <button className="msw-btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="Mouse Wireless Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete MSW Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
