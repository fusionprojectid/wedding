# 💍 Undangan Pernikahan Digital Modern

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

14. **Halaman Login Keamanan Admin (`login.html`)**:
    - Gerbang autentikasi sebelum masuk ke dashboard pengantin dengan dukungan *remember me* dan proteksi sesi.
    - Kredensial default: Username: `admin` | Password: `admin123` (dapat diganti kapan saja di dashboard).

15. **Koleksi 8 Template Desain Undangan (Bukan Cuma Ganti Warna, Tapi Beda Struktur & Gaya)**:
    - **Template 1: Royal Classic Gold**  
      *Gaya:* Kemewahan editorial klasik (*quiet luxury*).  
      *Ciri Khas Struktur:* Bingkai foto lingkaran dengan cincin ornamen orbital berputar, kartu kaca transparan (*glassmorphism*), tipografi serif romantis *Playfair Display* & *Great Vibes*, serta partikel kelopak mawar emas.
    - **Template 2: Modern Arch Minimalist**  
      *Gaya:* Arsitektur lengkung modern (*Japandi / Contemporary Terracotta & Sand*).  
      *Ciri Khas Struktur:* Bingkai foto **lengkung arsitektur tinggi (Arch Frame)**, tipografi arsitektural *Cinzel & Syne*, kartu monolitik minimalis bersudut lengkung atas, dan debu terracotta/pasir hangat.
    - **Template 3: Nusantara Heritage (Adat Keraton Tradisional Jawa)**  
      *Gaya:* Tradisi Keraton Nusantara, sakral, anggun, & berwibawa.  
      *Ciri Khas Struktur:* Lambang jambul **Gunungan Wayang** di sampul, bingkai ukiran gebyok klasik bergaris ganda, tekstur kertas piagam *Layang Pawiwahan*, warna marun sogan & emas kuno, serta taburan bunga melati putih & serpihan emas keraton.
    - **Template 4: Botanical Greenhouse & Wildflower**  
      *Gaya:* Kebun botani alami, *rustic greenhouse*, & dedaunan liar.  
      *Ciri Khas Struktur:* Bingkai foto **oval organik asimetris menyerupai kelopak daun**, kartu berpola sudut daun alam, tipografi kursif halus *Cormorant Garamond*, serta animasi dedaunan eucalyptus hijau yang berjatuhan.
    - **Template 5: The Wedding Chronicle Newspaper**  
      *Gaya:* Surat kabar retro vintage (*Editorial Gazette Tabloid*).  
      *Ciri Khas Struktur:* Bingkai foto **Polaroid Film Frame jadul** dengan batas cetak koran, kepala tajuk berita *Special Wedding Edition*, garis ganda tebal editorial, font mesin tik *Courier Prime*, dan partikel debu daun gugur klasik.
    - **Template 6: Midnight Celestial Starlight**  
      *Gaya:* Malam kosmik berbintang (*Galaxy Dark Mode Luxury*).  
      *Ciri Khas Struktur:* Bingkai foto **Diamond Octagonal Bevel bersegi delapan** dengan pendaran neon starlight cyan, kartu kaca ruang angkasa gelap, serta animasi bintang berkilau dan percikan perak melayang.
    - **Template 7: Islamic Emerald Arabesque**  
      *Gaya:* Nuansa Islami Kerajaan, sakral, dan megah.  
      *Ciri Khas Struktur:* Bingkai foto dan kartu berbentuk **Kubah Mesjid Melengkung (Islamic Dome Arch)**, ornamen arabesque emas Timur Tengah klasik, tipografi sakral *Marcellus & Amiri*, serta taburan serpihan emas dan bunga melati.
    - **Template 8: Korean Pastel Coquette**  
      *Gaya:* Romansa drama Korea (*Aesthetic K-Drama Coquette Chic*).  
      *Ciri Khas Struktur:* Bingkai foto **Soft Cloud Squircle membulat empuk** layaknya awan manis, kartu ultra-plush bernuansa manis, warna pastel strawberry & baby blue, serta animasi kelopak bunga sakura merah muda.

16. **Dashboard Admin Pengantin (`admin.html`)**:
    - Panel visual interaktif untuk memilih template dengan 1 klik, mengubah data mempelai, jadwal acara, lokasi akad & resepsi, nomor rekening, hingga musik latar tanpa menyentuh kode.
    - Dilengkapi fitur ekspor/impor konfigurasi JSON, generator link tamu WhatsApp, dan pengaturan ganti password.

17. **Efek Kelopak Bunga Berjatuhan Sesuai Tema (Falling Petals Canvas)**:
    - Animasi HTML5 Canvas ringan yang warnanya beradaptasi otomatis sesuai tema template yang dipilih (emas/mawar/sage/starlight).

---

## 📁 Struktur Folder Proyek

```text
wedding-main/
│
├── index.html                  # File utama undangan pernikahan (eksklusif untuk tamu)
├── login.html                  # Halaman login sebelum masuk ke dashboard
├── admin.html                  # Dashboard visual untuk memilih template & mengedit data
├── README.md                   # Dokumentasi panduan lengkap
├── LICENSE.txt                 # Lisensi
│
└── assets/
    ├── css/
    │   ├── style.css           # Styling dasar undangan & tata letak responsif
    │   ├── animations.css      # Definisi keyframes, shimmer, spin vinyl, & reveal
    │   ├── themes.css          # Tema 8 Template Desain (Royal Gold, Arch, Keraton, Botanical, Newspaper, Celestial, Emerald, Korean Pastel)
    │   └── admin.css           # Styling modern dashboard admin & template switcher
    │
    ├── js/
    │   ├── config.js           # Pengelola data dinamis, tema, & sinkronisasi localStorage
    │   ├── admin.js            # Kontroler form, template switcher, & akun dashboard
    │   ├── main.js             # Logika pembuka undangan, audio, scrollspy, & toast
    │   ├── countdown.js        # Logika hitung mundur & integrasi kalender (.ics & Google Calendar)
    │   ├── gallery.js          # Filter galeri dan lightbox penampil foto
    │   ├── rsvp.js             # Pengolahan formulir RSVP, ucapan doa, storage, & konfeti
    │   ├── generator.js        # Pembuat tautan tamu khusus & template chat WhatsApp
    │   └── petals.js           # Animasi kelopak bunga/daun/partikel adaptif tema
    │
    └── images/                 # Tempat penyimpanan gambar & aset grafis lokal (opsional)
```

---

## 🔐 Kredensial Login Dashboard

Untuk mengelola undangan dan mengganti template:
1. Buka file **`login.html`** di browser.
2. Masukkan akun bawaan:
   * **Username:** `admin`
   * **Password:** `admin123`
3. Setelah login berhasil, Anda akan otomatis dialihkan ke **`admin.html`**.
4. Anda dapat mengganti username & password kapan saja melalui tab **"Pengaturan Login"** di dalam dashboard.

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
