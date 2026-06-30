import { createCrudService } from "./createCrudService";

export const PC_CONDITIONS = ["Good", "Broken"];

export const PC_LOCATIONS = ["Workshop", "Room 32", "Room 33"];

export const defaultPcAssets = [
  {
    id: 1,
    entityId: "17079",
    deviceType: "PC/Workstation",
    condition: "Good",
    location: "Workshop",
    lastCheck: "2024-02-21",
    photo: "",
  },
  {
    id: 2,
    entityId: "14119",
    deviceType: "PC/Workstation",
    condition: "Good",
    location: "Workshop",
    lastCheck: "2024-02-21",
    photo: "",
  },
  {
    id: 3,
    entityId: "14145",
    deviceType: "PC/Workstation",
    condition: "Broken",
    location: "Room 32",
    lastCheck: "2024-02-21",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /pc-assets
export const pcAssetService = createCrudService("pcAssets", defaultPcAssets);
