import { createCrudService } from "./createCrudService";

export const HDD_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
];

export const defaultHddAssets = [
  {
    id: 1,
    entityId: "HDD-SITE-23001",
    serialNumber: "S6P2NL0TB23911",
    type: "HDD/NAS",
    capacity: "4 TB",
    location: "Server Room",
    dept: "MID",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "HDD-SITE-23002",
    serialNumber: "S6P2NL0TB23908",
    type: "HDD/NAS",
    capacity: "4 TB",
    location: "Server Room",
    dept: "MID",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 3,
    entityId: "HDD-SITE-23003",
    serialNumber: "S6P2NL0TB23909",
    type: "HDD/NAS",
    capacity: "2 TB",
    location: "Storage",
    dept: "MID",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /hdd-assets
export const hddAssetService = createCrudService("hddAssets", defaultHddAssets);
