import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Keyboard as KeyboardIcon,
  Layers,
  Camera,
  Headphones,
  Usb,
  Cable,
  Mouse as MouseIcon,
} from "lucide-react";
import "../styles/peripherals.css";
import PageHeader from "../components/PageHeader";
import NotFoundState from "../components/NotFoundState";
import { keyboardAssetService } from "../services/keyboardAssetService";
import { comboAssetService } from "../services/comboAssetService";
import { webcamAssetService } from "../services/webcamAssetService";
import { headphoneAssetService } from "../services/headphoneAssetService";
import { multiportUsbAssetService } from "../services/multiportUsbAssetService";
import { hdmiPortAssetService } from "../services/hdmiPortAssetService";
import { mswAssetService } from "../services/mswAssetService";
import { mouseAssetService } from "../services/mouseAssetService";

export default function Peripherals() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState({
    keyboard: 0,
    combo: 0,
    webcam: 0,
    headphone: 0,
    multiportUsb: 0,
    hdmiPort: 0,
    msw: 0,
    mouse: 0,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadCounts() {
      const [keyboard, combo, webcam, headphone, usb, hdmi, msw, mouse] = await Promise.all([
        keyboardAssetService.list(),
        comboAssetService.list(),
        webcamAssetService.list(),
        headphoneAssetService.list(),
        multiportUsbAssetService.list(),
        hdmiPortAssetService.list(),
        mswAssetService.list(),
        mouseAssetService.list(),
      ]);
      if (isMounted) {
        setCounts({
          keyboard: keyboard.length,
          combo: combo.length,
          webcam: webcam.length,
          headphone: headphone.length,
          multiportUsb: usb.length,
          hdmiPort: hdmi.length,
          msw: msw.length,
          mouse: mouse.length,
        });
      }
    }
    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    {
      key: "keyboard",
      title: "Keyboard",
      total: `Total Stock: ${counts.keyboard} Units`,
      info1: `In Store: ${counts.keyboard} Units`,
      info2: "In Use: 0 Units",
      color: "red",
      icon: KeyboardIcon,
      button: "Manage Keyboard",
      path: "/peripherals/keyboard",
    },
    {
      key: "combo",
      title: "Combo Device",
      total: `Total Stock: ${counts.combo} Units`,
      info1: `In Store: ${counts.combo} Units`,
      info2: "In Use: 0 Units",
      color: "yellow",
      icon: Layers,
      button: "Manage Combo Device",
      path: "/peripherals/combo",
    },
    {
      key: "webcam",
      title: "Webcam",
      total: `Total Stock: ${counts.webcam} Units`,
      info1: `In Store: ${counts.webcam} Units`,
      info2: "In Use: 0 Units",
      color: "green",
      icon: Camera,
      button: "Manage Webcam",
      path: "/peripherals/webcam",
    },
    {
      key: "headphone",
      title: "Headphone",
      total: `Total Stock: ${counts.headphone} Units`,
      info1: `In Store: ${counts.headphone} Units`,
      info2: "In Use: 0 Units",
      color: "blue",
      icon: Headphones,
      button: "Manage Headphone",
      path: "/peripherals/headphone",
    },
    {
      key: "multiportUsb",
      title: "Multiport USB",
      total: `Total Stock: ${counts.multiportUsb} Units`,
      info1: `In Store: ${counts.multiportUsb} Units`,
      info2: "In Use: 0 Units",
      color: "red",
      icon: Usb,
      button: "Manage Multiport USB",
      path: "/peripherals/multiport-usb",
    },
    {
      key: "hdmiPort",
      title: "HDMI Port",
      total: `Total Stock: ${counts.hdmiPort} Units`,
      info1: `In Store: ${counts.hdmiPort} Units`,
      info2: "In Use: 0 Units",
      color: "yellow",
      icon: Cable,
      button: "Manage HDMI Port",
      path: "/peripherals/hdmi-port",
    },
    {
      key: "msw",
      title: "Mouse Wireless (MSW)",
      total: `Total Stock: ${counts.msw} Units`,
      info1: `In Store: ${counts.msw} Units`,
      info2: "In Use: 0 Units",
      color: "green",
      icon: MouseIcon,
      button: "Manage MSW",
      path: "/peripherals/msw",
    },
    {
      key: "mouse",
      title: "Mouse",
      total: `Total Stock: ${counts.mouse} Units`,
      info1: `In Store: ${counts.mouse} Units`,
      info2: "In Use: 0 Units",
      color: "blue",
      icon: MouseIcon,
      button: "Manage Mouse",
      path: "/peripherals/mouse",
    },
  ];
  const keyword = search.toLowerCase();
  const filteredCards = categories.filter((item) =>
    item.title.toLowerCase().includes(keyword)
  );

  const peripheralsData = [
    { label: "Keyboard", percent: 75 },
    { label: "Combo Device", percent: 60 },
    { label: "Webcam", percent: 90 },
    { label: "Headphone", percent: 55 },
    { label: "Multiport USB", percent: 70 },
    { label: "HDMI Port", percent: 45 },
    { label: "Mouse Wireless (MSW)", percent: 85 },
    { label: "Mouse", percent: 65 },
  ];

  const filteredPeripherals = peripheralsData.filter((item) =>
    item.label.toLowerCase().includes(keyword)
  );

  const hasResult =
    filteredCards.length > 0 ||
    filteredPeripherals.length > 0;

  const getBarColor = (pct) => {
    if (pct <= 30) return "#E53935";
    if (pct <= 60) return "#FFD600";
    return "#32CD32";
  };

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Peripherals..." />
      {hasResult ? (
        <>
      <h1 className="peripherals-title">Peripherals Overview</h1>

      <div className="peripherals-grid">
        {filteredCards.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              className={`peripherals-card ${cat.color} stagger-item`}
              key={cat.key}
            >
              <div className="peripherals-header">
                <Icon size={26} />
                <h3>{cat.title}</h3>
              </div>

              <p>{cat.total}</p>
              <p>{cat.info1}</p>
              {cat.info2 && <p>{cat.info2}</p>}

              <button
                className="peripherals-btn"
                onClick={() => navigate(cat.path)}
              >
                {cat.button}
              </button>
            </div>
          );
        })}
      </div>
      <section className="section stagger-item">
        <h2 className="section-title">
          Peripherals Stock Availability Percentage
        </h2>

        <div className="bar-list">
          {filteredPeripherals.map((item) => (
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
