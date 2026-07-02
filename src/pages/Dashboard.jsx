import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import {
  BarChart3,
  ClipboardList,
  TriangleAlert,
  Download,
  FileText,
  FileSpreadsheet,
  Plus,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import { dashboardService } from "../services/dashboardService";

const getBarColor = (pct) => {
  if (pct <= 30) return "#FF0000";
  if (pct <= 60) return "#FFEA00";
  return "#32CD32"; 
};

function formatTimeAgo(time) {
  const seconds = Math.floor((Date.now() - time) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [summaryCards, setSummaryCards] = useState([]);
  const [bars, setBars] = useState([]);
  const [activities, setActivities] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockTarget, setRestockTarget] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
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
  const filteredActivities = activities.filter((item) => {
    const searchTarget = `
      ${item.title}
      ${item.description}
      ${item.user}
      ${item.type}
    `.toLowerCase();

    return searchTarget.includes(keyword);
  });
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

  const exportMenus = [
    { id: "all", label: "All Assets" },
    { id: "pc", label: "PC & Workstation" },
    { id: "storage", label: "Storage Management" },
    { id: "hardware", label: "Hardware & Components" },
    { id: "peripherals", label: "Peripherals & Accessories" },
    { id: "network", label: "Network Infrastructure" },
    { id: "devices", label: "Devices & Office Output" },
  ];

  function openRestockModal(item) {
    setRestockTarget(item);
    setRestockQty(1);
  }

  function closeRestockModal() {
    setRestockTarget(null);
    setRestockQty(1);
  }

  function openHistory(type) {
    setHistoryModal(type);
  }

  function closeHistory() {
    setHistoryModal(null);
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

  async function handleExport(category) {
    try {
      await dashboardService.exportReport(category);
      setShowExportMenu(false);
    } catch (err) {
      alert(err.message || "Failed to export report.");
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
                <div key={c.label} className="dashboardsummary-card stagger-item">
                  <div className="dashboardsummary-bar" style={{ background: c.color }} />
                  <p className="dashboardsummary-label">{c.label}</p>
                  <p className="dashboardsummary-value">{c.value}</p>
                </div>
              ))}
            </div>
            <div style={{ position: "relative" }}>
            <button
              className="btn-add-dashboard"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={18}/>
              Export Report
            </button>
            {showExportMenu && (
              <div className="export-dropdown" >
              {exportMenus.map((menu) => (
                <button
                  key={menu.id}
                  className="export-dropdown-item"
                  onClick={() => handleExport(menu.id)}
                >
                  <span>{menu.label}</span>
                </button>
              ))}
              </div>
            )}
          </div>
        </div>

          <section className="section viz-section stagger-item">
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
            <section className="section activities-section stagger-item">
              <h2 className="section-title">
                <ClipboardList size={22} />
                Recent Activities
              </h2>
              <div style={{ marginBottom: 18 }}>
                <button
                  className="activity-badge"
                  style={{
                    background: "#24437C",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => openHistory("all")}
                >
                  All
                </button>
              </div>
              <div className="activity-list">
                {filteredActivities.map((a, i) => (
                  <div key={a.id ?? i} className="activity-item">
                    <button
                      className="activity-badge"
                      style={{
                        background: a.color,
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => openHistory(a.type.toLowerCase())}
                    >
                      {a.type}
                    </button>
                    <div className="activity-content">
                      <p className="activity-title">
                        {a.title}
                      </p>
                      <p className="activity-description">
                        {a.description}
                      </p>
                      <small className="activity-meta">
                        {a.user} • {formatTimeAgo(a.createdAt)}
                      </small>
                    </div>
                    {i < filteredActivities.length - 1 && <hr className="activity-divider" />}
                  </div>
                ))}
              </div>
            </section>

            <section className="section lowstock-section stagger-item">
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
      {historyModal && (
        <div
          className="dash-modal-overlay"
          onClick={closeHistory}
        >
          <div
            className="dash-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "750px",
            }}
          >
            <div className="dash-modal-header">
              <h2 className="dash-modal-title">
                {historyModal === "all"
                  ? "Activity History"
                  : `${historyModal.charAt(0).toUpperCase() + historyModal.slice(1)} History`}
              </h2>
              <button
                className="dash-modal-close"
                onClick={closeHistory}
              >
                ×
              </button>
            </div>
            <div className="dash-modal-body">
              {activities
                .filter(
                  (item) =>
                    historyModal === "all" ||
                    item.type.toLowerCase() === historyModal
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="activity-item"
                  >
                    <span
                      className="activity-badge"
                      style={{
                        background: item.color,
                      }}
                    >
                      {item.type}
                    </span>
                    <div className="activity-content">
                      <p className="activity-title">
                        {item.title}
                      </p>
                      <p className="activity-description">
                        {item.description}
                      </p>
                      <small className="activity-meta">
                        {item.user} • {formatTimeAgo(item.createdAt)}
                      </small>
                    </div>
                    <hr className="activity-divider" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
