import { createCrudService } from "./createCrudService";

export const BATTERY_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultBatteryAssets = [
  {
    id: 1,
    entityId: "Batre-Site-24001",
    serialNumber: "CN0DM3WCSLW0021L80FEA10",
    capacity: "60Wh",
    location: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 2,
    entityId: "Batre-Site-24002",
    serialNumber: "CN0DM3WCSLW0021L80FEA11",
    capacity: "60Wh",
    location: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 3,
    entityId: "Batre-Site-24003",
    serialNumber: "CN0DM3WCSLW0021L80FEA12",
    capacity: "60Wh",
    location: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 4,
    entityId: "Batre-Site-24004",
    serialNumber: "CN0DM3WCSLW0021L80FEA13",
    capacity: "60Wh",
    location: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /battery-assets
export const batteryAssetService = createCrudService("batteryAssets", defaultBatteryAssets);
