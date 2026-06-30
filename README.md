# Ringkasan Perbaikan Kode — Telventory Systems

## 1. Struktur Proyek (lengkap, setelah perapian menyeluruh)
```
src/
  context/
    AuthContext.jsx          -> menyimpan data user yang login (nama, email, token);
                                 dipakai PageHeader, Sidebar, Admin agar tidak hardcode lagi
  components/
    PageHeader.jsx            -> search bar + info user (otomatis ambil dari AuthContext)
    NotFoundState.jsx         -> tampilan "Not Found" generik
    ConfirmDeleteModal.jsx    -> modal konfirmasi hapus (pengganti window.confirm)
    PhotoViewModal.jsx        -> modal "Lihat" -> menampilkan FOTO asset yang dipilih
    PhotoUploadField.jsx      -> input upload foto (dipakai di semua form Add/Edit)
    ProtectedRoute.jsx        -> guard: halaman dashboard hanya bisa diakses setelah login
    Sidebar.jsx
  pages/
    Dashboard, ListPC, Storage (+SSD/HDD/Flashdisk/Health)
    Hardware (+RAM/Battery)
    Network (+DongleWIFI/Port/FortiSwitch/MSW/Mouse)
    Peripherals (+Keyboard/Combo/Webcam/Headphone/MultiportUSB/HDMIPort)
    DeviceOfficeOutput (+Tablet/Cast/Printer/UPS)
    Admin, Login, Register, ForgotPassword
  services/
    apiClient.js              -> HTTP client terpusat, siap pasang ke backend
    createCrudService.js      -> factory CRUD generik (list/create/update/remove)
    authService.js            -> login/register/forgot-password (mengembalikan {token, user})
    dashboardService.js       -> summary, low stock, restock
    xxxAssetService.js        -> satu file service per kategori asset (RAM, SSD, HDD, dst),
                                  semuanya melalui createCrudService + field `photo`
    mock/mockStore.js         -> helper localStorage (mode "mock" sebelum backend siap)
  styles/
    animations.css            -> animasi terpusat (page transition, hover, stagger, dll)
    (file lain tidak diubah strukturnya, hanya ditambah beberapa class yang sebelumnya
     dipanggil di JSX tapi belum ada definisinya)
```

## 2. Login & Akun yang Sedang Login
- `AuthContext` menyimpan user hasil login/register ke memori + localStorage (`authUser`,
  `authToken`). Nama & email di pojok kanan atas (`PageHeader`) dan di halaman Admin sekarang
  **selalu mengikuti akun yang sedang login**, bukan lagi teks statis "Adam / userr123@gmail.com".
- Halaman dashboard (semua menu di Sidebar) sekarang dilindungi `ProtectedRoute`: kalau belum
  login, otomatis diarahkan ke halaman Login.
- Logout (tombol di Sidebar) benar-benar membersihkan sesi (`AuthContext.logout()`), bukan cuma
  pindah halaman.

## 3. Cara menyambungkan ke backend asli
Semua data lewat **service layer**, bukan langsung di komponen. Untuk pasang backend:

1. Buka file service terkait (misal `src/services/ramAssetService.js`).
2. Di `createCrudService.js`, setiap fungsi (`list`, `create`, `update`, `remove`) punya komentar
   `// TODO: BACKEND -> ...` yang menunjukkan endpoint `apiClient` yang perlu diaktifkan.
3. Set `VITE_API_BASE_URL` di file `.env` agar `apiClient.js` mengarah ke backend kamu.
4. Untuk upload foto (`PhotoUploadField.jsx`), saat ini foto disimpan sebagai base64 langsung di
   data asset (mode mock). Saat backend siap, ganti logic `FileReader` di komponen itu dengan
   upload `FormData` ke endpoint upload, lalu simpan URL hasil upload ke field `photo`.
5. Auth (`authService.js`) dan dashboard (`dashboardService.js`) memakai pola yang sama —
   cari komentar `// TODO: BACKEND`.
6. Setelah backend terhubung sepenuhnya, folder `src/services/mock` bisa dihapus.

Komponen halaman **tidak perlu diubah** saat migrasi ke backend karena hanya memanggil
`xxxService.list()/create()/update()/remove()` — detail implementasi (mock atau API asli)
disembunyikan di balik service.

