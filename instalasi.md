# Panduan Instalasi Software untuk Development

Dokumen ini berisi daftar lengkap software yang perlu diinstall di device baru untuk development project **Kedungwringin - Sistem Informasi Desa**.

---

## Daftar Software yang Diperlukan

### 1. Node.js (Wajib)
**Versi minimum**: v20.0.0 atau lebih baru

Node.js adalah runtime JavaScript yang diperlukan untuk menjalankan Next.js dan semua dependencies project.

#### Windows
1. Download installer dari [nodejs.org](https://nodejs.org/)
2. Pilih versi **LTS (Long Term Support)** - direkomendasikan
3. Jalankan installer dan ikuti wizard
4. Pastikan opsi "Add to PATH" dicentang
5. Restart terminal/PowerShell setelah instalasi

**Verifikasi instalasi:**
```bash
node --version
npm --version
```

#### macOS
**Menggunakan Homebrew (direkomendasikan):**
```bash
brew install node@20
```

**Atau download installer:**
1. Download dari [nodejs.org](https://nodejs.org/)
2. Jalankan installer `.pkg`
3. Ikuti wizard instalasi

**Verifikasi instalasi:**
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Node.js menggunakan NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node --version
npm --version
```

#### Linux (Fedora/RHEL)
```bash
# Install menggunakan dnf
sudo dnf install nodejs npm
```

---

### 2. Package Manager (Wajib - Otomatis terinstall dengan Node.js)

Node.js sudah include **npm** secara default. Namun, Anda bisa menggunakan package manager alternatif:

#### npm (Default - Sudah terinstall dengan Node.js)
Tidak perlu instalasi tambahan.

#### Yarn (Opsional)
```bash
# Install Yarn secara global
npm install -g yarn

# Verifikasi
yarn --version
```

#### pnpm (Opsional - Lebih cepat dan hemat disk)
```bash
# Install pnpm secara global
npm install -g pnpm

# Verifikasi
pnpm --version
```

#### Bun (Opsional - Runtime JavaScript yang sangat cepat)
**Windows:**
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

---

### 3. Docker Desktop (Wajib)

Docker diperlukan untuk menjalankan PostgreSQL database secara lokal tanpa instalasi manual.

#### Windows
1. Download **Docker Desktop for Windows** dari [docker.com](https://www.docker.com/products/docker-desktop/)
2. Pastikan **WSL 2** sudah terinstall (Windows akan memandu jika belum)
3. Jalankan installer dan ikuti wizard
4. Restart komputer setelah instalasi
5. Buka Docker Desktop dan tunggu hingga status "Running"

**Verifikasi instalasi:**
```bash
docker --version
docker-compose --version
```

#### macOS
1. Download **Docker Desktop for Mac** dari [docker.com](https://www.docker.com/products/docker-desktop/)
2. Pilih versi sesuai chip:
   - **Apple Silicon (M1/M2/M3)**: Download versi untuk Apple Silicon
   - **Intel**: Download versi untuk Intel
3. Drag Docker.app ke Applications folder
4. Buka Docker Desktop dari Applications
5. Tunggu hingga status "Running"

**Verifikasi instalasi:**
```bash
docker --version
docker-compose --version
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine dan Docker Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user ke docker group (untuk menjalankan tanpa sudo)
sudo usermod -aG docker $USER

# Logout dan login kembali agar perubahan berlaku

# Verifikasi
docker --version
docker compose version
```

**Catatan Linux:** Setelah instalasi, logout dan login kembali agar perubahan group berlaku.

---

### 4. Git (Wajib)

Git diperlukan untuk version control dan clone repository.

#### Windows
1. Download dari [git-scm.com](https://git-scm.com/download/win)
2. Jalankan installer
3. Pilih opsi default (recommended)
4. Pilih "Git from the command line and also from 3rd-party software"
5. Selesaikan instalasi

**Verifikasi instalasi:**
```bash
git --version
```

#### macOS
**Menggunakan Homebrew:**
```bash
brew install git
```

**Atau download installer:**
1. Download dari [git-scm.com](https://git-scm.com/download/mac)
2. Jalankan installer

**Verifikasi instalasi:**
```bash
git --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y git

# Verifikasi
git --version
```

**Konfigurasi Git (setelah instalasi):**
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

---

### 5. Code Editor (Sangat Direkomendasikan)

#### Visual Studio Code (Direkomendasikan)
1. Download dari [code.visualstudio.com](https://code.visualstudio.com/)
2. Install sesuai OS Anda
3. Install extension yang direkomendasikan:
   - **ES7+ React/Redux/React-Native snippets**
   - **Tailwind CSS IntelliSense**
   - **TypeScript and JavaScript Language Features** (built-in)
   - **ESLint**
   - **Prettier - Code formatter**
   - **Docker** (untuk manage Docker containers)
   - **PostgreSQL** (untuk manage database)

**Extension yang direkomendasikan untuk project ini:**
```bash
# Install via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-azuretools.vscode-docker
code --install-extension ckolkman.vscode-postgres
```

#### Alternatif Editor
- **WebStorm** (JetBrains) - Berbayar, sangat powerful
- **Sublime Text** - Ringan dan cepat
- **Atom** - Open source (tidak lagi aktif dikembangkan)

---

### 6. Browser untuk Testing (Wajib)

Install minimal 2 browser untuk testing:

1. **Google Chrome** - [chrome.google.com](https://www.google.com/chrome/)
2. **Mozilla Firefox** - [mozilla.org/firefox](https://www.mozilla.org/firefox/)
3. **Microsoft Edge** (Windows) - Sudah terinstall di Windows 10/11

**Chrome DevTools** sangat penting untuk debugging web application.

---

### 7. PostgreSQL Client Tools (Opsional)

Karena database sudah berjalan di Docker, instalasi PostgreSQL client tools bersifat opsional. Namun sangat berguna untuk manage database secara langsung.

#### Windows
1. Download **pgAdmin** dari [pgadmin.org](https://www.pgadmin.org/download/)
2. Atau install **DBeaver** (universal database tool) dari [dbeaver.io](https://dbeaver.io/download/)

#### macOS
```bash
# Install menggunakan Homebrew
brew install --cask pgadmin4

# Atau DBeaver
brew install --cask dbeaver-community
```

#### Linux (Ubuntu/Debian)
```bash
# Install pgAdmin
sudo apt update
sudo apt install -y pgadmin4

# Atau DBeaver
wget -O - https://dbeaver.io/debs/dbeaver.gpg.key | sudo apt-key add -
echo "deb https://dbeaver.io/debs/dbeaver-ce /" | sudo tee /etc/apt/sources.list.d/dbeaver.list
sudo apt update
sudo apt install -y dbeaver-ce
```

**Catatan:** Untuk connect ke database Docker, gunakan:
- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `kedungwringin`

---

## Checklist Instalasi

Gunakan checklist berikut untuk memastikan semua software sudah terinstall:

- [ ] **Node.js** v20+ terinstall
  ```bash
  node --version  # Harus menunjukkan v20.x.x atau lebih baru
  ```

- [ ] **npm** terinstall
  ```bash
  npm --version
  ```

- [ ] **Docker** terinstall dan running
  ```bash
  docker --version
  docker ps  # Harus bisa menjalankan tanpa error
  ```

- [ ] **Docker Compose** terinstall
  ```bash
  docker-compose --version
  # atau untuk versi baru
  docker compose version
  ```

- [ ] **Git** terinstall
  ```bash
  git --version
  ```

- [ ] **Code Editor** terinstall (VS Code direkomendasikan)

- [ ] **Browser** untuk testing terinstall (Chrome/Firefox)

---

## Verifikasi Instalasi Lengkap

Jalankan perintah berikut untuk memverifikasi semua software sudah terinstall dengan benar:

```bash
# Check Node.js dan npm
node --version && npm --version

# Check Docker
docker --version && docker-compose --version

# Check Git
git --version

# Check Docker bisa running
docker ps
```

Jika semua perintah berjalan tanpa error, berarti instalasi sudah lengkap! ✅

---

## Troubleshooting Instalasi

### Node.js tidak dikenali di terminal
- **Windows**: Restart terminal/PowerShell setelah instalasi
- **macOS/Linux**: Pastikan Node.js ada di PATH
  ```bash
  echo $PATH | grep node
  ```

### Docker tidak bisa running
- **Windows**: Pastikan WSL 2 sudah terinstall dan Docker Desktop running
- **macOS**: Pastikan Docker Desktop aplikasi sudah dibuka
- **Linux**: Pastikan Docker service running
  ```bash
  sudo systemctl status docker
  sudo systemctl start docker  # Jika belum running
  ```

### Port 5432 sudah digunakan
Jika port 5432 sudah digunakan aplikasi lain:
1. Stop aplikasi yang menggunakan port tersebut
2. Atau ubah port di `docker-compose.yml` dan `.env`

### Permission denied di Linux
Jika mendapat error "permission denied" saat menjalankan Docker:
```bash
# Add user ke docker group
sudo usermod -aG docker $USER

# Logout dan login kembali
```

---

## Langkah Selanjutnya

Setelah semua software terinstall, lanjutkan ke:

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd kedungwringin-desa-bisa-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database dengan Docker**
   ```bash
   docker-compose up -d
   ```

4. **Setup environment variables**
   - Copy `.env` atau buat file `.env.local`
   - Sesuaikan konfigurasi database jika perlu

5. **Jalankan development server**
   ```bash
   npm run dev
   ```

6. **Buka browser**
   - Buka [http://localhost:3000](http://localhost:3000)

Untuk detail lebih lengkap, lihat [README.md](./README.md)

---

## Referensi Instalasi

- [Node.js Documentation](https://nodejs.org/docs/)
- [Docker Documentation](https://docs.docker.com/get-started/)
- [Git Documentation](https://git-scm.com/doc)
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Project**: Kedungwringin - Sistem Informasi Desa  
**Tech Stack**: Next.js 16, React 19, PostgreSQL, Docker

