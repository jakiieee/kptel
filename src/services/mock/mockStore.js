/**
 * mockStore.js
 * ------------------------------------------------------------------
 * Helper kecil untuk mensimulasikan "database" memakai localStorage,
 * dipakai oleh semua file di src/services/mock/*.
 * Tujuannya: supaya halaman tetap berfungsi (data tersimpan antar
 * reload) selagi backend asli belum tersedia.
 *
 * Setelah backend siap, file-file di src/services/mock TIDAK lagi
 * dipakai — cukup hapus pemanggilannya dari masing-masing *Service.js.
 * ------------------------------------------------------------------
 */

const DELAY_MS = 250;

export function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function loadCollection(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [...fallback];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...fallback];
  } catch {
    return [...fallback];
  }
}

export function saveCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
