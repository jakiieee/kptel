import { createCrudService } from "./createCrudService";

export const NETWORKPORT_MANUFACTURERS = ["Netviel", "Cisco", "Huawei", "TP-Link", "Mikrotik", "Other"];
export const NETWORKPORT_PORTS = [4, 8, 12, 16, 24, 48];
export const NETWORKPORT_YEARS = ["2022", "2023", "2024", "2025", "2026"];

export const defaultNetworkPortAssets = [
  {
    id: 1,
    entityId: "Converter-Site-24001",
    serialNumber: "202409200289",
    mac: "-",
    manufactur: "Netviel",
    port: 16,
    year: "2025",
    photo: "",
  },
  {
    id: 2,
    entityId: "Converter-Site-24002",
    serialNumber: "202409200290",
    mac: "845A3E512152",
    manufactur: "Netviel",
    port: 8,
    year: "2025",
    photo: "",
  },
  {
    id: 3,
    entityId: "Converter-Site-24003",
    serialNumber: "202409200291",
    mac: "845A3E512153",
    manufactur: "Cisco",
    port: 16,
    year: "2025",
    photo: "",
  },
  {
    id: 4,
    entityId: "Converter-Site-24004",
    serialNumber: "202409200292",
    mac: "845A3E512154",
    manufactur: "Cisco",
    port: 16,
    year: "2024",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /network-port-assets
export const networkPortAssetService = createCrudService(
  "networkPortAssets",
  defaultNetworkPortAssets
);
