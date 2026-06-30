import { createCrudService } from "./createCrudService";

export const KEYBOARD_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultKeyboardAssets = [
  {
    id: 1,
    entityId: "KYB-SITE-23001",
    serialNumber: "CN00FRXWPRC0033A00AN",
    assignTo: "Candra Marita Sari",
    dept: "END",
    pcName: "TEL-PC-20063",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "KYB-SITE-23002",
    serialNumber: "CN00FRXWPRC0033A00AO",
    assignTo: "Candra Marita Sari",
    dept: "END",
    pcName: "TEL-PC-20064",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 3,
    entityId: "KYB-SITE-23003",
    serialNumber: "CN00FRXWPRC0033A00AP",
    assignTo: "Candra Marita Sari",
    dept: "END",
    pcName: "TEL-PC-20065",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 4,
    entityId: "KYB-SITE-23004",
    serialNumber: "CN00FRXWPRC0033A00AQ",
    assignTo: "Candra Marita Sari",
    dept: "END",
    pcName: "TEL-PC-20066",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /keyboard-assets
export const keyboardAssetService = createCrudService("keyboardAssets", defaultKeyboardAssets);
