import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryStick, BatteryCharging } from "lucide-react";
import "../styles/hardware.css";
import PageHeader from "../components/PageHeader";
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

  return (
    <>
      <PageHeader search={search} onSearchChange={setSearch} placeholder="Search Hardware..." />

      <h1 className="hw-title">Hardware Overview</h1>

      <div className="hw-overview-grid">
        <div className="hw-card hw-card-blue stagger-item">
          <div className="hw-card-header">
            <MemoryStick size={26} />
            <h3>RAM Inventory</h3>
          </div>
          <p>{ramCount} Asset Tercatat</p>
          <button className="hw-btn" onClick={() => navigate("/hardware/ram")}>
            Manage RAM
          </button>
        </div>

        <div className="hw-card hw-card-yellow stagger-item">
          <div className="hw-card-header">
            <BatteryCharging size={26} />
            <h3>Battery NB Inventory</h3>
          </div>
          <p>{batteryCount} Asset Tercatat</p>
          <button className="hw-btn" onClick={() => navigate("/hardware/battery")}>
            Manage Battery
          </button>
        </div>
      </div>
    </>
  );
}
