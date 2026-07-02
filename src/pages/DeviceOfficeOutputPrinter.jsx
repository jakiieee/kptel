import { useState, useEffect, useRef } from "react";
import { Printer as PrinterIcon, Plus, Eye, Pencil, Trash2, ImagePlus } from "lucide-react";
import "../styles/printer.css";
import "../styles/dashboard.css";
import "../styles/animations.css";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { printerAssetService, PRINTER_STATUSES } from "../services/printerAssetService";

const emptyForm = {
  id: null,
  entityId: "",
  serialNumber: "",
  type: "",
  assignTo: "",
  dept: "",
  pic: "",
  status: "NULL",
  category: "Device Office Output",
  subCategory: "Printer",
  photo: "",
};

function badgeClass(badge) {
  if (badge === "good") return "badge-good";
  if (badge === "broken") return "badge-broken";
  return "badge-store";
}

export default function DeviceOfficeOutputPrinter() {
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
      const data = await printerAssetService.list();
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
      const statusInfo = PRINTER_STATUSES.find((s) => s.value === value);
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
        const updated = await printerAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await printerAssetService.create(formData);
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
      await printerAssetService.remove(deleteTarget.id);
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
            <h1 className="printer-title">Printer</h1>

            <div className="printer-header-actions">
              <div className="printer-summary-grid">
                <div className="printer-summary-card stagger-item">
                  <div className="printer-summary-bar" style={{ background: "#f5a623" }} />
                  <p className="printer-summary-label">Total Stock</p>
                  <p className="printer-summary-value">{totalStock} Unit</p>
                </div>
                <div className="printer-summary-card stagger-item">
                  <div className="printer-summary-bar" style={{ background: "#43a047" }} />
                  <p className="printer-summary-label">In Use</p>
                  <p className="printer-summary-value">{inUse} Unit</p>
                </div>
                <div className="printer-summary-card stagger-item">
                  <div className="printer-summary-bar" style={{ background: "#1e88e5" }} />
                  <p className="printer-summary-label">In Store</p>
                  <p className="printer-summary-value">{inStore} Unit</p>
                </div>
              </div>

              <button className="btn-add-dashboard" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="printer-section stagger-item">
            <h2 className="printer-section-title">
              <PrinterIcon size={22} />
              Master Tabel Data Printer
            </h2>

            <div className="printer-table-wrapper">
              <table className="printer-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Entity ID</th>
                    <th>Serial Number</th>
                    <th>Type</th>
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
                      <td>{a.type}</td>
                      <td>{a.assignTo}</td>
                      <td>{a.dept}</td>
                      <td>{a.pic}</td>
                      <td>
                        <span className={badgeClass(a.badge)}>{a.status}</span>
                      </td>
                      <td>
                        <div className="printer-action-group">
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
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                  >
                    <option value="">Select Category</option>
                    <option value="PC & Workstation">
                      PC & Workstation
                    </option>
                    <option value="Storage Management">
                      Storage Management
                    </option>
                    <option value="Hardware & Components">
                      Hardware & Components
                    </option>
                    <option value="Peripherals & Accessories">
                      Peripherals & Accessories
                    </option>
                    <option value="Network Infrastructure">
                      Network Infrastructure
                    </option>
                    <option value="Devices & Office Output">
                      Devices & Office Output
                    </option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Type</label>
                  <input
                    placeholder="..."
                    value={formData.type}
                    onChange={(e)=>
                      handleFormChange("type", e.target.value)
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
                  <input
                    value={formData.status}
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
                <div className="dash-form-group">
                  <label>PIC</label>
                  <input
                    placeholder="..."
                    value={formData.pic}
                    onChange={(e) =>
                      handleFormChange("pic", e.target.value)
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
        title="Printer Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Printer Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
