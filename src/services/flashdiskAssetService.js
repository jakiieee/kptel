import { createCrudService } from "./createCrudService";

export const FLASHDISK_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
];

export const defaultFlashdiskAssets = [
  {
    id: 1,
    entityId: "FD-SITE-24001",
    serialNumber: "FD001",
    device: "Multiport USB/FD",
    allocation: "Server Room",
    dept: "MID",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 2,
    entityId: "FD-SITE-24002",
    serialNumber: "FD002",
    device: "Flashdisk 32GB",
    allocation: "Workshop",
    dept: "EQD",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 3,
    entityId: "FD-SITE-24003",
    serialNumber: "FD003",
    device: "Flashdisk 64GB",
    allocation: "Server Room",
    dept: "MID",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /flashdisk-assets
export const flashdiskAssetService = createCrudService(
  "flashdiskAssets",
  defaultFlashdiskAssets
);
