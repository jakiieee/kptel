import { createCrudService } from "./createCrudService";

export const HDMIPORT_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "NULL", badge: "null" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultHdmiPortAssets = [
  {
    id: 1,
    entityId: "HDMIPort-Site-24001",
    serialNumber: "A1LB-204-0042",
    assignTo: "Server Room",
    dept: "MID",
    pic: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "HDMIPort-Site-24002",
    serialNumber: "A1LB-204-0043",
    assignTo: "Server Room",
    dept: "MID",
    pic: "-",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /hdmi-port-assets
export const hdmiPortAssetService = createCrudService("hdmiPortAssets", defaultHdmiPortAssets);
