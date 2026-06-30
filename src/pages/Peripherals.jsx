import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Keyboard as KeyboardIcon,
  Layers,
  Camera,
  Headphones,
  Usb,
  Cable,
} from "lucide-react";
import "../styles/peripherals.css";
import PageHeader from "../components/PageHeader";
import { keyboardAssetService } from "../services/keyboardAssetService";
import { comboAssetService } from "../services/comboAssetService";
import { webcamAssetService } from "../services/webcamAssetService";
import { headphoneAssetService } from "../services/headphoneAssetService";
import { multiportUsbAssetService } from "../services/multiportUsbAssetService";
import { hdmiPortAssetService } from "../services/hdmiPortAssetService";

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
  });

  useEffect(() => {
    let isMounted = true;
    async function loadCounts() {
      const [keyboard, combo, webcam, headphone, usb, hdmi] = await Promise.all([
        keyboardAssetService.list(),
        comboAssetService.list(),
        webcamAssetService.list(),
        headphoneAssetService.list(),
        multiportUsbAssetService.list(),
        hdmiPortAssetService.list(),
      ]);
      if (isMounted) {
        setCounts({
          keyboard: keyboard.length,
          combo: combo.length,
          webcam: webcam.length,
          headphone: headphone.length,
          multiportUsb: usb.length,
          hdmiPort: hdmi.length,
        });
      }
    }
    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { key: "keyboard", label: "Keyboard", icon: KeyboardIcon, path: "/peripherals/keyboard" },
    { key: "combo", label: "Combo Device", icon: Layers, path: "/peripherals/combo" },
    { key: "webcam", label: "Webcam", icon: Camera, path: "/peripherals/webcam" },
    { key: "headphone", label: "Headphone", icon: Headphones, path: "/peripherals/headphone" },
    { key: "multiportUsb", label: "Multiport USB", icon: Usb, path: "/peripherals/multiport-usb" },
    { key: "hdmiPort", label: "HDMI Port", icon: Cable, path: "/peripherals/hdmi-port" },
  ];

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Peripherals..." />

      <h1 className="peripherals-title">Peripherals Overview</h1>

      <div className="peripherals-grid">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div className="peripherals-card stagger-item" key={cat.key}>
              <div className="peripherals-header">
                <Icon size={26} />
                <h3>{cat.label}</h3>
              </div>
              <p>{counts[cat.key]} Asset Tercatat</p>
              <button className="peripherals-btn" onClick={() => navigate(cat.path)}>
                Manage {cat.label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
