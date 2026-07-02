import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryStick, BatteryCharging } from "lucide-react";
import "../styles/hardware.css";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import { ramAssetService } from "../services/ramAssetService";
import { batteryAssetService } from "../services/batteryAssetService";

export default function Hardware() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [ramCount, setRamCount] = useState(0);
  const [batteryCount, setBatteryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadCounts() {
      const [ramData, batteryData] = await Promise.all([
        ramAssetService.list(),
        batteryAssetService.list(),
      ]);
      if (isMounted) {
        setRamCount(ramData.length);
        setBatteryCount(batteryData.length);
      }
    }
    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const hardwareCards = [
    {
      title: "RAM Inventory",
      total: `Total Stock : ${ramCount} Units`,
      info1: `In Store: ${ramCount} Units`,
      info2: "In Use: 0 Units",
      color: "blue",
      button: "Manage RAM",
      path: "/hardware/ram",
      icon: MemoryStick,
    },
    {
      title: "Battery NB Inventory",
      total: `Total Stock : ${batteryCount} Units`,
      info1: `In Store: ${batteryCount} Units`,
      info2: "In Use: 0 Units",
      color: "yellow",
      button: "Manage Battery",
      path: "/hardware/battery",
      icon: BatteryCharging,
    },
  ];

  const keyword = search.toLowerCase();
  const filteredCards = hardwareCards.filter((item) =>
    item.title.toLowerCase().includes(keyword)
  );

  const hardwareData = [
    {
      label: "RAM Inventory",
      percent:
        ramCount === 0
          ? 0
          : 100,
    },
    {
      label: "Battery NB Inventory",
      percent:
        batteryCount === 0
          ? 0
          : 100,
    },
  ];

  const filteredHardware = hardwareData.filter((item) =>
    item.label.toLowerCase().includes(keyword)
  );

  const hasResult =
    filteredCards.length > 0 ||
    filteredHardware.length > 0;

  const getBarColor = (pct) => {
    if (pct <= 30) return "#E53935";
    if (pct <= 60) return "#FFD600";
    return "#32CD32";
  };

  return (
    <>
      <PageHeader
        search={search}
        onSearchChange={setSearch}
        placeholder="Search Hardware..."
      />
      {hasResult ? (
        <>
      <h1 className="dash-title">Hardware Overview</h1>
      <div className="hw-overview-grid">
        {filteredCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className={`hw-card hw-card-${card.color} stagger-item`}
              key={card.title}
            >
              <div className="hw-card-header">
                <Icon size={26} />
                <h3>{card.title}</h3>
              </div>

              <p>{card.total}</p>
              <p>{card.info1}</p>
              {card.info2 && <p>{card.info2}</p>}

              <button
                className="hw-btn"
                onClick={() => navigate(card.path)}
              >
                {card.button}
              </button>
            </div>
          );
        })}
      </div>
      <section className="section stagger-item">
        <h2 className="section-title">
          Hardware Stock Availability Percentage
        </h2>

        <div className="bar-list">
          {filteredHardware.map((item) => (
            <div className="bar-row" key={item.label}>
              <p className="bar-label">{item.label}</p>

              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${item.percent}%`,
                    background: getBarColor(item.percent),
                  }}
                />
              </div>

              <span
                className="bar-pct"
                style={{
                  color: getBarColor(item.percent),
                }}
              >
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
