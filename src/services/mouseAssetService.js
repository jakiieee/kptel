import { createCrudService } from "./createCrudService";

export const defaultMouseAssets = [
  {
    id: 1,
    entityId: "MS-SITE-25001",
    serialNumber: "CN0RWN6PLO30047P0226",
    photo: "",
  },
  {
    id: 2,
    entityId: "MS-SITE-25002",
    serialNumber: "2235360011262",
    photo: "",
  },
  {
    id: 3,
    entityId: "MS-SITE-25003",
    serialNumber: "2235360011263",
    photo: "",
  },
  {
    id: 4,
    entityId: "MS-SITE-25004",
    serialNumber: "2235360011264",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /mouse-assets
export const mouseAssetService = createCrudService("mouseAssets", defaultMouseAssets);