## 4. Fitur baru / yang diselesaikan
- **Restock (Dashboard)**: tombol "Restock" pada Low Stock Alert membuka popup input jumlah,
  lalu memanggil `dashboardService.restockItem()` dan memperbarui angka stok secara langsung.
- **Foto Asset**: setiap kategori asset (RAM, SSD, HDD, Flashdisk, Network, Peripherals,
  Device Office Output, dst) sekarang punya field `photo`. Form Add/Edit punya komponen upload
  foto, dan tombol "Lihat" (mata) membuka popup yang **menampilkan foto** asset tersebut.
- **Action View / Edit / Delete** ditambahkan secara konsisten di **seluruh 23 halaman tabel**
  (sebelumnya hanya 5 halaman Storage yang berfungsi; 18 halaman lain — Hardware, Network,
  Peripherals, Device Office Output — tombolnya ada tapi tidak melakukan apa pun):
  - **View** -> popup menampilkan foto asset (`PhotoViewModal`).
  - **Edit** -> modal form yang sama dengan "Add", terisi data existing.
  - **Delete** -> modal konfirmasi (`ConfirmDeleteModal`), bukan `window.confirm()` bawaan browser.
- **Halaman Overview** (Hardware, Network, Peripherals, Device Office Output) sekarang menampilkan
  jumlah asset **nyata** dari masing-masing service (sebelumnya angka statis/hardcode), dan tombol
  "Manage X" diarahkan ke path yang benar (sebelumnya beberapa path salah ketik dan mengarah ke
  halaman 404).
- **Admin (User Access Management)**: tombol hapus user sekarang memunculkan popup konfirmasi
  (`ConfirmDeleteModal`), bukan langsung menghapus tanpa konfirmasi.
- **Animasi di seluruh halaman**: file `animations.css` baru menambahkan animasi masuk halaman
  (fade + slide saat pindah menu), animasi modal (overlay fade-in), animasi hover pada
  kartu/tombol/baris tabel, dan animasi stagger pada kartu ringkasan/overview — tanpa
  menambah dependency baru (CSS murni, ringan).

## 5. Bug yang diperbaiki
- **PageHeader**: nama & email statis diganti mengikuti akun yang login.
- **ForgotPassword.jsx**: link & tombol "Back to Sign In" mengarah ke `/login` (route yang tidak
  ada), sekarang diarahkan ke `/` (route Login yang benar).
- **Peripherals.jsx / DeviceOfficeOutput.jsx (overview)**: path navigasi "Manage X" tidak cocok
  dengan path route asli di `App.jsx` (mis. `/peripherals/multiport` vs route asli
  `/peripherals/multiport-usb`), menyebabkan halaman 404. Sudah disesuaikan dengan path asli.
- **18 halaman tabel** (HardwareRAM, HardwareBattery, Network*, Peripherals*,
  DeviceOfficeOutput*): tombol Add/View/Edit/Delete sebelumnya tidak terhubung ke state apa pun
  (UI murni tanpa fungsi). Sekarang semuanya terhubung ke service layer masing-masing dengan
  perilaku yang konsisten dengan modul Storage yang sudah baik sebelumnya.
- Wrapper `<div className="dashboard-heading">` kosong (tanpa style) di StorageSSD/HDD/Flashdisk/
  Health dihapus karena tidak diperlukan.
- Beberapa `className` yang dipanggil di JSX tapi tidak punya definisi CSS (`auth-waves`,
  `register-left` yang redundan) sudah diberi style atau dirapikan.

## 6. Pembersihan kode
- `DetailViewModal.jsx` dihapus karena sudah digantikan sepenuhnya oleh `PhotoViewModal.jsx`
  sesuai permintaan (popup "Lihat" sekarang menampilkan foto, bukan daftar field teks).
- Hapus duplikasi markup search-bar/avatar/user-info (banyak file -> 1 komponen `PageHeader`).
- Hapus duplikasi state "Not Found" (banyak file -> 1 komponen `NotFoundState`).
- Konsisten memakai `id` asli (bukan index array) sebagai React `key` dan acuan update/delete.
- Semua 18 halaman yang sebelumnya hanya markup statis sekarang punya pola yang sama persis
  dengan modul Storage (service layer, loading state, search, modal Add/Edit/View/Delete),
  sehingga kode jauh lebih konsisten dan mudah dipelihara.
