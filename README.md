# P’NYU Percetakan — Chatbot Gemini AI

**Dua kegunaan:** (1) Final Project Hacktiv8 Sesi 3 Developers dan (2) fondasi widget customer service untuk website resmi `https://pnyupercetakan.com/`.

**Status:** Prototipe mandiri, BELUM dipasang di website produksi. Integrasi, keamanan publik dan koneksi live Gemini masih memerlukan pengujian/approval.

## Yang sudah disediakan
- Frontend mandiri HTML, CSS, Vanilla JavaScript dengan branding navy–oranye–putih.
- Widget mengambang `public/widget.js` berbasis Shadow DOM, sehingga dapat dipasang tanpa bergantung pada framework website utama.
- Backend Node.js + Express, endpoint `POST /api/chat` dan `GET /api/health`.
- SDK resmi Gemini `@google/genai` dengan `generateContent()`, `System Instruction`, `temperature`, `topP`, `topK`.
- Multi-turn chat; respons kesalahan; prompt contoh; tautan langsung katalog, formulir pemesanan, WhatsApp.
- Basis pengetahuan terkurasi dari website PNYU (bukan pencarian live dan bukan database real-time).
- Perlindungan awal: API key hanya di server, batas pesan, pembatas permintaan per-IP, daftar origin yang diizinkan, tidak mengirim output AI sebagai HTML, tanpa database penyimpan chat.
- Mode demo jelas berlabel simulasi, untuk presentasi jika API key belum tersedia.

## Sumber informasi PNYU (dicek 30 Oktober 2026)
Website resmi menampilkan **22 kategori dan 243 produk/layanan** pada waktu pemeriksaan. Ada catatan historis jumlah yang berbeda; website live digunakan sebagai acuan snapshot ini. Info kontak, jam, alur pemesanan dan FAQ diambil dari:
- https://pnyupercetakan.com/
- https://pnyupercetakan.com/katalog/
- https://pnyupercetakan.com/faq/
- https://pnyupercetakan.com/cara-pesan/
- https://pnyupercetakan.com/kebijakan-privasi/

Tidak ada daftar harga, koneksi ke basis data pesanan, cek status aktual, upload file, atau otomatisasi WhatsApp di proyek ini.

## Instalasi di Windows
1. Pasang Node.js versi 20 atau lebih baru dan VS Code.
2. Buka folder proyek di VS Code, jalankan `npm install`.
3. Salin `.env.example` ke `.env`: di PowerShell `Copy-Item .env.example .env`.
4. Untuk menggunakan Gemini asli, isi `GEMINI_API_KEY=...` lalu ubah `DEMO_MODE=false`.
5. Jalankan `npm run dev` dan buka `http://localhost:3000`.
6. Simulasi widget di `http://localhost:3000/widget-preview.html`.
7. Jalankan tes `npm test`; cek sintaks `npm run check`.

**API Key:** https://aistudio.google.com/app/apikey — jangan kirimkan key di chat atau commit key ke GitHub.

**Model:** default `GEMINI_MODEL=gemini-2.5-flash` agar sesuai Sesi 3. Jika model ini tidak tersedia untuk akun Anda, periksa https://ai.google.dev/gemini-api/docs/models dan pilih model yang tersedia. Konfigurasi kemampuan `topK` juga bisa berbeda menurut model.

## Pengujian via Postman
Method: POST, URL: `http://localhost:3000/api/chat`, Body → raw → JSON:

```json
{
  "conversation": [
    { "role": "user", "text": "Saya mau cetak spanduk 3 x 1 meter. Apa yang perlu disiapkan?" }
  ]
}
```

Contoh bentuk hasil:

```json
{ "result": "[jawaban AI]", "demo": false }
```

Field `conversation` dan respons `result` dipakai **secara konsisten**, untuk menyelaraskan perbedaan contoh payload pada slide 29 dan 37 materi Sesi 3.

## File penting
```
pnyu-gemini-chatbot/
├── index.js                 # Membuat client Gemini dan menjalankan Express
├── src/
│   ├── app.js               # REST API + validasi + basic rate limiter
│   ├── chatConfig.js        # System Instruction, parameter Gemini
│   └── knowledge.js         # Snapshot pengetahuan resmi PNYU
├── public/
│   ├── index.html           # Aplikasi chatbot mandiri
│   ├── style.css
│   ├── script.js
│   ├── widget.js            # Embed untuk website utama
│   └── widget-preview.html  # Simulasi pemasangan widget
├── test/                    # Test konfigurasi dan endpoint mock
├── .env.example
├── .gitignore
├── package.json
├── INTEGRASI_WEBSITE.md
└── CHECKLIST_FINAL_PROJECT.md
```

## Keamanan dan keterbatasan
- **Jangan deploy demo tanpa label**. Mode demo tidak menggunakan Gemini.
- Riwayat chat ada di memori halaman pengguna selama halaman dibuka. Namun, pertanyaan pengguna dikirim ke backend dan, pada mode live, diteruskan ke penyedia model AI.
- Hindari memasukkan data pribadi sensitif pada chat; rencanakan tinjauan kebijakan privasi dan pemberitahuan penggunaan AI sebelum go-live.
- Pembatasan IP yang disertakan hanya dasar untuk satu server Node.js. Untuk trafik nyata/multi-instance, perlu rate limiting terpusat, kontrol biaya/kuota, monitoring, pengujian keamanan dan perlindungan penyalahgunaan.
- Perlu HTTPS, origin allowlist, pemeriksaan CSP/konfigurasi website, konfigurasi proxy/IP yang benar, dan approval sebelum dipakai publik.
- Tidak ada perubahan ke repositori atau website produksi PNYU yang dilakukan oleh proyek ini.

## Final Project Hacktiv8
Diperlukan URL repository GitHub dan screenshot UI. Lihat `CHECKLIST_FINAL_PROJECT.md`.

Lihat `INTEGRASI_WEBSITE.md` untuk tahapan integrasi mandiri sebelum memasang ke website produksi.
