/**
 * PhotoViewModal.jsx
 * ------------------------------------------------------------------
 * Modal "View" yang menampilkan FOTO dari item/asset yang dipilih
 * (bukan daftar detail field). Dipakai oleh tombol mata (Eye/View) di
 * semua halaman tabel asset (RAM, SSD, HDD, Network, Peripherals, dst).
 *
 * Setiap asset sekarang punya field `photo` (data URL hasil upload di
 * form Add/Edit). Jika item belum punya foto, modal menampilkan
 * placeholder agar tetap rapi.
 * ------------------------------------------------------------------
 */
import { ImageOff } from "lucide-react";

export default function PhotoViewModal({ open, title = "Asset Photo", photo, label, onClose }) {
  if (!open) return null;

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div
        className="dash-modal-box photo-view-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dash-modal-header">
          <h2 className="dash-modal-title">{title}</h2>
          <button className="dash-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dash-modal-body photo-view-modal-body">
          {photo ? (
            <img src={photo} alt={label || "Asset"} className="photo-view-image" />
          ) : (
            <div className="photo-view-placeholder">
              <ImageOff size={42} />
              <p>No photo uploaded for this asset yet.</p>
            </div>
          )}
          {label && <p className="photo-view-label">{label}</p>}
        </div>

        <div className="dash-modal-footer">
          <button className="dash-btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
