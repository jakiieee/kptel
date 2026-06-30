import { createCrudService } from "./createCrudService";

export const TABLET_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultTabletAssets = [
  {
    id: 1,
    entityId: "TABLET-SITE-24001",
    serialNumber: "2235360011262",
    charger: "CH-SITE-24001",
    caseItem: "CASE-SITE-24001",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "TABLET-SITE-24002",
    serialNumber: "2235360011263",
    charger: "CH-SITE-24002",
    caseItem: "CASE-SITE-24002",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 3,
    entityId: "TABLET-SITE-24003",
    serialNumber: "2235360011264",
    charger: "CH-SITE-24003",
    caseItem: "CASE-SITE-24003",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
  {
    id: 4,
    entityId: "TABLET-SITE-24004",
    serialNumber: "2235360011265",
    charger: "CH-SITE-24004",
    caseItem: "CASE-SITE-24004",
    status: "BROKEN",
    badge: "broken",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /tablet-assets
export const tabletAssetService = createCrudService("tabletAssets", defaultTabletAssets);
