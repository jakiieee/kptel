import { createCrudService } from "./createCrudService";

export const UPS_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultUpsAssets = [
  {
    id: 1,
    entityId: "UPS-SITE-24001",
    serialNumber: "S3S2323X10870",
    capacity: "1.5 KVA",
    assignTo: "Workshop",
    dept: "MID",
    pic: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "UPS-SITE-24002",
    serialNumber: "S3S2323X10871",
    capacity: "1.5 KVA",
    assignTo: "Workshop",
    dept: "MID",
    pic: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 3,
    entityId: "UPS-SITE-24003",
    serialNumber: "S3S2323X10872",
    capacity: "1.5 KVA",
    assignTo: "Workshop",
    dept: "MID",
    pic: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 4,
    entityId: "UPS-SITE-24004",
    serialNumber: "S3S2323X10873",
    capacity: "1.5 KVA",
    assignTo: "Workshop",
    dept: "MID",
    pic: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /ups-assets
export const upsAssetService = createCrudService("upsAssets", defaultUpsAssets);
