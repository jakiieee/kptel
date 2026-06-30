import { createCrudService } from "./createCrudService";

export const RAM_YEARS = ["2022", "2023", "2024", "2025", "2026"];

export const RAM_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultRamAssets = [
  {
    id: 1,
    entityId: "SSD-SITE-23001",
    serialNumber: "RAM-SITE-25011",
    type: "longdim",
    size: "8GB",
    type2: "DDR4",
    speed: "3200Mhz",
    brand: "Kingston",
    assignTo: "Server Room",
    dept: "MID",
    entityPc: "TEL-NB-2000",
    status: "IN USE",
    badge: "good",
    year: "2025",
    photo: "",
  },
  {
    id: 2,
    entityId: "SSD-SITE-23001",
    serialNumber: "RAM-SITE-25011",
    type: "longdim",
    size: "8GB",
    type2: "DDR4",
    speed: "3200Mhz",
    brand: "Kingston",
    assignTo: "Server Room",
    dept: "MID",
    entityPc: "TEL-NB-2000",
    status: "IN STORE",
    badge: "store",
    year: "2025",
    photo: "",
  },
  {
    id: 3,
    entityId: "SSD-SITE-23001",
    serialNumber: "RAM-SITE-25011",
    type: "longdim",
    size: "8GB",
    type2: "DDR4",
    speed: "3200Mhz",
    brand: "Kingston",
    assignTo: "Server Room",
    dept: "MID",
    entityPc: "TEL-NB-2000",
    status: "BROKEN",
    badge: "broken",
    year: "2024",
    photo: "",
  },
  {
    id: 4,
    entityId: "SSD-SITE-23001",
    serialNumber: "RAM-SITE-25011",
    type: "longdim",
    size: "8GB",
    type2: "DDR4",
    speed: "3200Mhz",
    brand: "Kingston",
    assignTo: "Server Room",
    dept: "MID",
    entityPc: "TEL-NB-2000",
    status: "IN USE",
    badge: "good",
    year: "2024",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /ram-assets
export const ramAssetService = createCrudService("ramAssets", defaultRamAssets);
