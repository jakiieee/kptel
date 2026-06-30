import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { BarChart3, ClipboardList, TriangleAlert, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import { dashboardService } from "../services/dashboardService";

const getBarColor = (pct) => {
  if (pct <= 30) return "#FF0000";
  if (pct <= 60) return "#FFEA00";
  return "#32CD32"; 
};

const emptyAssetForm = {
  name: "",
  category: "",
  serialNumber: "",
  location: "",
  description: "",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const [summaryCards, setSummaryCards] = useState([]);
  const [bars, setBars] = useState([]);
  const [activities, setActivities] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal: Add New Asset
  const [showAddModal, setShowAddModal] = useState(false);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [isSavingAsset, setIsSavingAsset] = useState(false);

  // Modal: Restock
  const [restockTarget, setRestockTarget] = useState(null); // item low-stock yang dipilih
  const [restockQty, setRestockQty] = useState(1);
  const [isRestocking, setIsRestocking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      const [summary, categoryBars, activityList, lowStockList] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getCategoryBars(),
        dashboardService.getActivities(),
        dashboardService.getLowStock(),
      ]);

      if (!isMounted) return;
      setSummaryCards(summary);
      setBars(categoryBars);
      setActivities(activityList);
      setLowStock(lowStockList);
      setLoading(false);
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const keyword = search.trim().toLowerCase();

  const filteredActivities = activities.filter((item) =>
    item.text.toLowerCase().includes(keyword)
  );
  const filteredLowStock = lowStock.filter((item) =>
    item.name.toLowerCase().includes(keyword)
  );
  const filteredBars = bars.filter((item) =>
    item.label.toLowerCase().includes(keyword)
  );

  const hasResult =
    filteredBars.length > 0 ||
    filteredActivities.length > 0 ||
    filteredLowStock.length > 0;

  function openRestockModal(item) {
    setRestockTarget(item);
    setRestockQty(1);
  }

  function closeRestockModal() {
    setRestockTarget(null);
    setRestockQty(1);
  }

  async function handleConfirmRestock() {
    if (!restockTarget || restockQty <= 0) return;
    setIsRestocking(true);
    try {
      const updated = await dashboardService.restockItem(restockTarget.id, Number(restockQty));
      setLowStock((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      closeRestockModal();
    } catch (err) {
      alert(err.message || "Failed to restock item.");
    } finally {
      setIsRestocking(false);
    }
  }

  function handleAssetFieldChange(field, value) {
    setAssetForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveAsset() {
    if (!assetForm.name.trim()) {
      alert("Asset name is required.");
      return;
    }
    setIsSavingAsset(true);
    try {
      await dashboardService.addAsset(assetForm);
      const refreshedActivities = await dashboardService.getActivities();
      setActivities(refreshedActivities);
      setAssetForm(emptyAssetForm);
      setShowAddModal(false);
    } catch (err) {
      alert(err.message || "Failed to add asset.");
    } finally {
      setIsSavingAsset(false);
    }
  }

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} />

      {loading ? (
        <p className="dash-loading-text">Loading dashboard...</p>
      ) : hasResult ? (
        <>
          <div className="dashboard-top">
            <h1 className="dash-title">Dashboard</h1>
            <div className="dashboardsummary-grid">
              {summaryCards.map((c) => (
                <div key={c.label} className="dashboardsummary-card">
                  <div className="dashboardsummary-bar" style={{ background: c.color }} />
                  <p className="dashboardsummary-label">{c.label}</p>
                  <p className="dashboardsummary-value">{c.value}</p>
                </div>
              ))}
            </div>
            <button className="btn-add-dashboard" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              Add New Asset
            </button>
          </div>

          <section className="section viz-section">
            <h2 className="section-title">
              <BarChart3 size={22} />
              Visualisation Quick Summary
            </h2>
            <div className="bar-list">
              {filteredBars.map((b) => (
                <div key={b.label} className="bar-row">
                  <p className="bar-label">{b.label}</p>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${b.pct}%`, background: getBarColor(b.pct) }}
                    />
                  </div>
                  <span className="bar-pct" style={{ color: getBarColor(b.pct) }}>
                    {b.pct}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="bottom-grid">
            <section className="section activities-section">
              <h2 className="section-title">
                <ClipboardList size={22} />
                Recent Activities
              </h2>
              <div className="activity-list">
                {filteredActivities.map((a, i) => (
                  <div key={a.id ?? i} className="activity-item">
                    <span className="activity-badge" style={{ background: a.color }}>
                      {a.type}
                    </span>
                    <p className="activity-text">{a.text}</p>
                    {i < filteredActivities.length - 1 && <hr className="activity-divider" />}
                  </div>
                ))}
              </div>
            </section>

            <section className="section lowstock-section">
              <h2 className="section-title">
                <TriangleAlert size={22} />
                Low Stock Alert
              </h2>
              <ol className="lowstock-list">
                {filteredLowStock.map((item) => (
                  <li key={item.id} className="lowstock-item">
                    <div className="lowstock-info">
                      <span className="lowstock-name">{item.name}</span>
                      <span className="lowstock-sisa">Sisa: {item.sisa}</span>
                    </div>
                    <button
                      className="btn-restock"
                      onClick={() => openRestockModal(item)}
                    >
                      <Plus size={18} />
                      Restock
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </>
      ) : (
        <NotFoundState />
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: Add New Asset                                 */}
      {/* ---------------------------------------------------- */}
      {showAddModal && (
        <div className="dash-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h2 className="dash-modal-title">Add New Asset</h2>
              <button className="dash-modal-close" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>

            <div className="dash-modal-body">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Asset Name</label>
                  <input
                    placeholder="Enter asset name"
                    value={assetForm.name}
                    onChange={(e) => handleAssetFieldChange("name", e.target.value)}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => handleAssetFieldChange("category", e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="Storage">Storage</option>
                    <option value="Hardware">Hardware & Components</option>
                    <option value="Network">Network Infrastructure</option>
                    <option value="Peripherals">Peripherals & Accessories</option>
                    <option value="Devices">Devices & Office Output</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Serial Number</label>
                  <input
                    value={assetForm.serialNumber}
                    onChange={(e) => handleAssetFieldChange("serialNumber", e.target.value)}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Location</label>
                  <input
                    value={assetForm.location}
                    onChange={(e) => handleAssetFieldChange("location", e.target.value)}
                  />
                </div>

                <div className="dash-form-group full">
                  <label>Description</label>
                  <textarea
                    value={assetForm.description}
                    onChange={(e) => handleAssetFieldChange("description", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="dash-modal-footer">
              <button
                className="dash-btn-cancel"
                onClick={() => setShowAddModal(false)}
                disabled={isSavingAsset}
              >
                Cancel
              </button>
              <button
                className="dash-btn-save"
                onClick={handleSaveAsset}
                disabled={isSavingAsset}
              >
                {isSavingAsset ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: Restock                                       */}
      {/* ---------------------------------------------------- */}
      {restockTarget && (
        <div className="dash-modal-overlay" onClick={closeRestockModal}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h2 className="dash-modal-title">Restock Item</h2>
              <button className="dash-modal-close" onClick={closeRestockModal}>
                ×
              </button>
            </div>

            <div className="dash-modal-body">
              <p className="restock-current-stock">
                <strong>{restockTarget.name}</strong> — current stock: {restockTarget.sisa}
              </p>

              <div className="restock-form-group">
                <label>Quantity to Add</label>
                <input
                  type="number"
                  min={1}
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                />
              </div>
            </div>

            <div className="dash-modal-footer">
              <button
                className="dash-btn-cancel"
                onClick={closeRestockModal}
                disabled={isRestocking}
              >
                Cancel
              </button>
              <button
                className="dash-btn-save"
                onClick={handleConfirmRestock}
                disabled={isRestocking}
              >
                {isRestocking ? "Saving..." : "Confirm Restock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
