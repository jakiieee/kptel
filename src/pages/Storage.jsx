import "../styles/storage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HardDrive, Usb, Activity, Disc3 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";

const storageCards = [
  {
    title: "SSD Inventory",
    total: "Total Stock: 150 Pcs",
    info1: "In Store: 40 pcs",
    info2: "Deployed: 110 pcs",
    color: "red",
    button: "Manage SSD",
    path: "/storage/ssd",
    icon: Disc3,
  },
  {
    title: "HDD & NAS Storage",
    total: "Total Stock: 45 Units",
    info1: "Healthy: 42 Units",
    info2: "Need Replacement: 3 Units",
    color: "yellow",
    button: "Manage Storage",
    path: "/storage/hdd",
    icon: HardDrive,
  },
  {
    title: "Flashdisk Inventory",
    total: "Total Procedurement (2024): 80 pcs",
    info1: "Available: 15 pcs",
    info2: "",
    color: "green",
    button: "Manage Flashdisk",
    path: "/storage/flashdisk",
    icon: Usb,
  },
  {
    title: "Drive Health Inspection Logs",
    total: "Last Maintenance: 21 Feb 2024",
    info1: "Total Inspected Devices: 73 pcs",
    info2: "",
    color: "blue",
    button: "View Health Reports",
    path: "/storage/health",
    icon: Activity,
  },
];

const storageData = [
  { label: "SSD Inventory", percent: 65 },
  { label: "HDD & NAS Storage", percent: 40 },
  { label: "Flashdisk Inventory", percent: 50 },
  { label: "Drive Health Inspection Repports Logs", percent: 80 },
];

const getBarColor = (pct) => {
  if (pct <= 30) return "#E53935";
  if (pct <= 60) return "#FFD600";
  return "#32CD32";
};

export default function Storage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const keyword = search.toLowerCase();

  const filteredCards = storageCards.filter((item) =>
    item.title.toLowerCase().includes(keyword)
  );
  const filteredStorage = storageData.filter((item) =>
    item.label.toLowerCase().includes(keyword)
  );

  // Bug lama: hasResult dihitung sebelum filteredStorage didefinisikan -> ReferenceError.
  // Sudah diperbaiki: kedua filter dihitung dulu, baru hasResult.
  const hasResult = filteredCards.length > 0 || filteredStorage.length > 0;

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} />

      {hasResult ? (
        <>
          <h1 className="dash-title">Storage Management Overview</h1>

          <div className="storage-overview-grid">
            {filteredCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className={`storage-card ${card.color}`} key={card.title}>
                  <div className="storage-card-header">
                    <Icon size={26} />
                    <h3>{card.title}</h3>
                  </div>

                  <p>{card.total}</p>
                  <p>{card.info1}</p>
                  {card.info2 && <p>{card.info2}</p>}

                  <button className="storage-btn" onClick={() => navigate(card.path)}>
                    {card.button}
                  </button>
                </div>
              );
            })}
          </div>

          <section className="section">
            <h2 className="section-title">Storage Capacity Distribution</h2>

            <div className="bar-list">
              {filteredStorage.map((item) => (
                <div className="bar-row" key={item.label}>
                  <p className="bar-label">{item.label}</p>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${item.percent}%`, background: getBarColor(item.percent) }}
                    />
                  </div>
                  <span className="bar-pct" style={{ color: getBarColor(item.percent) }}>
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <NotFoundState />
      )}
    </>
  );
}
