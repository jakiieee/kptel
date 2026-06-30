import { createCrudService } from "./createCrudService";

export const WEBCAM_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultWebcamAssets = [
  {
    id: 1,
    entityId: "Combo-Site-23001",
    serialNumber: "2231MR2995A9",
    manufactur: "Logiteck C31",
    assignTo: "Server Room",
    dept: "MID",
    pcName: "TEL-PC-14099",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "Combo-Site-23002",
    serialNumber: "2231MR2995B0",
    manufactur: "Logiteck C31",
    assignTo: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 3,
    entityId: "Combo-Site-23003",
    serialNumber: "2231MR2995B1",
    manufactur: "Logiteck C31",
    assignTo: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 4,
    entityId: "Combo-Site-23004",
    serialNumber: "2231MR2995B2",
    manufactur: "Logiteck C31",
    assignTo: "Server Room",
    dept: "MID",
    pcName: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /webcam-assets
export const webcamAssetService = createCrudService("webcamAssets", defaultWebcamAssets);
