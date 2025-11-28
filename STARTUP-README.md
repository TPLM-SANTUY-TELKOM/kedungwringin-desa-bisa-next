# 🚀 Panduan Startup Script - Jalankan dengan Satu Klik!

Script ini memungkinkan Anda menjalankan web app **Kedungwringin** dengan sekali klik, seperti aplikasi desktop!

---

## 📋 File yang Tersedia

1. **`start-app.bat`** - Script Windows Batch (Direkomendasikan)
   - Mudah digunakan
   - Double-click untuk menjalankan
   - Cocok untuk semua pengguna Windows

2. **`start-app.ps1`** - Script PowerShell (Advanced)
   - Error handling lebih baik
   - Lebih detail dalam logging
   - Cocok untuk pengguna yang familiar dengan PowerShell

---

## 🎯 Cara Menggunakan

### Metode 1: Double-Click File (Paling Mudah)

1. **Buka folder project** di File Explorer
2. **Double-click** file `start-app.bat`
3. **Tunggu** hingga aplikasi terbuka di browser
4. **Selesai!** 🎉

### Metode 2: Buat Shortcut di Desktop

Ikuti panduan lengkap di file **[BUAT-SHORTCUT.md](./BUAT-SHORTCUT.md)**

**Quick Steps:**
1. Klik kanan di Desktop → **New** → **Shortcut**
2. Browse ke file `start-app.bat`
3. Beri nama: `Kedungwringin`
4. Double-click shortcut untuk menjalankan!

---

## ⚙️ Apa yang Dilakukan Script?

Script akan otomatis melakukan:

1. ✅ **Cek Node.js** - Memastikan Node.js terinstall
2. ✅ **Cek Docker** - Memastikan Docker berjalan
3. ✅ **Install Dependencies** - Jika belum terinstall (`npm install`)
4. ✅ **Start Database** - Menjalankan PostgreSQL di Docker
5. ✅ **Start Web App** - Menjalankan development server
6. ✅ **Buka Browser** - Otomatis membuka http://localhost:3000

---

## 🔧 Troubleshooting

### Error: "Node.js tidak ditemukan"
**Solusi:** Install Node.js dari https://nodejs.org/

### Error: "Docker tidak ditemukan"
**Solusi:** Install Docker Desktop dari https://www.docker.com/products/docker-desktop/

### Error: "Docker tidak berjalan"
**Solusi:**
1. Buka **Docker Desktop** aplikasi
2. Tunggu hingga status "Running"
3. Jalankan script lagi

### Error: "Port 5432 sudah digunakan"
**Solusi:**
1. Cek aplikasi lain yang menggunakan port 5432
2. Stop aplikasi tersebut
3. Atau ubah port di `docker-compose.yml` dan `.env`

### Script tidak jalan / muncul warning
**Solusi:**
1. Klik kanan `start-app.bat` → **Run as administrator**
2. Atau ubah execution policy PowerShell:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

---

## 📝 Catatan Penting

### Sebelum Pertama Kali Menggunakan:

1. ✅ Pastikan semua software sudah terinstall:
   - Node.js v20+
   - Docker Desktop
   - Git

2. ✅ Pastikan Docker Desktop **sudah berjalan** sebelum menjalankan script

3. ✅ Pastikan port **3000** dan **5432** tidak digunakan aplikasi lain

### Setelah Menjalankan Script:

- **Jangan tutup window** yang muncul (terminal/command prompt)
- Window tersebut menjalankan web server
- Untuk menghentikan, tekan **Ctrl+C** di window tersebut
- Database akan otomatis dihentikan saat script berhenti

---

## 🎨 Customisasi

### Mengubah Port Web App

Edit file `package.json`, ubah script `dev`:
```json
"dev": "next dev -p 3001"
```

### Mengubah Port Database

Edit file `docker-compose.yml` dan `.env`:
```yaml
ports:
  - "5433:5432"  # Ubah port pertama
```

### Menambahkan Delay

Edit `start-app.bat`, tambahkan delay sebelum membuka browser:
```batch
timeout /t 10 /nobreak >nul  # Delay 10 detik
```

---

## 🔄 Update Script

Jika ada perubahan di project (misalnya port atau konfigurasi), edit file:
- `start-app.bat` - Untuk Windows Batch script
- `start-app.ps1` - Untuk PowerShell script

---

## 📚 Referensi

- [README.md](./README.md) - Dokumentasi lengkap project
- [BUAT-SHORTCUT.md](./BUAT-SHORTCUT.md) - Panduan membuat shortcut
- [instalasi.md](./instalasi.md) - Panduan instalasi software

---

## 💡 Tips

1. **Pin ke Taskbar** untuk akses lebih cepat
2. **Buat keyboard shortcut** untuk menjalankan dengan kombinasi tombol
3. **Jalankan sebagai Administrator** jika ada masalah permission
4. **Cek logs** di terminal untuk melihat error detail

---

**Selamat menggunakan! 🎉**

Jika ada pertanyaan atau masalah, silakan buka issue di repository atau hubungi developer.

