import { createCrudService } from "./createCrudService";

export const MSW_MANUFACTURERS = ["DELL", "Logitech", "HP", "Other"];

export const defaultMswAssets = [
  {
    id: 1,
    entityId: "MSW-SITE-25001",
    serialNumber: "2235360011262",
    manufactur: "DELL",
    location: "BOD",
    assignTo: "TEL-NB-25001",
    username: "NOPERA",
    photo: "",
  },
  {
    id: 2,
    entityId: "MSW-SITE-25002",
    serialNumber: "2235360011263",
    manufactur: "DELL",
    location: "MID",
    assignTo: "TEL-NB-25002",
    username: "Syahrul Akmal",
    photo: "",
  },
  {
    id: 3,
    entityId: "MSW-SITE-25003",
    serialNumber: "2235360011264",
    manufactur: "DELL",
    location: "MID",
    assignTo: "TEL-NB-25003",
    username: "-",
    photo: "",
  },
  {
    id: 4,
    entityId: "MSW-SITE-25004",
    serialNumber: "2235360011265",
    manufactur: "DELL",
    location: "JKT",
    assignTo: "TEL-NB-25004",
    username: "-",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /msw-assets
export const mswAssetService = createCrudService("mswAssets", defaultMswAssets);
