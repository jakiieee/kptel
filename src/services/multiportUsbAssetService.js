import { createCrudService } from "./createCrudService";

export const MULTIPORTUSB_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "NULL", badge: "null" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultMultiportUsbAssets = [
  {
    id: 1,
    entityId: "PortUSB-SITE-24001",
    serialNumber: "S6P2NL0TB23911",
    assignTo: "Nelson Malau",
    dept: "GMM",
    entity: "TEL-NB-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "PortUSB-SITE-24002",
    serialNumber: "S6P2NL0TB23908",
    assignTo: "Server Room",
    dept: "MID",
    entity: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /multiport-usb-assets
export const multiportUsbAssetService = createCrudService(
  "multiportUsbAssets",
  defaultMultiportUsbAssets
);
