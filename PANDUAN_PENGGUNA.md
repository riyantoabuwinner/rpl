# 📖 BUKU PANDUAN PENGGUNAAN SISTEM INFORMASI REKOGNISI PEMBELAJARAN LAMPAU (SIRPL)
### Universitas Islam Negeri Siber Syekh Nurjati Cirebon (UIN SSC)
*Berbasis Permendikbudristek No. 41 Tahun 2021 & Standar Operasional Prosedur RPL UIN SSC*

---

## 📑 DAFTAR ISI
1. [Akun Login & Kredensial Pengguna](#1-akun-login--kredensial-pengguna)
2. [Panduan Role 1: Calon Mahasiswa / Asesi (Peserta RPL)](#2-panduan-role-1-calon-mahasiswa--asesi-peserta-rpl)
3. [Panduan Role 2: Admin Pusat RPL](#3-panduan-role-2-admin-pusat-rpl)
4. [Panduan Role 3: Asesor Penilai RPL](#4-panduan-role-3-asesor-penilai-rpl)
5. [Panduan Role 4: Ketua Program Studi (Kaprodi)](#5-panduan-role-4-ketua-program-studi-kaprodi)
6. [Panduan Role 5: Lembaga Penjaminan Mutu (LPM)](#6-panduan-role-5-lembaga-penjaminan-mutu-lpm)
7. [Panduan Role 6: Admin Data SIAKAD & PDDikti Feeder](#7-panduan-role-6-admin-data-siakad--pddikti-feeder)
8. [Panduan Role 7: Super Administrator](#8-panduan-role-7-super-administrator)
9. [Panduan Verifikasi Ijazah / SK Berbasis QR Code (Publik)](#9-panduan-verifikasi-ijazah--sk-berbasis-qr-code-publik)

---

## 1. Akun Login & Kredensial Pengguna

> **Catatan Penting:** Kata sandi default untuk seluruh akun seeder demo adalah: **`password123`**

| Role / Peran | Nama Akun | Email Login | Hak Akses Utama |
|:---|:---|:---|:---|
| **Asesi (Tadris Matematika)** | TOHERI | `toheri@uinssc.ac.id` | Formulir Form 2/F02 & Form 3/F03 siap cetak |
| **Asesi (RPL A2 - Perolehan SKS)** | Ahmad Fauzi | `asesi.ahmad@example.com` | Pendaftaran portofolio kerja & pemetaan CPMK |
| **Asesi (RPL A1 - Transfer SKS)** | Rina Wulandari | `asesi.rina@example.com` | Alih kredit transkrip kuliah formal |
| **Admin Pusat RPL** | Pengelola Pusat RPL | `adminrpl@kampus.ac.id` | Verifikasi administrasi & penugasan asesor |
| **Asesor 1** | Dr. Ahmad Dahlan, M.Kom. | `asesor1@kampus.ac.id` | Dual-Panel Workspace, validasi A-C-S-V / V-A-T-M |
| **Asesor 2** | Dr. Siti Aminah, M.T. | `asesor2@kampus.ac.id` | Evaluasi portofolio & penilaian uji petik |
| **Ketua Program Studi** | Prof. Dr. Ir. Bambang Hermanto | `kaprodi.ti@kampus.ac.id` | Sidang Pleno, Berita Acara & kurikulum prodi |
| **Penjaminan Mutu (LPM)** | Dr. Hendra Wijaya, M.Pd. | `lpm@kampus.ac.id` | Audit kepatuhan Permendikbud & SLA penjaminan mutu |
| **Admin SIAKAD** | Admin Data SIAKAD & Feeder | `siakad@kampus.ac.id` | Bridge API SIAKAD UIN SSC & Neofeeder PDDikti |
| **Super Administrator** | Super Administrator | `superadmin@kampus.ac.id` | Kontrol sistem penuh, audit trail, user manager |

---

## 2. Panduan Role 1: Calon Mahasiswa / Asesi (Peserta RPL)

Calon mahasiswa mengakses sistem untuk mendaftar, mengunggah bukti portofolio, mengisi evaluasi diri mandiri, dan memantau status pengakuan SKS.

```
[Isi Data Diri Form F-02] ➔ [Unggah 13 Bukti Portofolio] ➔ [Pilih MK & Skema SKS] ➔ [Isi Form F-03 Evaluasi Diri] ➔ [Tandatangani Pakta Integritas] ➔ [Submit Final]
```

### Langkah-Langkah Operasional:
1. **Login ke Sistem**:
   - Masuk melalui halaman login menggunakan email asesi (contoh: `toheri@uinssc.ac.id` / `asesi.ahmad@example.com`).
2. **Akses Menu "Portofolio Peserta" (`/form-f02`)**:
   - **Langkah 1 (Data Diri & Jalur)**: Isi data pribadi lengkap (NIK 16 digit, tempat/tanggal lahir, alamat, RT/RW, kecamatan, kode pos, nomor HP/WhatsApp, status pernikahan, kebangsaan, dan pekerjaan saat ini). Pilih jalur pengajuan: **RPL Tipe A1 (Transfer SKS)** atau **RPL Tipe A2 (Perolehan SKS)**.
   - **Langkah 2 (Riwayat Pendidikan)**: Tambahkan riwayat pendidikan formal terakhir (SMA/SMK/D3/S1) beserta nomor ijazah dan tahun kelulusan.
   - **Langkah 3 (Pengalaman Kerja)**: Tambahkan riwayat pekerjaan, nama instansi, masa kerja, dan deskripsi tugas relevan.
   - **Langkah 4 (Unggah Portofolio)**: Unggah dokumen bukti (format PDF/JPG/PNG maks. 10MB) sesuai 13 kategori resmi (Sertifikat Kompetensi, Lisensi, Logbook, Buku Harian, Foto Karya, Rekomendasi Pihak Ketiga, dsb.). Sistem otomatis mengenerate SHA-256 Checksum anti-tamper.
   - **Langkah 5 (Daftar Mata Kuliah & Pemetaan CPMK)**: Pilih mata kuliah kurikulum yang diajukan, tentukan skema (*Transfer SKS* atau *Perolehan SKS*), dan tautkan dokumen bukti pendukung.
   - **Langkah 6 (Pakta Integritas & Final Submit)**: Centang dan setujui 3 butir pakta integritas legal. Klik tombol **Submit Final Form 2/F02**.
3. **Cetak Dokumen Resmi**:
   - Klik tombol **"Cetak F-02"** untuk mencetak Formulir Aplikasi RPL Tipe A resmi ber-kop UIN SSC.
   - Klik tombol **"Cetak F-03"** untuk mencetak Formulir Evaluasi Diri lengkap dengan matriks 5 kolom CPMK dan tanda tangan.
4. **Masa Sanggah / Keberatan (Jika Diperlukan)**:
   - Jika hasil pleno ada yang tidak direkognisi, peserta memiliki waktu **3 hari kerja** untuk mengajukan sanggah melalui menu **"Masa Sanggah" (`/sanggah`)** dengan melampirkan alasan dan bukti tambahan.

---

## 3. Panduan Role 2: Admin Pusat RPL

Admin RPL bertindak sebagai gerbang verifikasi berkas administrasi dan koordinator penugasan asesor.

### Langkah-Langkah Operasional:
1. **Login**: Masuk dengan `adminrpl@kampus.ac.id`.
2. **Menu "Pendaftar RPL" (`/admin/pendaftar`)**:
   - Melihat antrean seluruh pendaftar, status kelengkapan berkas, dan indikator waktu SLA (Maks. 3 hari kerja).
   - Klik tombol **"Verifikasi Administrasi"**:
     - Periksa kesesuaian identitas KTP/Ijazah dan kelayakan jalur RPL.
     - Pilih **"Lolos Administrasi & Tugaskan Asesor"** ➔ Pilih dosen asesor yang kompeten di bidang mata kuliah tersebut.
     - ATAU pilih **"Tolak / Minta Perbaikan"** dengan menyertakan catatan resmi.
3. **Menu "Berita Acara / Pleno" (`/pleno`)**:
   - Membuat jadwal sidang pleno kelulusan RPL bersama Kaprodi dan Tim Penilai.
4. **Menu "Masa Sanggah" (`/sanggah`)**:
   - Memfasilitasi penerimaan keberatan peserta untuk ditinjau oleh Tim RPL dalam sidang khusus.

---

## 4. Panduan Role 3: Asesor Penilai RPL

Asesor bertugas mengevaluasi bukti portofolio, memvalidasi prinsip A-C-S-V / V-A-T-M, menguji petik/wawancara, serta memberikan rekomendasi nilai huruf/angka dan SKS.

### Langkah-Langkah Operasional:
1. **Login**: Masuk dengan `asesor1@kampus.ac.id` atau `asesor2@kampus.ac.id`.
2. **Menu "Penilaian Portofolio" (`/asesor/penilaian`)**:
   - Sistem langsung membuka **Dual-Panel Workspace Asesor**:
     - **Panel Kiri (Document Viewer)**: Membuka berkas portofolio asli dengan pelindung *Dynamic Watermark Canvas* (mencegah kebocoran data).
     - **Panel Kanan (Lembar Asesmen & Validasi)**:
       - **Validasi 4 Prinsip (A-C-S-V / V-A-T-M)**:
         - ✅ **V (Valid / Sahih)**: Bukti relevan langsung dengan CPMK mata kuliah.
         - ✅ **A (Autentik / Asli)**: Karya orisinal calon mahasiswa.
         - ✅ **T (Terkini)**: Bukti masih berlaku / kompetensi aktif.
         - ✅ **M (Memadai / Cukup)**: Bukti mencakup kedalaman dan durasi jam kerja memadai.
       - **Keputusan Mata Kuliah**: Pilih status (*Diakui Penuh / Diakui Sebagian / Butuh Uji Petik / Ditolak*).
       - **Rekomendasi Nilai**: Berikan nilai huruf (A / A- / B+ / B) dan nilai angka (4.00 / 3.75 / dsb.).
       - Klik **"Simpan Penilaian Mata Kuliah"**.
3. **Menu "Asesmen Lanjutan" (`/uji-petik`)**:
   - Jika dokumen memerlukan pembuktian kompetensi langsung, jadwalkan wawancara / demonstrasi praktik.
   - Input nilai berdasarkan **Rubrik 4 Dimensi Kompetensi** (Task Skill, Task Management, Contingency Management, Job Role/Environment Skill).
4. **Finalisasi Asesmen**:
   - Klik tombol hijau **"Finalisasi & Ajukan ke Sidang Pleno"** di pojok kanan atas workspace.

---

## 5. Panduan Role 4: Ketua Program Studi (Kaprodi)

Kaprodi memimpin Sidang Pleno, memastikan kesesuaian kurikulum program studi, dan mengesahkan Berita Acara Rekognisi.

### Langkah-Langkah Operasional:
1. **Login**: Masuk dengan `kaprodi.ti@kampus.ac.id`.
2. **Menu "Berita Acara / Pleno" (`/pleno`)**:
   - Buat agenda sidang pleno baru (contoh: *Sidang Pleno Rekognisi RPL Gelombang 1 Ganjil*).
   - Tinjau rekapitulasi seluruh pendaftar: total SKS yang diajukan vs total SKS yang disetujui asesor.
   - Tetapkan keputusan pleno: **DIREKOGNISI PENUH**, **DIREKOGNISI SEBAGIAN**, atau **TIDAK DIREKOGNISI**.
   - Klik tombol **"Legalisasi Berita Acara Pleno"** untuk mengunci hasil dan meneruskannya ke Biro Akademik.
3. **Menu "Rekognisi MK & SKS" (`/sk-rekognisi`)**:
   - Melihat pratinjau draft transkrip konversi SKS resmi untuk penerbitan SK Rektor.

---

## 6. Panduan Role 5: Lembaga Penjaminan Mutu (LPM)

LPM mengaudit kepatuhan penyelenggaraan RPL terhadap Permendikbudristek No. 41 Tahun 2021 dan standar mutu universitas.

### Langkah-Langkah Operasional:
1. **Login**: Masuk dengan `lpm@kampus.ac.id`.
2. **Monitoring Dashboard Penjaminan Mutu**:
   - Memantau kepatuhan SLA: Verifikasi Berkas (Maks. 3 Hari), Penilaian Asesor (Maks. 7 Hari).
   - Memeriksa konsistensi penerapan rubrik asesmen dan matriks validitas V-A-T-M.
   - Mengaudit log aktivitas sistem (*Audit Trail*) untuk mencegah anomali atau pemalsuan nilai.

---

## 7. Panduan Role 6: Admin Data SIAKAD & PDDikti Feeder

Admin SIAKAD bertanggung jawab atas sinkronisasi data kurikulum dan migrasi transkrip mahasiswa RPL ke pangkalan data akademik nasional.

### Langkah-Langkah Operasional:
1. **Login**: Masuk dengan `siakad@kampus.ac.id`.
2. **Menu "Dashboard SIAKAD" (`/dashboard`)**:
   - **Sinkronisasi Program Studi**: Menjalankan integrasi REST API (`GET /api/program_studi`) untuk menarik data prodi terkini dari server pusat UIN SSC.
   - **Sinkronisasi Mata Kuliah**: Menjalankan integrasi REST API (`POST /api/matakuliah`) untuk memperbarui kurikulum dan silabus.
   - **Ekspor Konversi Nilai ke SIAKAD & Feeder**: Mentransfer nilai mata kuliah yang telah direkognisi ke Kartu Hasil Studi (KHS) mahasiswa baru pada SIAKAD dan PDDikti Neofeeder.

---

## 8. Panduan Role 7: Super Administrator

Super Admin memiliki kendali penuh atas seluruh modul aplikasi, konfigurasi basis data, dan akun pengguna.

### Langkah-Langkah Operasional:
1. **Login**: Masuk dengan `superadmin@kampus.ac.id`.
2. **Fitur Ganti Peran Cepat (Quick Role Switcher)**:
   - Klik tombol **"Ganti Peran"** di pojok kiri bawah sidebar untuk berpindah tampilan dan menguji fungsionalitas dari sudut pandang peran mana pun tanpa perlu keluar-masuk akun.
3. **Menu "Master Data" (`/master-data`)**:
   - Mengatur pembukaan Gelombang Pendaftaran RPL, kuota mahasiswa, serta biaya pendaftaran.
4. **Audit Logs & Keamanan**:
   - Memeriksa seluruh rekaman jejak audit sistem: upload dokumen, hash verification, perubahan nilai, keputusan pleno, dan penerbitan SK.

---

## 9. Panduan Verifikasi Ijazah / SK Berbasis QR Code (Publik)

Pihak ketiga, kantor dinas, perusahaan, atau instansi perekrut dapat memverifikasi keabsahan Surat Keputusan (SK) Rekognisi RPL secara mandiri:

1. Arahkan kamera ponsel ke **QR Code** yang tertera pada lembar SK Rekognisi Rektor / Sertifikat RPL.
2. Browser akan membuka tautan verifikasi publik: `https://[domain-kampus]/verify/{qr_token}`.
3. Halaman verifikasi resmi UIN SSC akan menampilkan:
   - ✅ **Status Dokumen**: *Terverifikasi Asli dan Terdaftar Resmi*.
   - 👤 **Identitas Mahasiswa**: Nama lengkap, NIK tersensor (*privacy compliance*), Program Studi, dan Fakultas.
   - 🎓 **Hasil Rekognisi**: Jumlah SKS diakui, Indeks Prestasi Kumulatif (IPK) Rekognisi, dan Nomor SK Rektor.
   - 🔐 **Integritas Digital**: Tanda tangan digital pejabat pengesah dan kode SHA-256 Digital Fingerprint.
