import { useState, useEffect, useRef } from "react";
import { Wifi, Plus, Eye, Pencil, Trash2, ChevronDown, ImagePlus } from "lucide-react";
import "../styles/donglewifi.css";
import "../styles/dashboard.css"; 
import "../styles/animations.css";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import {
  dongleWifiAssetService,
  DONGLEWIFI_YEARS,
  DONGLEWIFI_STATUSES,
} from "../services/dongleWifiAssetService";

const yearFilters = ["All", ...DONGLEWIFI_YEARS];
const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  category: "Network Infrastructure",
  subCategory: "Dongle Wi-Fi",
  dept: "",
  pic: "",
  type: "",
  size: "",
  year: "",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function NetworkDongleWiFi() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [showYearDrop, setShowYearDrop] = useState(false);
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
      const data = await dongleWifiAssetService.list();
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
    const matchYear = yearFilter === "All" || a.year === yearFilter;
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
      const statusInfo = DONGLEWIFI_STATUSES.find((s) => s.value === value);
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
        const updated = await dongleWifiAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await dongleWifiAssetService.create(formData);
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
      await dongleWifiAssetService.remove(deleteTarget.id);
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
          <div className="ndw-topbar">
            <div>
              <h1 className="ndw-title">Dongle Wi-Fi</h1>
              {yearFilter !== "All" && <h1 className="ndw-title">{yearFilter}</h1>}
            </div>

            <div className="ndw-topbar-right">
              <div className="ndw-summary-card ndw-summary-yellow stagger-item">
                <span className="ndw-summary-label">Total Stock</span>
                <span className="ndw-summary-value">{totalStock} Unit</span>
              </div>
              <div className="ndw-summary-card ndw-summary-green stagger-item">
                <span className="ndw-summary-label">In Use</span>
                <span className="ndw-summary-value">{inUse} Unit</span>
              </div>
              <div className="ndw-summary-card ndw-summary-blue stagger-item">
                <span className="ndw-summary-label">In Store</span>
                <span className="ndw-summary-value">{inStore} Unit</span>
              </div>

              <div className="ndw-year-wrap">
                <button
                  className="ndw-year-btn"
                  onClick={() => setShowYearDrop(!showYearDrop)}
                >
                  {yearFilter}
                  <ChevronDown size={16} />
                </button>
                {showYearDrop && (
                  <div className="ndw-year-drop">
                    {yearFilters.map((y) => (
                      <div
                        key={y}
                        className={`ndw-year-option ${yearFilter === y ? "active" : ""}`}
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

              <button className="btn-add-dashboard" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="ndw-section stagger-item">
            <h2 className="ndw-section-title">
              <Wifi size={22} />
              Master Tabel Data Dongle Wi-Fi
            </h2>

            <div className="ndw-table-wrapper">
              <table className="ndw-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Dept</th>
                    <th>PIC</th>
                    <th>Type</th>
                    <th>Size</th>
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
                      <td>{a.dept}</td>
                      <td>{a.pic}</td>
                      <td>{a.type}</td>
                      <td>{a.size}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="ndw-action-group">
                          <button className="btn-view" onClick={() => setViewTarget(a)} title="View">
                            <Eye size={16} />
                          </button>
                          <button className="btn-edit" onClick={() => openEditModal(a)} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteTarget(a)}
                            title="Delete"
                          >
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
                  <label>Department</label>
                  <input
                    placeholder="..."
                    value={formData.department}
                    onChange={(e)=>
                      handleFormChange("department", e.target.value)
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
                  <label>PIC</label>
                  <input
                    placeholder="..."
                    value={formData.pic}
                    onChange={(e)=>
                      handleFormChange("pic", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Size (GB)</label>
                  <input
                    placeholder="..."
                    value={formData.size}
                    onChange={(e) =>
                      handleFormChange("size", e.target.value)
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
                <div className="dash-form-group full">
                  <label>Puerchase Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      handleFormChange("year", e.target.value)
                    }
                  />
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
        title="Dongle Wi-Fi Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Dongle Wi-Fi Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
