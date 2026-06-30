import { createCrudService } from "./createCrudService";

export const CAST_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultCastAssets = [
  {
    id: 1,
    entityId: "SSD-SITE-23001",
    serialNumber: "S6P2NL0TB23911",
    assignTo: "Server Room",
    dept: "MID",
    entity: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 2,
    entityId: "SSD-SITE-23002",
    serialNumber: "S6P2NL0TB23908",
    assignTo: "HDD/NAS",
    dept: "MID",
    entity: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 3,
    entityId: "SSD-SITE-23003",
    serialNumber: "S6P2NL0TB23909",
    assignTo: "Room 39",
    dept: "MID",
    entity: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /cast-assets
export const castAssetService = createCrudService("castAssets", defaultCastAssets);
