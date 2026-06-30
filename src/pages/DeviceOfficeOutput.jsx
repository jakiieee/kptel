import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tablet as TabletIcon, Cast as CastIcon, Printer as PrinterIcon, BatteryCharging } from "lucide-react";
import "../styles/deviceofficeoutput.css";
import PageHeader from "../components/PageHeader";
import { tabletAssetService } from "../services/tabletAssetService";
import { castAssetService } from "../services/castAssetService";
import { printerAssetService } from "../services/printerAssetService";
import { upsAssetService } from "../services/upsAssetService";

export default function DeviceOfficeOutput() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState({ tablet: 0, cast: 0, printer: 0, ups: 0 });

  useEffect(() => {
    let isMounted = true;
    async function loadCounts() {
      const [tablet, cast, printer, ups] = await Promise.all([
        tabletAssetService.list(),
        castAssetService.list(),
        printerAssetService.list(),
        upsAssetService.list(),
      ]);
      if (isMounted) {
        setCounts({
          tablet: tablet.length,
          cast: cast.length,
          printer: printer.length,
          ups: ups.length,
        });
      }
    }
    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { key: "tablet", label: "Tablet", icon: TabletIcon, path: "/deviceofficeoutput/tablet" },
    { key: "cast", label: "Cast Device", icon: CastIcon, path: "/deviceofficeoutput/cast" },
    { key: "printer", label: "Printer", icon: PrinterIcon, path: "/deviceofficeoutput/printer" },
    { key: "ups", label: "UPS", icon: BatteryCharging, path: "/deviceofficeoutput/ups" },
  ];

  return (
    <>
      <PageHeader
        search={search}
        onSearchChange={setSearch}
        placeholder="Search Office Output Device..."
      />

      <h1 className="device-title">Device Office Output Overview</h1>

      <div className="device-overview-grid">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div className="device-card stagger-item" key={cat.key}>
              <div className="device-card-header">
                <Icon size={26} />
                <h3>{cat.label}</h3>
              </div>
              <p>{counts[cat.key]} Asset Tercatat</p>
              <button className="device-btn" onClick={() => navigate(cat.path)}>
                Manage {cat.label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
