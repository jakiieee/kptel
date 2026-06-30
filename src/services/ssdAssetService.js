import { createCrudService } from "./createCrudService";

export const SSD_YEARS = ["2022", "2023", "2024", "2025", "2026"];

export const SSD_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultSsdAssets = [
  {
    id: 1,
    entityId: "SSD-SITE-23001",
    serialNumber: "S6P2NL0TB23911",
    assignTo: "PC CLINIC",
    dept: "EQD",
    pcName: "TEL-PC-14131",
    type: "SSD 2.5 (250GB)",
    status: "IN USE",
    badge: "good",
    year: "2023",
    photo: "",
  },
  {
    id: 2,
    entityId: "SSD-SITE-23002",
    serialNumber: "S6P2NL0TB23908",
    assignTo: "PC DEV TS OLD",
    dept: "MID",
    pcName: "TEL-PC-14078",
    type: "SSD 2.5 (250GB)",
    status: "IN USE",
    badge: "good",
    year: "2023",
    photo: "",
  },
  {
    id: 3,
    entityId: "SSD-SITE-23003",
    serialNumber: "S6P2NL0TB23907",
    assignTo: "STORE ROOM",
    dept: "MID",
    pcName: "-",
    type: "SSD 1TB",
    status: "BROKEN",
    badge: "broken",
    year: "2024",
    photo: "",
  },
  {
    id: 4,
    entityId: "SSD-SITE-23004",
    serialNumber: "S6P2NL0TB23906",
    assignTo: "STORE ROOM",
    dept: "MID",
    pcName: "-",
    type: "SSD 512GB",
    status: "IN STORE",
    badge: "store",
    year: "2025",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /ssd-assets
export const ssdAssetService = createCrudService("ssdAssets", defaultSsdAssets);
