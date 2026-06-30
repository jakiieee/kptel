import { createCrudService } from "./createCrudService";

export const DONGLEWIFI_YEARS = ["2022", "2023", "2024", "2025", "2026"];

export const DONGLEWIFI_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultDongleWifiAssets = [
  {
    id: 1,
    entityId: "WL-SITE-24001",
    serialNumber: "2235360011262",
    dept: "-",
    pic: "-",
    type: "-",
    size: "-",
    status: "IN USE",
    badge: "good",
    year: "2024",
    photo: "",
  },
  {
    id: 2,
    entityId: "WL-SITE-24002",
    serialNumber: "2235360011263",
    dept: "-",
    pic: "-",
    type: "-",
    size: "-",
    status: "IN STORE",
    badge: "store",
    year: "2024",
    photo: "",
  },
  {
    id: 3,
    entityId: "WL-SITE-24003",
    serialNumber: "2235360011264",
    dept: "-",
    pic: "-",
    type: "-",
    size: "-",
    status: "IN STORE",
    badge: "store",
    year: "2025",
    photo: "",
  },
  {
    id: 4,
    entityId: "WL-SITE-24004",
    serialNumber: "2235360011265",
    dept: "-",
    pic: "-",
    type: "-",
    size: "-",
    status: "IN STORE",
    badge: "store",
    year: "2025",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /donglewifi-assets
export const dongleWifiAssetService = createCrudService(
  "dongleWifiAssets",
  defaultDongleWifiAssets
);
