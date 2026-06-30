import { useState, useEffect } from "react";
import "../styles/listpc.css";
import "../styles/dashboard.css"; // dipakai oleh PhotoViewModal & ConfirmDeleteModal (dash-modal-*)
import { Eye, Pencil, Trash2, Plus, Database, ChevronDown } from "lucide-react";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PhotoViewModal from "../components/PhotoViewModal";
import PhotoUploadField from "../components/PhotoUploadField";
import { pcAssetService, PC_CONDITIONS, PC_LOCATIONS } from "../services/pcAssetService";

const locationFilters = [
  { label: "All Location", value: "all" },
  ...PC_LOCATIONS.map((loc) => ({ label: loc, value: loc })),
];

const emptyForm = {
  id: null,
  entityId: "",
  deviceType: "",
  condition: "Good",
  location: "Workshop",
  lastCheck: "",
  photo: "",
};

export default function ListPC() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [showLocationDrop, setShowLocationDrop] = useState(false);

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
      const data = await pcAssetService.list();
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

  const filteredAssets = assets.filter((asset) => {
    const matchSearch = asset.entityId.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location === "all" || asset.location === location;
    return matchSearch && matchLocation;
  });
  const hasResult = filteredAssets.length > 0;

  const summary =
    location === "Workshop" || location.startsWith("Room")
      ? [
          { label: "Total Device", value: filteredAssets.length, color: "#2196f3" },
          {
            label: "Good Condition",
            value: filteredAssets.filter((a) => a.condition === "Good").length,
            color: "#4caf50",
          },
          {
            label: "Broken Condition",
            value: filteredAssets.filter((a) => a.condition === "Broken").length,
            color: "#e53935",
          },
        ]
      : [
          {
            label: "Device in Use",
            value: filteredAssets.filter((a) => a.condition === "Good").length,
            color: "#2196f3",
          },
          { label: "Total PC/Laptop", value: filteredAssets.length, color: "#4caf50" },
          {
            label: "Ready in Store",
            value: filteredAssets.filter((a) => a.condition === "Broken").length,
            color: "#e53935",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function saveAsset() {
    if (!formData.entityId.trim() || !formData.deviceType.trim()) {
      alert("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      if (formData.id) {
        const updated = await pcAssetService.update(formData.id, formData);
        setAssets((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await pcAssetService.create(formData);
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
      await pcAssetService.remove(deleteTarget.id);
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
          <div className="listpc-top">
            <div className="listpc-heading">
              <h1 className="listpc-title">
                List PC & <br />
                Workstation
              </h1>
            </div>

            <div className="listpc-summary-grid">
              {summary.map((item) => (
                <div className="listpc-summary-card" key={item.label}>
                  <div className="listpc-summary-bar" style={{ background: item.color }} />
                  <div className="listpc-summary-header">
                    <p className="listpc-summary-label">{item.label}</p>
                  </div>
                  <p className="listpc-summary-value">{item.value} Unit</p>
                </div>
              ))}
            </div>

            <div className="listpc-actions">
              <div className="listpc-location-wrap">
                <button
                  className="listpc-location-btn"
                  onClick={() => setShowLocationDrop(!showLocationDrop)}
                >
                  {locationFilters.find((x) => x.value === location)?.label}
                  <ChevronDown size={16} />
                </button>

                {showLocationDrop && (
                  <div className="listpc-location-drop">
                    {locationFilters.map((item) => (
                      <div
                        key={item.value}
                        className={`listpc-location-option ${
                          location === item.value ? "active" : ""
                        }`}
                        onClick={() => {
                          setLocation(item.value);
                          setShowLocationDrop(false);
                        }}
                      >
                        {item.label}
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

          <section className="section">
            <div className="table-header">
              <h2 className="section-title">
                <Database size={22} />
                Master Table Data
              </h2>
            </div>
            <table className="asset-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Entity ID</th>
                  <th>Device Type</th>
                  <th>Condition</th>
                  <th>Location</th>
                  <th>Last Check Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, index) => (
                  <tr key={asset.id}>
                    <td>{index + 1}</td>
                    <td>{asset.entityId}</td>
                    <td>{asset.deviceType}</td>
                    <td>
                      <span className={asset.condition === "Good" ? "badge-good" : "badge-broken"}>
                        {asset.condition}
                      </span>
                    </td>
                    <td>{asset.location}</td>
                    <td>{asset.lastCheck}</td>
                    <td>
                      <div className="action-group">
                        <button className="btn-view" onClick={() => setViewTarget(asset)} title="View">
                          <Eye size={18} />
                        </button>
                        <button className="btn-edit" onClick={() => openEditModal(asset)} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setDeleteTarget(asset)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <NotFoundState />
      )}

      {/* MODAL: Add / Edit */}
      {showFormModal && (
        <div className="listpc-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="listpc-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="listpc-modal-header">
              <h2 className="listpc-modal-title">
                {formData.id ? "Edit Asset" : "Add New Asset"}
              </h2>
              <button className="listpc-modal-close" onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <div className="listpc-modal-body">
              <div className="listpc-form-row">
                <div className="listpc-form-group">
                  <label>Entity ID</label>
                  <input
                    placeholder="e.g. 17079"
                    value={formData.entityId}
                    onChange={(e) => handleFormChange("entityId", e.target.value)}
                  />
                </div>

                <div className="listpc-form-group">
                  <label>Device Type</label>
                  <input
                    placeholder="e.g. PC/Workstation"
                    value={formData.deviceType}
                    onChange={(e) => handleFormChange("deviceType", e.target.value)}
                  />
                </div>

                <div className="listpc-form-group">
                  <label>Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleFormChange("condition", e.target.value)}
                  >
                    {PC_CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="listpc-form-group">
                  <label>Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                  >
                    {PC_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="listpc-form-group full">
                  <label>Last Check Date</label>
                  <input
                    type="date"
                    value={formData.lastCheck}
                    onChange={(e) => handleFormChange("lastCheck", e.target.value)}
                  />
                </div>

                <PhotoUploadField
                  value={formData.photo}
                  onChange={(value) => handleFormChange("photo", value)}
                />
              </div>
            </div>

            <div className="listpc-modal-footer">
              <button
                className="listpc-btn-cancel"
                onClick={() => setShowFormModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="listpc-btn-save" onClick={saveAsset} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View (Foto) */}
      <PhotoViewModal
        open={!!viewTarget}
        title="Asset Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

      {/* MODAL: Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Asset"
        description="Are you sure you want to delete asset"
        itemLabel={deleteTarget ? `${deleteTarget.entityId}?` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
