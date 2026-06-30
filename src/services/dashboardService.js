import { delay, loadCollection, saveCollection } from "./mock/mockStore";

const LOW_STOCK_KEY = "dashboardLowStock";
const ACTIVITIES_KEY = "dashboardActivities";

export const defaultSummaryCards = [
  { label: "Low Stock", value: "4 Item", color: "#e53935" },
  { label: "Device in Use", value: "842 Pcs", color: "#f5a623" },
  { label: "Total Item", value: "1,240 pcs", color: "#43a047" },
  { label: "History", value: "14:00", color: "#1e88e5" },
];

export const defaultCategoryBars = [
  { label: "Storage Management", pct: 65 },
  { label: "Hardware & Components", pct: 40 },
  { label: "Network Infrastructure", pct: 50 },
  { label: "Peripherals & Accessories", pct: 80 },
  { label: "Devices & Office Output", pct: 25 },
];

export const defaultActivities = [
  {
    id: 1,
    type: "Updated",
    color: "#43a047",
    text: "SSD 2023 | Admin changed stock qty | 5 mints ago",
  },
  {
    id: 2,
    type: "Created",
    color: "#f5a623",
    text: "RAM 2024 | Add 10 new unit | 10 mints ago",
  },
  {
    id: 3,
    type: "Deleted",
    color: "#e53935",
    text: "Headphone 2023 | Remove broken unit (S/N: 059) | 5 mints ago",
  },
];

export const defaultLowStock = [
  { id: 1, name: "Dongle Wi-Fi 2024", sisa: "1 pcs", qty: 1 },
  { id: 2, name: "Laptop Battery 2024", sisa: "0 pcs", qty: 0 },
  { id: 3, name: "HDMI Port 2024", sisa: "2 pcs", qty: 2 },
  { id: 4, name: "SSD 2025", sisa: "1 pcs", qty: 1 },
];

export const dashboardService = {
  async getSummary() {
    // TODO: BACKEND -> return apiClient.get('/dashboard/summary');
    await delay();
    return defaultSummaryCards;
  },

  async getCategoryBars() {
    // TODO: BACKEND -> return apiClient.get('/dashboard/category-distribution');
    await delay();
    return defaultCategoryBars;
  },

  async getActivities() {
    // TODO: BACKEND -> return apiClient.get('/dashboard/activities');
    await delay();
    return loadCollection(ACTIVITIES_KEY, defaultActivities);
  },

  async getLowStock() {
    // TODO: BACKEND -> return apiClient.get('/dashboard/low-stock');
    await delay();
    return loadCollection(LOW_STOCK_KEY, defaultLowStock);
  },

  /**
   * Restock satu item low-stock sebanyak `qty`.
   * Backend asli sebaiknya menyediakan endpoint khusus, contoh:
   *   POST /inventory/:itemId/restock  { qty }
   */
  async restockItem(itemId, qty) {
    // TODO: BACKEND -> return apiClient.post(`/inventory/${itemId}/restock`, { qty });
    await delay();
    const items = loadCollection(LOW_STOCK_KEY, defaultLowStock);
    const next = items.map((item) =>
      item.id === itemId
        ? { ...item, qty: item.qty + qty, sisa: `${item.qty + qty} pcs` }
        : item
    );
    saveCollection(LOW_STOCK_KEY, next);
    return next.find((item) => item.id === itemId);
  },

  /**
   * Tambah asset baru dari modal "Add New Asset" di Dashboard.
   */
  async addAsset(payload) {
    // TODO: BACKEND -> return apiClient.post('/assets', payload);
    await delay();
    const activities = loadCollection(ACTIVITIES_KEY, defaultActivities);
    const newActivity = {
      id: Date.now(),
      type: "Created",
      color: "#f5a623",
      text: `${payload.name} | Added via Dashboard | just now`,
    };
    saveCollection(ACTIVITIES_KEY, [newActivity, ...activities]);
    return { success: true };
  },
};
