# 💍 Undangan Pernikahan Digital Modern (Hanim & Firman)

Website undangan pernikahan digital interaktif, elegan, dan *mobile-first* yang dirancang dengan memisahkan struktur HTML, CSS, dan JavaScript secara modular dan teratur.

---

## ✨ Fitur-Fitur Utama

1. **Cover / Gate Screen (Buka Undangan)**:
   - Tampilan pembuka eksklusif dengan monogram dan efek kaca (*glassmorphism*).
   - Deteksi nama tamu otomatis via parameter URL (`?to=Nama+Tamu`).
   - Tombol pembuka dengan animasi *pulse glow* yang membuka halaman secara mulus dan memicu pemutaran musik latar.

2. **Musik Latar Romantis (Background Music)**:
   - Pemutar audio otomatis saat tombol "Buka Undangan" diklik (mematuhi kebijakan autoplay browser).
   - Tombol kontrol mengambang (*floating music widget*) dengan animasi piringan hitam berputar saat musik aktif.

3. **Navigasi Cepat Mengambang (Floating Bottom Navigation)**:
   - Menu melayang di bagian bawah dengan fitur *ScrollSpy* (menyorot ikon menu sesuai posisi scroll pengguna).
   - Akses cepat ke: Sampul, Mempelai, Acara, Cerita, Galeri, Kado, dan Ucapan.

4. **Kutipan Suci / Ayat Pernikahan**:
   - Kaligrafi QS. Ar-Rum: 21 dengan terjemahan bahasa Indonesia bernuansa sakral.

5. **Profil Pasangan Mempelai (Groom & Bride)**:
   - Foto mempelai dengan bingkai ornamen floral berputar perlahan.
   - Keterangan nama lengkap, gelar, orang tua, dan tautan media sosial (Instagram).

6. **Hitung Mundur Waktu (Live Countdown Timer)**:
   - Penghitung waktu mundur akurat (Hari, Jam, Menit, Detik) menuju waktu akad.
   - **Simpan ke Google Calendar**: Tombol yang langsung membuka Google Calendar lengkap dengan judul, deskripsi, dan lokasi acara.
   - **Unduh File Kalender (.ics)**: Mendukung Apple Calendar, Microsoft Outlook, dan kalender ponsel lainnya.

7. **Rangkaian Acara & Peta Navigasi**:
   - Rincian Akad Nikah dan Resepsi Pernikahan.
   - Sematan peta interaktif (*Google Maps Embed*).
   - Tombol petunjuk arah yang langsung terhubung ke Google Maps.

8. **Perjalanan Cinta (Our Love Story)**:
   - Garis waktu (*timeline*) interaktif menceritakan momen berkesan dari awal bertemu, komitmen, lamaran, hingga pernikahan.

9. **Panduan Dress Code**:
   - Palet warna rekomendasi bagi tamu undangan (Sage Green, Champagne, Mocca, Ivory White).

10. **Galeri Foto Prewedding & Lightbox**:
    - Kisi foto responsif dengan filter kategori (Semua, Prewedding, Casual).
    - Fitur *Lightbox Zoom* layar penuh yang dilengkapi navigasi tombol panah (Next/Prev/Close) dan pintasan keyboard (ArrowLeft, ArrowRight, Escape).

11. **Amplop Digital & Kado Fisik (Cashless Gift & Registry)**:
    - Kartu ATM virtual realistis (BCA & Mandiri) lengkap dengan chip dan nomor rekening.
    - Tombol **Salin No. Rekening** sekali klik dengan notifikasi *toast* konfirmasi.
    - Alamat pengiriman kado fisik dengan tombol **Salin Alamat Lengkap**.

12. **RSVP & Buku Tamu (Ucapan & Doa Restu)**:
    - Formulir konfirmasi kehadiran (Hadir, Berhalangan, Ragu-ragu) dan jumlah tamu.
    - Nama terisi otomatis dari parameter link `?to=`.
    - Data tersimpan lokal di browser (*localStorage*) sehingga ucapan langsung muncul seketika tanpa perlu reload.
    - Efek kembang api/konfeti (*confetti animation*) saat berhasil mengirim ucapan.

13. **Generator Tautan Undangan & Pesan WhatsApp**:
    - Alat bantu untuk pengantin membuat tautan personal tamu secara praktis.
    - Tombol kirim pesan formal otomatis ke WhatsApp tamu undangan.

14. **Efek Kelopak Bunga Berjatuhan (Falling Petals Canvas)**:
    - Animasi kelopak bunga sakura/mawar menggunakan HTML5 Canvas ringan dan hemat baterai (otomatis jeda saat tab browser tidak aktif).

---

## 📁 Struktur Folder Proyek

```text
wedding-main/
│
├── index.html                  # File utama halaman web
├── README.md                   # Dokumentasi panduan lengkap
├── LICENSE.txt                 # Lisensi
│
└── assets/
    ├── css/
    │   ├── style.css           # Styling utama, tema kemewahan, warna, dan responsivitas
    │   └── animations.css      # Definisi keyframes, efek shimmer, spin, float, dan reveal
    │
    ├── js/
    │   ├── main.js             # Logika pembuka undangan, audio, scrollspy, dan toast
    │   ├── countdown.js        # Logika hitung mundur & integrasi kalender (.ics & Google Calendar)
    │   ├── gallery.js          # Filter galeri dan lightbox penampil foto
    │   ├── rsvp.js             # Pengolahan formulir RSVP, ucapan doa, penyimpanan, dan konfeti
    │   ├── generator.js        # Pembuat tautan tamu khusus & template chat WhatsApp
    │   └── petals.js           # Animasi kelopak bunga berjatuhan berbasis Canvas
    │
    └── images/                 # Tempat penyimpanan gambar & aset grafis lokal (opsional)
```

---

## 🚀 Panduan Kustomisasi

### 1. Mengubah Tanggal Acara
Buka file `assets/js/countdown.js`, ubah baris berikut sesuai tanggal pernikahan Anda:
```javascript
const WEDDING_DATE = new Date('2026-10-26T08:00:00+07:00').getTime();
```

### 2. Mengubah Nama Tamu pada Tautan
Tambahkan parameter `?to=Nama+Tamu` pada alamat website, contoh:
```text
https://website-kamu.com/?to=Bapak+Joko+%26+Keluarga
```
Atau gunakan tombol **"Buat Tautan Undangan Khusus Tamu"** di bagian bawah halaman web untuk membuatnya secara instan.

### 3. Mengubah Musik Latar
Buka `index.html` dan ganti link audio pada tag `<source>`:
```html
<audio id="bg-music" loop preload="auto">
  <source src="URL_MUSIK_ANDA_DISINI.mp3" type="audio/mpeg" />
</audio>
```

### 4. Mengubah Nomor Rekening & Alamat Kado
Buka `index.html` pada bagian section `#gift`, sesuaikan nomor rekening pada atribut `data-copy`:
```html
<button class="btn-copy" data-copy="1234567890" data-label="Nomor rekening BCA">
  <i class="far fa-copy"></i> Salin No. Rekening
</button>
```

---

## 💻 Lisensi & Hak Cipta
Dibuat dengan cinta untuk pernikahan bahagia **Hanim & Firman**.  
&copy; 2026 [fusionproject.id](https://fusionproject.id). All rights reserved.
