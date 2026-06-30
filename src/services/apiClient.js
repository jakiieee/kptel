/**
 * apiClient.js
 * ------------------------------------------------------------------
 * Lapisan HTTP terpusat. Saat ini SEMUA request di-mock (lihat folder
 * src/services/mock) supaya UI bisa langsung dipakai tanpa backend.
 *
 * Cara pasang ke backend sungguhan:
 *  1. Set BASE_URL ke alamat API kamu (atau isi VITE_API_BASE_URL di .env)
 *  2. Di setiap file service (assetService.js, dashboardService.js, dst),
 *     ganti panggilan ke mock dengan panggilan ke salah satu fungsi
 *     di bawah (get/post/put/del). Bagian itu sudah ditandai // TODO: BACKEND
 *  3. Hapus folder src/services/mock jika sudah tidak diperlukan.
 * ------------------------------------------------------------------
 */

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";

function getAuthToken() {
  // TODO: BACKEND - sesuaikan dengan cara penyimpanan token auth kamu
  return localStorage.getItem("authToken");
}

async function request(path, { method = "GET", body, headers } = {}) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {
      // response tidak berupa JSON, biarkan pesan default
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
