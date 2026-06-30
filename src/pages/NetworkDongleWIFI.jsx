import { useState, useEffect } from "react";
import { Wifi, Plus, Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import "../styles/donglewifi.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
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
  dept: "",
  pic: "",
  type: "",
  size: "",
  status: "IN STORE",
  badge: "store",
  year: String(new Date().getFullYear()),
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
              <div className="ndw-summary-card ndw-summary-yellow">
                <span className="ndw-summary-label">Total Stock</span>
                <span className="ndw-summary-value">{totalStock} Unit</span>
              </div>
              <div className="ndw-summary-card ndw-summary-green">
                <span className="ndw-summary-label">In Use</span>
                <span className="ndw-summary-value">{inUse} Unit</span>
              </div>
              <div className="ndw-summary-card ndw-summary-blue">
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

              <button className="btn-add" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="ndw-section">
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

      {/* MODAL: Add / Edit */}
      {showFormModal && (
        <div className="ndw-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="ndw-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ndw-modal-header">
              <h2 className="ndw-modal-title">{formData.id ? "Edit Asset" : "Add New Asset"}</h2>
              <button className="ndw-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="ndw-modal-body">
              <div className="ndw-form-row">
                <div className="ndw-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. WL-SITE-24001"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="ndw-form-group">
                  <label>Serial Number</label>
                  <input
                    value={formData.serialNumber}
                    onChange={(e) => handleFormChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="ndw-form-group">
                  <label>Dept</label>
                  <input
                    value={formData.dept}
                    onChange={(e) => handleFormChange("dept", e.target.value)}
                  />
                </div>

                <div className="ndw-form-group">
                  <label>PIC</label>
                  <input
                    value={formData.pic}
                    onChange={(e) => handleFormChange("pic", e.target.value)}
                  />
                </div>

                <div className="ndw-form-group">
                  <label>Type</label>
                  <input
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                  />
                </div>

                <div className="ndw-form-group">
                  <label>Size</label>
                  <input
                    value={formData.size}
                    onChange={(e) => handleFormChange("size", e.target.value)}
                  />
                </div>

                <div className="ndw-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {DONGLEWIFI_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ndw-form-group">
                  <label>Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleFormChange("year", e.target.value)}
                  >
                    {DONGLEWIFI_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
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

            <div className="ndw-modal-footer">
              <button
                className="ndw-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="ndw-btn-save" onClick={saveAsset} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="Dongle Wi-Fi Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
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
