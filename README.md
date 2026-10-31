Chatbot P’NYU Percetakan
Chatbot layanan informasi dan konsultasi awal berbasis Google Gemini API, dibuat sebagai Final Project Hacktiv8 — AI Productivity and AI API Integration for Developers, Sesi 3.

Saya menggunakan kebutuhan layanan pelanggan P’NYU Percetakan sebagai studi kasus. Tujuannya adalah memudahkan calon pelanggan memperoleh informasi awal tentang produk cetak, menyiapkan detail pesanan, dan menemukan kanal pemesanan resmi. Proyek ini juga saya siapkan sebagai dasar pengembangan chatbot untuk website P’NYU di kemudian hari.

Status: Prototipe berjalan di komputer lokal dan sudah diuji menggunakan Gemini API. Belum dipasang di website produksi atau dibuka sebagai layanan publik.
Fungsi utama
- Menjawab pertanyaan awal mengenai produk dan kebutuhan percetakan.
- Menindaklanjuti pertanyaan dalam satu percakapan menggunakan konteks pesan sebelumnya.
- Membantu pelanggan menentukan informasi yang perlu disiapkan: jenis produk, ukuran, jumlah, file desain, serta tanggal dibutuhkan.
- Mengarahkan pelanggan ke katalog, formulir pemesanan, atau WhatsApp resmi P’NYU.
- Menyediakan mode demo untuk menguji antarmuka tanpa melakukan panggilan ke Gemini API.
- Menampilkan pesan kesalahan apabila input tidak valid atau layanan AI belum dapat diakses.
Chatbot tidak menetapkan harga akhir, menjamin waktu produksi, memproses pembayaran, atau memeriksa status pesanan. Hal-hal tersebut tetap memerlukan konfirmasi tim P’NYU.
Teknologi
Bagian	Teknologi
Antarmuka	HTML, CSS, dan JavaScript
Server/API	Node.js dan Express
Model AI	Google Gemini melalui @google/genai
Endpoint chat	POST /api/chat
Pengaturan AI	System Instruction, temperature, topP, dan topK
Pengujian	Node.js test runner dan pengujian melalui browser


Menjalankan proyek
Persiapan: Node.js versi 20 atau lebih baru dan API key dari Google AI Studio.
1. Buka folder proyek pada Visual Studio Code.
2. Jalankan instalasi dependensi:
   npm install
3. Salin .env.example menjadi .env. Untuk PowerShell:
   Copy-Item .env.example .env
4. Isi GEMINI_API_KEY di file .env, pilih GEMINI_MODEL yang tersedia untuk akun yang digunakan, lalu atur DEMO_MODE=false. Jika hanya ingin mencoba tampilan, gunakan DEMO_MODE=true.
5. Jalankan server:
   npm.cmd run dev
6. Buka http://localhost:3000 di browser. Simulasi widget tersedia di http://localhost:3000/widget-preview.html.
Untuk memeriksa kode dan menjalankan pengujian otomatis:
npm.cmd run check
npm.cmd test
File .env bersifat rahasia dan tidak boleh dikirim ke GitHub. Repository ini hanya menyertakan .env.example sebagai contoh konfigurasi tanpa API key.

Pengujian dan hasil
Selama pengerjaan, saya menjalankan dan menguji chatbot langsung di komputer Windows. Hasil yang telah diperiksa:
Pengujian	Hasil
Pemeriksaan sintaks JavaScript	Berhasil
Pengujian otomatis	10 lulus, 0 gagal
Menjalankan aplikasi di localhost:3000	Berhasil
Mengirim dan menerima pesan dalam mode demo	Berhasil
Meminta respons dari Gemini API asli	Berhasil
Konsultasi banner ukuran 3 × 1 meter	Respons relevan terhadap kebutuhan cetak
Pertanyaan harga dan permintaan selesai besok	Chatbot tidak memberi kepastian tanpa konfirmasi tim


Ada dua kendala konfigurasi yang saya temui ketika mencoba aplikasi: pembatasan origin yang membuat pesan ditolak, dan pilihan model Gemini awal yang tidak dapat digunakan pada akun saya. Setelah pengaturan diperbaiki dan server dijalankan kembali, pesan dapat diproses dan dijawab oleh Gemini.

Saya menggunakan AI sebagai alat bantu dalam penyusunan dan penyempurnaan kode, sesuai fokus pelatihan. Konfigurasi lokal, percobaan penggunaan, pemeriksaan hasil, dan publikasi proyek ke GitHub saya lakukan selama praktik.
Struktur proyek
pnyu-gemini-chatbot/
├── assets/                    # Pratinjau tampilan
├── public/                    # HTML, CSS, JavaScript, dan widget
├── src/                       # Endpoint, konfigurasi, dan informasi bisnis
├── test/                      # Pengujian otomatis
├── index.js                   # Menjalankan server
├── package.json
├── .env.example               # Contoh konfigurasi
├── .gitignore
├── README.md
├── CHECKLIST_FINAL_PROJECT.md
└── INTEGRASI_WEBSITE.md
Batasan dan rencana pengembangan
Informasi yang digunakan chatbot berasal dari referensi dasar P’NYU, bukan pencarian katalog atau data pesanan secara real-time. Belum tersedia integrasi dengan pembayaran, database pelanggan, maupun pengiriman WhatsApp otomatis.

Sebelum aplikasi digunakan oleh pelanggan secara publik, saya perlu memverifikasi kembali informasi produk, memeriksa perlindungan data dan biaya penggunaan API, menyiapkan hosting HTTPS, dan menguji widget pada lingkungan staging. Website utama P’NYU tidak diubah dalam pengerjaan proyek ini.
Tautan
- Repository: https://github.com/pnyu/pnyu-gemini-chatbot
- Website usaha: https://pnyupercetakan.com/
- Referensi pembelajaran: Materi Hacktiv8 Sesi 3 — Pembuatan Chatbot berbasis Gemini AI Model
- Dokumentasi Gemini API: https://ai.google.dev/gemini-api/docs
Pengelola proyek: P’NYU Percetakan — GitHub pnyu.