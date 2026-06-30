import { createCrudService } from "./createCrudService";

export const HEALTH_MONTHS = [
  "All Month",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const HEALTH_STATUSES = [
  { value: "VERY GOOD", badge: "good" },
  { value: "GOOD", badge: "warning" },
  { value: "VERY BAD", badge: "broken" },
];

export const defaultHealthReports = [
  {
    id: 1,
    employee: "RAHMADI",
    dept: "CWD",
    pmDate: "2025-04-03",
    month: "April",
    deviceId: "TEL-PC-17020",
    deviceType: "PC 7040",
    health: "92%",
    type: "2'5",
    status: "VERY GOOD",
    badge: "good",
    photo: "",
  },
  {
    id: 2,
    employee: "REIHARD S.",
    dept: "EGD",
    pmDate: "2025-04-04",
    month: "April",
    deviceId: "TEL-PC-17025",
    deviceType: "PC 7040",
    health: "33%",
    type: "2'5",
    status: "VERY BAD",
    badge: "broken",
    photo: "",
  },
  {
    id: 3,
    employee: "ADAM",
    dept: "MID",
    pmDate: "2025-05-20",
    month: "May",
    deviceId: "TEL-PC-17030",
    deviceType: "PC 7050",
    health: "85%",
    type: "2'5",
    status: "GOOD",
    badge: "warning",
    photo: "",
  },
];

// TODO: BACKEND - resource path final di backend, contoh: GET/POST /health-reports
export const healthReportService = createCrudService(
  "healthReports",
  defaultHealthReports
);
