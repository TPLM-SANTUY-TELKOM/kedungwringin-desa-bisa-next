export default function Home() {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              🌾 Kedungwringin Desa Bisa
            </h1>
          </div>
          <p className="text-white/90 text-lg md:text-xl">
            Portal Informasi Desa DigitalAAAAAAAAAAAAAAA
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">📡 Status Server</h2>
                <p className="text-white/80">Local Development Server</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                <p className="text-white/70 text-sm mb-1">🌐 Network Access</p>
                <p className="text-white font-bold text-lg">192.168.1.150:3000</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                <p className="text-white/70 text-sm mb-1">📅 Tanggal</p>
                <p className="text-white font-bold">{currentDate}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                <p className="text-white/70 text-sm mb-1">⏰ Waktu</p>
                <p className="text-white font-bold">{currentTime} WIB</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition hover:scale-105">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">Mobile Access</h3>
              <p className="text-white/80">
                Akses dari HP, tablet, atau laptop lainnya yang terhubung WiFi yang sama
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition hover:scale-105">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="text-xl font-bold text-white mb-2">Live Development</h3>
              <p className="text-white/80">
                Hot reload aktif - perubahan kode langsung terlihat di browser
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition hover:scale-105">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-xl font-bold text-white mb-2">LAN Network</h3>
              <p className="text-white/80">
                Server berjalan di jaringan lokal dengan IP static 192.168.1.150
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition hover:scale-105">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Next.js 16</h3>
              <p className="text-white/80">
                Powered by Next.js 16 dengan Turbopack untuk performance maksimal
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
                📋 Berita Desa
              </a>
              <a href="#" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
                🗺️ Peta Desa
              </a>
              <a href="#" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
                📊 Laporan
              </a>
              <a href="#" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
                👥 Kontak
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/80">
          <p>© 2025 Kedungwringin Desa Bisa - Next.js Development Server</p>
          <p className="text-sm mt-2">Akses dari perangkat lain: http://192.168.1.150:3000</p>
        </footer>
      </div>
    </div>
  );
}
