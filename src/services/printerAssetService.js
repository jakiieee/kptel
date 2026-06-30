import { createCrudService } from "./createCrudService";

export const PRINTER_STATUSES = [
  { value: "IN USE", badge: "good" },
  { value: "IN STORE", badge: "store" },
  { value: "BROKEN", badge: "broken" },
];

export const defaultPrinterAssets = [
  {
    id: 1,
    entityId: "PRINTER-SITE-24001",
    serialNumber: "X8JX078626",
    type: "EPSON L3250",
    assignTo: "-",
    dept: "MID",
    pic: "Atika",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    entityId: "PRINTER-SITE-24002",
    serialNumber: "X8JX078627",
    type: "EPSON L3250",
    assignTo: "-",
    dept: "MID",
    pic: "Tec.Sup",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 3,
    entityId: "PRINTER-SITE-24003",
    serialNumber: "X8JX078628",
    type: "EPSON L3250",
    assignTo: "-",
    dept: "MID",
    pic: "Harun Alrasyid",
    status: "IN USE",
    badge: "good",
    photo: "",
  },
  {
    id: 4,
    entityId: "PRINTER-SITE-24004",
    serialNumber: "X8JX078629",
    type: "EPSON L3250",
    assignTo: "-",
    dept: "MID",
    pic: "-",
    status: "IN STORE",
    badge: "store",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /printer-assets
export const printerAssetService = createCrudService("printerAssets", defaultPrinterAssets);
