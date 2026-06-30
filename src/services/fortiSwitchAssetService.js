import { createCrudService } from "./createCrudService";

export const FORTISWITCH_MANUFACTURERS = ["DELL", "Cisco", "Fortinet", "Huawei", "Other"];

export const FORTISWITCH_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultFortiSwitchAssets = [
  {
    id: 1,
    entityId: "MSW-SITE-25001",
    serialNumber: "2235360011262",
    manufactur: "DELL",
    location: "-",
    type: "FortiSwitch",
    status: "IN STORE",
    badge: "store",
    size: "-",
    photo: "",
  },
  {
    id: 2,
    entityId: "MSW-SITE-25002",
    serialNumber: "2235360011263",
    manufactur: "DELL",
    location: "-",
    type: "FortiSwitch",
    status: "IN USE",
    badge: "good",
    size: "-",
    photo: "",
  },
  {
    id: 3,
    entityId: "MSW-SITE-25003",
    serialNumber: "2235360011264",
    manufactur: "DELL",
    location: "-",
    type: "FortiSwitch",
    status: "IN STORE",
    badge: "store",
    size: "-",
    photo: "",
  },
  {
    id: 4,
    entityId: "MSW-SITE-25004",
    serialNumber: "2235360011265",
    manufactur: "DELL",
    location: "-",
    type: "FortiSwitch",
    status: "IN STORE",
    badge: "store",
    size: "-",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /fortiswitch-assets
export const fortiSwitchAssetService = createCrudService(
  "fortiSwitchAssets",
  defaultFortiSwitchAssets
);
