import { createCrudService } from "./createCrudService";

export const COMBO_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "NULL", badge: "null" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultComboAssets = [
  {
    id: 1,
    entityId: "Combo-Site-23001",
    serialNumber: "2231MR2995A9",
    assignTo: "Room 39",
    dept: "MID",
    pcName: "-",
    status: "NULL",
    badge: "null",
    photo: "",
  },
  {
    id: 2,
    entityId: "Combo-Site-23002",
    serialNumber: "2231MR2995B0",
    assignTo: "Room 39",
    dept: "MID",
    pcName: "-",
    status: "NULL",
    badge: "null",
    photo: "",
  },
  {
    id: 3,
    entityId: "Combo-Site-23003",
    serialNumber: "2231MR2995B1",
    assignTo: "Room 39",
    dept: "MID",
    pcName: "-",
    status: "NULL",
    badge: "null",
    photo: "",
  },
  {
    id: 4,
    entityId: "Combo-Site-23004",
    serialNumber: "2231MR2995B2",
    assignTo: "Room 39",
    dept: "MID",
    pcName: "-",
    status: "NULL",
    badge: "null",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /combo-assets
export const comboAssetService = createCrudService("comboAssets", defaultComboAssets);
