/**
 * createCrudService.js
 * ------------------------------------------------------------------
 * Factory untuk membuat service CRUD (list/create/update/delete) yang
 * polanya sama untuk semua resource (PC, SSD, HDD, Flashdisk, Health).
 *
 * MODE SAAT INI: mock (localStorage), supaya halaman tetap bisa
 * dipakai sebelum backend tersedia.
 *
 * --------------------------------------------------------------
 * CARA SAMBUNGKAN KE BACKEND ASLI:
 * Di bagian function yang ditandai // TODO: BACKEND, ganti isinya
 * dengan panggilan apiClient, contoh untuk resource "pc-assets":
 *
 *   list:   () => apiClient.get('/pc-assets'),
 *   create: (payload) => apiClient.post('/pc-assets', payload),
 *   update: (id, payload) => apiClient.put(`/pc-assets/${id}`, payload),
 *   remove: (id) => apiClient.del(`/pc-assets/${id}`),
 * --------------------------------------------------------------
 */
import { delay, loadCollection, saveCollection, generateId } from "./mock/mockStore";

export function createCrudService(storageKey, defaultData) {
  return {
    async list() {
      // TODO: BACKEND -> return apiClient.get(`/${storageKey}`);
      await delay();
      return loadCollection(storageKey, defaultData);
    },

    async create(payload) {
      // TODO: BACKEND -> return apiClient.post(`/${storageKey}`, payload);
      await delay();
      const items = loadCollection(storageKey, defaultData);
      const newItem = { ...payload, id: generateId() };
      const next = [...items, newItem];
      saveCollection(storageKey, next);
      return newItem;
    },

    async update(id, payload) {
      // TODO: BACKEND -> return apiClient.put(`/${storageKey}/${id}`, payload);
      await delay();
      const items = loadCollection(storageKey, defaultData);
      const next = items.map((item) =>
        item.id === id ? { ...item, ...payload, id } : item
      );
      saveCollection(storageKey, next);
      return next.find((item) => item.id === id);
    },

    async remove(id) {
      // TODO: BACKEND -> return apiClient.del(`/${storageKey}/${id}`);
      await delay();
      const items = loadCollection(storageKey, defaultData);
      const next = items.filter((item) => item.id !== id);
      saveCollection(storageKey, next);
      return { success: true };
    },
  };
}
