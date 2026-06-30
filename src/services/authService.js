import { delay } from "./mock/mockStore";

/**
 * authService.js
 * ------------------------------------------------------------------
 * Saat ini login/register/forgot-password belum tersambung ke backend
 * apa pun (sebelumnya tombol "Sign In" / "Create Account" di kode lama
 * hanya berupa <Link to="/dashboard">, tidak ada validasi maupun
 * pengecekan kredensial). Di sini disiapkan struktur service supaya
 * tinggal diisi saat backend auth tersedia.
 * ------------------------------------------------------------------
 */
export const authService = {
  async login({ email, password }) {
    // TODO: BACKEND -> return apiClient.post('/auth/login', { email, password });
    await delay();
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    return { token: "mock-token", user: { name: "Adam", email } };
  },

  async register({ fullName, email, password }) {
    // TODO: BACKEND -> return apiClient.post('/auth/register', { fullName, email, password });
    await delay();
    if (!fullName || !email || !password) {
      throw new Error("All fields are required.");
    }
    return { token: "mock-token", user: { name: fullName, email } };
  },

  async sendResetLink({ email }) {
    // TODO: BACKEND -> return apiClient.post('/auth/forgot-password', { email });
    await delay();
    return { success: true };
  },

  async resetPassword({ email, password }) {
    // TODO: BACKEND -> return apiClient.post('/auth/reset-password', { email, password });
    await delay();
    return { success: true };
  },
};
