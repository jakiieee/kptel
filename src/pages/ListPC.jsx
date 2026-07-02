import { useState, useEffect, useRef } from "react";
import "../styles/listpc.css";
import "../styles/dashboard.css"; 
import "../styles/animations.css";
import { Eye, Pencil, Trash2, Plus, Database, ChevronDown, ImagePlus } from "lucide-react";
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
  lastCheckDate: "",
  category: "",
  subCategory: "",
  department: "",
  status: "Null",
  serialNumber: "",
  brand: "",
  case: "",
  type: "",
  location: "",
  deviceType: "",
  health: "",
  manufacturer: "",
  capacity: "",
  speed: "",
  mac: "",
  port: "",
  size: "",
  employeeName: "",
  condition: "Null",
  photo: "",
};

const CATEGORY_OPTIONS = {
  "Storage Management": [
    "SSD",
    "HDD Storage",
    "Flashdisk",
    "HDD Health"
  ],

  "Hardware & Components": [
    "RAM",
    "Battery"
  ],

  "Peripherals & Accessories": [
    "Keyboard",
    "Combo",
    "Webcam",
    "Headphone",
    "Multiport USB",
    "HDMI Port",
    "Mouse Wireless",
    "Mouse"
  ],

  "Network Infrastructure": [
    "Dongle WiFi",
    "Port",
    "FortiSwitch"
  ],

  "Devices & Office Output": [
    "Tablet",
    "Cast",
    "Printer",
    "UPS"
  ]
};

export default function ListPC() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const fileInputRef = useRef(null);
  const [assetImage, setAssetImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const subCategoryOptions =
    CATEGORY_OPTIONS[formData.category] || [];

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
                <div className="listpc-summary-card stagger-item" key={item.label}>
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

              <button className="btn-add-dashboard" onClick={openAddModal}>
                <Plus size={18} />
                Add New Asset
              </button>
            </div>
          </div>

          <section className="section stagger-item">
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
                  <label>Last Check Date</label>
                  <input
                    type="date"
                    value={formData.lastCheckDate}
                    onChange={(e) =>
                      handleFormChange("lastCheckDate", e.target.value)
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
                  <label>Health (%)</label>
                  <input
                    placeholder="..."
                    value={formData.health}
                    onChange={(e)=>
                      handleFormChange("health", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Sub Category</label>
                  <select
                    value={formData.subCategory}
                    onChange={(e)=>
                      handleFormChange("subCategory", e.target.value)
                    }
                  >
                    <option value="">
                      Select Sub Category
                    </option>
                    {subCategoryOptions.map((item)=>(
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Manufacturer</label>
                  <input
                    placeholder="..."
                    value={formData.manufacturer}
                    onChange={(e)=>
                      handleFormChange("manufacturer", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Department</label>
                  <input
                    placeholder="..."
                    value={formData.department}
                    onChange={(e) =>
                      handleFormChange("department", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Capacity</label>
                  <input
                    placeholder="..."
                    value={formData.capacity}
                    onChange={(e) =>
                      handleFormChange("capacity", e.target.value)
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
                  <label>Speed</label>
                  <input
                    placeholder="..."
                    value={formData.speed}
                    onChange={(e) =>
                      handleFormChange("speed", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
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

                <div className="dash-form-group">
                  <label>MAC Address</label>
                  <input
                    placeholder="00:00:00:00:00:00"
                    value={formData.mac}
                    onChange={(e) =>
                      handleFormChange("mac", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Brand</label>
                  <input
                    placeholder="..."
                    value={formData.brand}
                    onChange={(e) =>
                      handleFormChange("brand", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Port</label>
                  <input
                    placeholder="..."
                    value={formData.port}
                    onChange={(e) =>
                      handleFormChange("port", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Case</label>
                  <input
                    placeholder="..."
                    value={formData.case}
                    onChange={(e) =>
                      handleFormChange("case", e.target.value)
                    }
                  />
                </div>

                <div className="dash-form-group">
                  <label>Size</label>
                  <input
                    placeholder="..."
                    value={formData.size}
                    onChange={(e) =>
                      handleFormChange("size", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
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

                <div className="dash-form-group">
                  <label>Employee Name</label>
                  <input
                    placeholder="..."
                    value={formData.employeeName}
                    onChange={(e) =>
                      handleFormChange("employeeName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
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

                <div className="dash-form-group">
                  <label>Device Type</label>
                  <input
                    placeholder="..."
                    value={formData.deviceType}
                    onChange={(e) =>
                      handleFormChange("deviceType", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group full">
                  <label>Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      handleFormChange("condition", e.target.value)
                    }
                  >
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                    <option value="Very Bad">Very Bad</option>
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
        title="Asset Photo"
        photo={viewTarget?.photo}
        label={viewTarget?.entityId}
        onClose={() => setViewTarget(null)}
      />

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
