# 🗺️ WebGIS Sidigede

**Analisis Aksesibilitas Fasilitas Publik Desa Sidigede**

Aplikasi WebGIS interaktif untuk menganalisis aksesibilitas fasilitas publik (Pendidikan, Kesehatan, Tempat Ibadah) di Desa Sidigede, Kecamatan Welahan, Kabupaten Jepara.

![WebGIS Sidigede](https://img.shields.io/badge/React-18.3-blue) ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green) ![Supabase](https://img.shields.io/badge/Supabase-Database-orange)

## ✨ Fitur

- 🗺️ **Peta Interaktif** - Menampilkan 22+ fasilitas publik dengan marker berwarna
- 🔍 **Filter Kategori** - Filter berdasarkan Pendidikan, Kesehatan, atau Tempat Ibadah
- 📏 **Buffer Analysis** - Zona jangkauan 500m, 1km, dan 2km
- 📍 **Nearest Facility** - Klik peta untuk mencari fasilitas terdekat
- 📐 **Measurement Tool** - Ukur jarak antara 2 fasilitas
- 🔐 **Admin Panel** - Login admin untuk mengelola data fasilitas (CRUD)

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Peta:** Leaflet.js, React-Leaflet
- **Analisis Spasial:** Turf.js
- **Backend:** Supabase (PostgreSQL + Auth)
- **Icons:** Lucide React

## 🚀 Instalasi

### Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Supabase (untuk fitur admin)

### Setup

1. **Clone repository**
```bash
git clone https://github.com/alokmakanjambu/webgis-sidigede.git
cd webgis-sidigede
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Jalankan development server**
```bash
npm run dev
```

5. **Buka di browser**
```
http://localhost:5173
```

## 📊 Setup Database Supabase

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Create table
CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  jenis TEXT,
  kategori TEXT NOT NULL,
  alamat TEXT,
  pengelola TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read" ON facilities FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON facilities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON facilities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON facilities FOR DELETE TO authenticated USING (true);
```

## 📁 Struktur Proyek

```
webgis-sidigede/
├── public/data/           # GeoJSON data files
├── src/
│   ├── components/
│   │   ├── Admin/         # Admin panel components
│   │   ├── Auth/          # Authentication components
│   │   ├── Layout/        # Sidebar
│   │   ├── Map/           # Map layers & tools
│   │   └── UI/            # Legend
│   ├── contexts/          # React contexts
│   ├── lib/               # Supabase client
│   └── utils/             # Spatial utilities
└── ...
```

## 🎯 Penggunaan

### Peta Publik
1. Gunakan filter kategori di sidebar
2. Toggle buffer zones untuk lihat jangkauan
3. Klik peta untuk cari fasilitas terdekat
4. Aktifkan "Mode Ukur" untuk ukur jarak antar fasilitas

### Admin Panel
1. Klik "Login Admin" di sidebar
2. Login dengan email/password
3. Kelola fasilitas: Tambah, Edit, Hapus

## 📝 Data

Aplikasi ini menggunakan data fasilitas publik Desa Sidigede:
- **10 Fasilitas Pendidikan** (SD, MTS, MI, TPQ, PAUD, Ponpes)
- **3 Fasilitas Kesehatan** (Bidan, Apotek)
- **9 Tempat Ibadah** (Masjid, Mushola)

## 📄 License

MIT License

## 👨‍💻 Author

Dibuat untuk tugas UAS QGIS - Desa Sidigede, Kec. Welahan, Kab. Jepara
