import { useState, useEffect, useRef } from "react";
import { Headphones, Plus, Eye, Pencil, Trash2, ChevronDown, ImagePlus } from "lucide-react";
import "../styles/headphone.css";
import "../styles/dashboard.css";
import "../styles/animations.css"; 
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import {
  headphoneAssetService,
  HEADPHONE_YEARS,
  HEADPHONE_STATUSES,
} from "../services/headphoneAssetService";

const yearFilters = ["All Years", ...HEADPHONE_YEARS];
const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  manufactur: "",
  type: "",
  assignTo: "",
  dept: "",
  category: "Peripherals & Accecories",
  subCategory: "Headphone",
  pcName: "",
  status: "IN STORE",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  if (badge === "null") return "badge-null";
  return "badge-store";
}

export default function PeripheralsHeadphone() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All Years");
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
      const data = await headphoneAssetService.list();
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
  const isEdit = Boolean(formData.id);
  const totalStock = filtered.length;
  const inUse = filtered.filter((a) => a.status === "IN USE").length;
  const inStore = filtered.filter((a) => a.status === "IN STORE").length;

  function openAddModal() {
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
      const statusInfo = HEADPHONE_STATUSES.find((s) => s.value === value);
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
        const updated = await headphoneAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await headphoneAssetService.create(formData);
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
      await headphoneAssetService.remove(deleteTarget.id);
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
          <div className="hp-topbar">
            <h1 className="hp-title">Headphone</h1>

            <div className="hp-topbar-right">
              <div className="hp-summary-card hp-summary-yellow stagger-item">
                <span className="hp-summary-label">Total Stock</span>
                <span className="hp-summary-value">{totalStock} Unit</span>
              </div>
              <div className="hp-summary-card hp-summary-green stagger-item">
                <span className="hp-summary-label">In Use</span>
                <span className="hp-summary-value">{inUse} Unit</span>
              </div>
              <div className="hp-summary-card hp-summary-blue stagger-item">
                <span className="hp-summary-label">In Store</span>
                <span className="hp-summary-value">{inStore} Unit</span>
              </div>

              <div className="hp-year-wrap">
                <button className="hp-year-btn" onClick={() => setShowYearDrop(!showYearDrop)}>
                  {yearFilter}
                  <ChevronDown size={16} />
                </button>
                {showYearDrop && (
                  <div className="hp-year-drop">
                    {yearFilters.map((y) => (
                      <div
                        key={y}
                        className={`hp-year-option ${yearFilter === y ? "active" : ""}`}
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

          <section className="hp-section stagger-item">
            <h2 className="hp-section-title">
              <Headphones size={22} />
              Master Tabel Data Headphone
            </h2>

            <div className="hp-table-wrapper">
              <table className="hp-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Manufactur</th>
                    <th>Type</th>
                    <th>Assign To</th>
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
                      <td>{a.manufactur}</td>
                      <td>{a.type}</td>
                      <td>{a.assignTo}</td>
                      <td>{a.dept}</td>
                      <td>{a.pcName}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="hp-action-group">
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
                    type="date"
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
                    value={formData.dept}
                    onChange={(e)=>
                      handleFormChange("dept", e.target.value)
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
                  <label>Assign To</label>
                  <input
                    placeholder="..."
                    value={formData.assignTo}
                    onChange={(e)=>
                      handleFormChange("assignTo", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
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

                <div className="dash-form-group">
                  <label>Manufactur</label>
                  <input
                    placeholder="..."
                    value={formData.manufactur}
                    onChange={(e) =>
                      handleFormChange("manufactur", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>PC Name</label>
                  <input
                    placeholder="..."
                    value={formData.pcName}
                    onChange={(e) =>
                      handleFormChange("pcName", e.target.value)
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
                onClick={handleSave}
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
        title="Headphone Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Headphone Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
