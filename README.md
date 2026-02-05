# Haditha – AI Islami Super App

**Haditha** adalah aplikasi ekosistem Islami komprehensif yang menjembatani kemurnian ilmu syar'i dengan teknologi modern. Dibangun dengan **Next.js 14**, aplikasi ini menghadirkan fitur-fitur canggih mulai dari asisten AI, peta sejarah interaktif, hingga permainan edukasi yang dirancang khusus untuk penuntut ilmu.

![Haditha Showcase](/public/icon.png)

---

## 🌟 Fitur Unggulan

### 1. 🤖 Haditha AI (Assistant)
Asisten cerdas yang siap menjawab pertanyaan keislaman Anda.
- **Kontekstual & Akurat**: Menggunakan LLM canggih untuk memahami pertanyaan kompleks.
- **Dalil Valid**: Jawaban selalu menyertakan referensi Al-Qur'an dan Hadits yang shahih.
- **Manhaj Salaf**: Disaring agar sesuai dengan pemahaman Ahlussunnah wal Jama'ah.

### 2. �️ Peta Sejarah Islam (Interactive Map)
Jelajahi penyebaran Islam dari masa ke masa melalui peta interaktif.
- **Timeline Era**: Pilih era sejarah (Khulafaur Rasyidin, Umayyah, Abbasiyah, Utsmaniyah).
- **Visualisasi Wilayah**: Lihat batas wilayah kekuasaan Islam di setiap masa.
- **Detail Lokasi**: Klik penanda untuk melihat informasi sejarah mendalam tentang situs-situs penting.

### 3. � Artikel Islami (Smart Reader)
Aggregator berita dan artikel Islami dari sumber terpercaya (Muslim.or.id, Rumaysho, Almanhaj).
- **Auto-Scraping**: Teknologi *Smart Fetch* yang otomatis mengambil isi lengkap artikel jika RSS hanya menyediakan ringkasan.
- **Mode Baca Nyaman**: Tampilan bersih tanpa iklan yang mengganggu.
- **Attribution**: Selalu menyertakan sumber asli dan link kembali ke penulis.

### 4. 🎮 Edukasi & Permainan (Gamification)
Belajar agama menjadi menyenangkan dengan fitur *play-to-learn*.
- **Game Al-Qur'an**: Tebak nama surat dan sambung ayat.
- **Game Hadits**: Uji hafalan matan dan sanad dari Hadits Arba'in.
- **Game Mufrodat**:
  - *Tebak Arti*: Kuis pilihan ganda kosakata bahasa Arab.
  - *Cocokkan Kartu*: Permainan memori visual untuk menghafal kata.

### 5. 🕌 Ibadah Harian
- **Jadwal Sholat**: Akurat sesuai lokasi GPS pengguna (Kemenag).
- **Arah Kiblat**: Kompas digital visual dengan deteksi sensor perangkat.
- **Kalender Hijriyah**: Konversi otomatis tanggal Masehi ke Hijriyah.
- **Doa-Doa Harian**: Kumpulan doa shahih dari Al-Qur'an dan Sunnah (Hisnul Muslim).

### 6. 📖 Referensi Digital
- **Al-Qur'an Digital**: 30 Juz lengkap dengan terjemahan dan audio.
- **Ensiklopedia Hadits**: Akses ke ribuan hadits dari kitab-kitab induk.
- **Kamus Mufrodat**: Ribuan kosakata bahasa Arab dikategorikan dengan rapi.

---

## 🛠️ Teknologi & Stack

Aplikasi ini dibangun menggunakan teknologi web modern untuk performa maksimal dan pengalaman pengguna yang mulus (PWA Ready).

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Type-safe development)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Data Fetching**: 
  - `rss-parser` untuk feed artikel.
  - `cheerio` untuk scraping konten artikel on-demand.
  - `axios` & `swr` untuk API handling.
- **AI Integration**: OpenRouter API (Access to DeepSeek/Claude/GPT models).

---

## 📂 Struktur Proyek

```
/app
  ├── /ai           # Halaman Chat AI
  ├── /api          # Route Handlers (Backend API)
  │     ├── /articles   # RSS & Scraping Logic
  │     └── ...
  ├── /articles     # Halaman List & Detail Artikel
  ├── /hadits       # Fitur Hadits & Game
  ├── /mufradat     # Fitur Mufrodat & Game
  ├── /peta         # Peta Sejarah Interaktif
  ├── /quran        # Fitur Al-Qur'an & Game
  └── page.tsx      # Dashboard Utama
/components         # Reusable UI Components (Navbar, Cards, etc.)
/lib                # Utility functions & Supabase Client
/public             # Static assets (Images, Icons)
```

---

## ⚙️ Cara Menjalankan (Local Development)

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal Anda.

### Prasyarat
- Node.js versi 18.17 atau yang lebih baru.
- Akun Supabase (untuk database).
- API Key OpenRouter (untuk fitur AI).

   git clone {repository url}
   cd {repository name}
   ```

2. **Install Dependencies**
   
   npm install
   ```

3. **Setup Environment Variables**
   Buat file `.env.local` di root folder dan isi konfigurasi berikut:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_key
   ```

4. **Jalankan Server Development**
   ```bash
   npm run dev
   ```

5. **Buka Aplikasi**
   Akses `http://localhost:3000` di browser Anda.

---

## �️ Atribusi & Sumber Data

Kami berdedikasi untuk menjaga kebenaran ilmiah dan hak cipta. Aplikasi ini menggunakan data dari:
- **Al-Qur'an**: Kemenag RI & Quran.com API
- **Hadits**: Ensiklopedia Hadits (Lidwa Pusaka) & Kutubut Tis'ah
- **Artikel**: RSS Feeds resmi dari Muslim.or.id, Rumaysho.com, Almanhaj.or.id
- **Peta**: OpenStreetMap & kontributor sejarah Islam

---

## 👨‍� Pengembang

Dikembangkan dengan ❤️ oleh **M.K Bahtiar (Salafy Tech)**.
*Teknologi untuk Dakwah, Inovasi untuk Ummat.*
