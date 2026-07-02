import { Usb, Plus, Eye, Pencil, Trash2, ImagePlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "../styles/flashdisk.css";
import "../styles/dashboard.css"; 
import "../styles/animations.css";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { flashdiskAssetService, FLASHDISK_STATUSES } from "../services/flashdiskAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  category: "Storage Management",
  subCategory: "Flashdisk",
  serialNumber: "",
  dept: "",
  location: "",
  status: "NULL",
  badge: "good",
  photo: "",
};

function badgeClass(badge) {
  return badge === "good" ? "badge-good" : "badge-store";
}

export default function StorageFlashdisk() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    async function loadAssets() {
      setLoading(true);
      const data = await flashdiskAssetService.list();
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

  const filtered = assets.filter((item) =>
    item.entityId.toLowerCase().includes(search.toLowerCase())
  );
  const hasResult = filtered.length > 0;

  const summary = [
    { label: "Total Stock", value: filtered.length, color: "#c837ff" },
    {
      label: "In Use",
      value: filtered.filter((i) => i.status === "IN USE").length,
      color: "#43c943",
    },
    {
      label: "In Store",
      value: filtered.filter((i) => i.status === "IN STORE").length,
      color: "#42a5f5",
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
      const statusInfo = FLASHDISK_STATUSES.find((s) => s.value === value);
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
        const updated = await flashdiskAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await flashdiskAssetService.create(formData);
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
      await flashdiskAssetService.remove(deleteTarget.id);
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
            <h1 className="fd-title">Flashdisk Inventory 2024</h1>

            <div className="fd-summary-grid">
              {summary.map((item) => (
                <div key={item.label} className="fd-summary-card stagger-item">
                  <div className="fd-summary-bar" style={{ background: item.color }} />
                  <p className="fd-summary-label">{item.label}</p>
                  <p className="fd-summary-value">{item.value} Unit</p>
                </div>
              ))}
            </div>

            <div className="fd-header-actions">
              <button className="btn-add-dashboard" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="fd-section stagger-item">
            <h2 className="fd-section-title">
              <Usb size={22} />
              Master Table Data Flashdisk
            </h2>
            <div className="fd-table-wrapper">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Device USB / Type</th>
                    <th>Allocation</th>
                    <th>Dept</th>
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
                      <td>{item.device}</td>
                      <td>{item.allocation}</td>
                      <td>{item.dept}</td>
                      <td>
                        <span className={badgeClass(item.badge)}>{item.status}</span>
                      </td>
                      <td>
                        <div className="fd-action-group">
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
                  <label>Entity ID</label>
                  <input
                    placeholder="..."
                    value={formData.entityId}
                    onChange={(e) =>
                      handleFormChange("entityId", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Serial Number</label>
                  <input
                    placeholder="..."
                    value={formData.serialNumber}
                    onChange={(e) =>
                      handleFormChange("serialNumber", e.target.value)
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
                  <label>Location</label>
                  <input
                    placeholder="..."
                    value={formData.location}
                    onChange={(e) =>
                      handleFormChange("location", e.target.value)
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
                  <label>Department</label>
                  <input
                    placeholder="..."
                    value={formData.dept}
                    onChange={(e) =>
                      handleFormChange("dept", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group full">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleFormChange("status", e.target.value)
                    }
                  >
                    <option value="In Use">In Use</option>
                    <option value="In Store">In Store</option>
                    <option value="Broken">Broken</option>
                    <option value="Null">Null</option>
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
                onClick={saveAsset}
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
        title="Flashdisk Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Flashdisk Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
