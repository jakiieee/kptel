import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, Network as NetworkIcon, Router, Mouse as MouseIcon } from "lucide-react";
import "../styles/network.css";
import PageHeader from "../components/PageHeader";
import { dongleWifiAssetService } from "../services/dongleWifiAssetService";
import { networkPortAssetService } from "../services/networkPortAssetService";
import { fortiSwitchAssetService } from "../services/fortiSwitchAssetService";
import { mswAssetService } from "../services/mswAssetService";
import { mouseAssetService } from "../services/mouseAssetService";

export default function Network() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState({
    donglewifi: 0,
    port: 0,
    fortiswitch: 0,
    msw: 0,
    mouse: 0,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadCounts() {
      const [dongle, port, forti, msw, mouse] = await Promise.all([
        dongleWifiAssetService.list(),
        networkPortAssetService.list(),
        fortiSwitchAssetService.list(),
        mswAssetService.list(),
        mouseAssetService.list(),
      ]);
      if (isMounted) {
        setCounts({
          donglewifi: dongle.length,
          port: port.length,
          fortiswitch: forti.length,
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
    { key: "donglewifi", label: "Dongle Wi-Fi", icon: Wifi, path: "/network/donglewifi" },
    { key: "port", label: "Network Port", icon: NetworkIcon, path: "/network/port" },
    { key: "fortiswitch", label: "FortiSwitch", icon: Router, path: "/network/fortiswitch" },
    { key: "msw", label: "Mouse Wireless (MSW)", icon: MouseIcon, path: "/network/msw" },
    { key: "mouse", label: "Mouse", icon: MouseIcon, path: "/network/mouse" },
  ];

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Network..." />

      <h1 className="dash-title">Network Overview</h1>

      <div className="network-overview-grid">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div className="network-card stagger-item" key={cat.key}>
              <div className="network-card-header">
                <Icon size={26} />
                <h3>{cat.label}</h3>
              </div>
              <p>{counts[cat.key]} Asset Tercatat</p>
              <button className="network-btn" onClick={() => navigate(cat.path)}>
                Manage {cat.label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
