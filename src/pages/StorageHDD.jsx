import { HardDrive, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/hdd.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { hddAssetService, HDD_STATUSES } from "../services/hddAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  type: "",
  capacity: "",
  location: "",
  dept: "",
  status: "IN USE",
  badge: "good",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function StorageHDD() {
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
      const data = await hddAssetService.list();
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
      const statusInfo = HDD_STATUSES.find((s) => s.value === value);
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
        const updated = await hddAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await hddAssetService.create(formData);
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
      await hddAssetService.remove(deleteTarget.id);
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
            <h1 className="hdd-title">HDD Inventory 2024</h1>

            <div className="hdd-summary-grid">
              {summary.map((item) => (
                <div key={item.label} className="hdd-summary-card">
                  <div className="hdd-summary-bar" style={{ background: item.color }} />
                  <p className="hdd-summary-label">{item.label}</p>
                  <p className="hdd-summary-value">{item.value} Unit</p>
                </div>
              ))}
            </div>

            {/* Tombol Add dipindah keluar dari grid summary (sebelumnya salah ditaruh di dalam .hdd-summary-grid) */}
            <div className="hdd-header-actions">
              <button className="btn-add" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="hdd-section">
            <h2 className="hdd-section-title">
              <HardDrive size={22} />
              Master Table Data HDD
            </h2>
            <div className="hdd-table-wrapper">
              <table className="hdd-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Location</th>
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
                      <td>{item.type}</td>
                      <td>{item.capacity}</td>
                      <td>{item.location}</td>
                      <td>{item.dept}</td>
                      <td>
                        <span className={badgeClass(item.badge)}>{item.status}</span>
                      </td>
                      <td>
                        <div className="hdd-action-group">
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
        <div className="hdd-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="hdd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="hdd-modal-header">
              <h2 className="hdd-modal-title">{formData.id ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="hdd-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="hdd-modal-body">
              <div className="hdd-form-row">
                <div className="hdd-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. HDD-SITE-23004"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="hdd-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="hdd-form-group">
                  <label>Type</label>
                  <input
                    placeholder="e.g. HDD/NAS"
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                  />
                </div>

                <div className="hdd-form-group">
                  <label>Capacity</label>
                  <input
                    placeholder="e.g. 4 TB"
                    value={formData.capacity}
                    onChange={(e) => handleFormChange("capacity", e.target.value)}
                  />
                </div>

                <div className="hdd-form-group">
                  <label>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                  />
                </div>

                <div className="hdd-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="hdd-form-group full">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {HDD_STATUSES.map((s) => (
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

            <div className="hdd-modal-footer">
              <button
                className="hdd-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="hdd-btn-save" onClick={saveAsset} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="HDD Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete HDD Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
