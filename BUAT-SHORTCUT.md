# Cara Membuat Shortcut untuk Menjalankan Web App

Setelah membuat script startup, Anda bisa membuat shortcut di desktop atau start menu untuk menjalankan aplikasi dengan sekali klik.

## Metode 1: Shortcut di Desktop (Paling Mudah)

### Langkah-langkah:

1. **Klik kanan di Desktop** → Pilih **New** → **Shortcut**

2. **Untuk Batch File (.bat):**
   - Klik **Browse** dan cari file `start-app.bat` di folder project
   - Atau ketik langsung: `D:\0_Project\1_SEKOLA\kedungwringin-desa-bisa-next\start-app.bat`
   - Klik **Next**

3. **Beri nama shortcut:**
   - Nama: `Kedungwringin - Start App`
   - Klik **Finish**

4. **Ubah icon shortcut (Opsional):**
   - Klik kanan shortcut → **Properties**
   - Tab **Shortcut** → Klik **Change Icon**
   - Pilih icon yang diinginkan (atau browse ke file icon)
   - Klik **OK** → **Apply** → **OK**

### Catatan:
- Jika muncul warning "Windows protected your PC", klik **More info** → **Run anyway**
- Atau jalankan sebagai Administrator jika diperlukan

---

## Metode 2: Shortcut untuk PowerShell Script

1. **Klik kanan di Desktop** → **New** → **Shortcut**

2. **Ketikan perintah:**
   ```
   powershell.exe -ExecutionPolicy Bypass -File "D:\0_Project\1_SEKOLA\kedungwringin-desa-bisa-next\start-app.ps1"
   ```
   *(Ganti path sesuai lokasi project Anda)*

3. **Beri nama:** `Kedungwringin - Start App`

4. **Ubah icon** (opsional)

---

## Metode 3: Pin ke Start Menu

1. **Buat shortcut di Desktop** dulu (Metode 1)

2. **Klik kanan shortcut** → **Pin to Start**

3. Shortcut akan muncul di Start Menu

---

## Metode 4: Pin ke Taskbar

1. **Buat shortcut di Desktop** dulu (Metode 1)

2. **Klik kanan shortcut** → **Pin to Taskbar**

3. Shortcut akan muncul di Taskbar untuk akses cepat

---

## Metode 5: Tambahkan ke Startup (Jalankan Otomatis saat Windows Start)

**PERHATIAN:** Metode ini akan menjalankan aplikasi otomatis setiap kali Windows start. Gunakan dengan hati-hati!

### Cara 1: Menggunakan Startup Folder

1. Tekan **Windows + R**
2. Ketik: `shell:startup`
3. Tekan **Enter**
4. Copy shortcut yang sudah dibuat ke folder ini
5. Restart komputer untuk test

### Cara 2: Menggunakan Task Scheduler (Lebih Advanced)

1. Tekan **Windows + R**
2. Ketik: `taskschd.msc`
3. Klik **Create Basic Task**
4. Isi nama: `Kedungwringin Startup`
5. Trigger: **When I log on**
6. Action: **Start a program**
7. Program: Browse ke `start-app.bat`
8. Finish

---

## Troubleshooting

### Shortcut tidak jalan / muncul error

1. **Cek path file:**
   - Pastikan path ke `start-app.bat` benar
   - Gunakan path lengkap dengan drive letter

2. **Jalankan sebagai Administrator:**
   - Klik kanan shortcut → **Properties**
   - Tab **Shortcut** → **Advanced**
   - Centang **Run as administrator**
   - **OK** → **Apply**

3. **Ubah Working Directory:**
   - Klik kanan shortcut → **Properties**
   - Tab **Shortcut**
   - Di **Start in:** ketik path folder project
   - Contoh: `D:\0_Project\1_SEKOLA\kedungwringin-desa-bisa-next`

### PowerShell Script tidak jalan

Jika menggunakan PowerShell script, mungkin perlu mengubah execution policy:

1. Buka **PowerShell as Administrator**
2. Jalankan:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Ketik **Y** untuk confirm

---

## Tips

1. **Ganti Icon:**
   - Download icon dari [flaticon.com](https://www.flaticon.com/) atau [icons8.com](https://icons8.com/)
   - Simpan sebagai `.ico` file
   - Gunakan di shortcut properties

2. **Keyboard Shortcut:**
   - Di shortcut properties, tab **Shortcut**
   - Di **Shortcut key:** tekan kombinasi keyboard (contoh: `Ctrl + Alt + K`)
   - Sekarang bisa tekan kombinasi tersebut untuk menjalankan app

3. **Minimize Window:**
   - Di shortcut properties, tab **Shortcut**
   - Di **Run:** pilih **Minimized**
   - Window akan langsung minimize saat dijalankan

---

## File yang Dibutuhkan

Pastikan file berikut ada di folder project:
- ✅ `start-app.bat` (untuk Windows Batch)
- ✅ `start-app.ps1` (untuk PowerShell - opsional)
- ✅ `package.json`
- ✅ `docker-compose.yml`
- ✅ `.env`

---

**Selamat! Sekarang Anda bisa menjalankan web app dengan sekali klik! 🚀**

