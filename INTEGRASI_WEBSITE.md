# Panduan Integrasi Widget Chatbot pada Website PNYU

## Status dan batasan
Website `https://pnyupercetakan.com/` berhasil diakses publik pada 30 Oktober 2026. **Stack framework website, hosting, hak akses repo, dan konfigurasi produksi belum diverifikasi** dalam pekerjaan ini. Tidak ada perubahan pada produksi.

## Arsitektur yang disarankan (tidak mengunci stack website)
Website PNYU (pengunjung) → tombol widget PNYU → REST API dari layanan Node.js terpisah → Google Gemini API.

Keuntungan: tidak perlu menaruh `GEMINI_API_KEY` pada frontend / repositori website. Beban AI tetap di backend terpisah dan dapat diuji/di-rollback tanpa mengganggu situs inti.

## Tahapan penerapan
1. Jalankan `npm install`, `.env`, dan `npm test` lokal. Coba `http://localhost:3000` dan `/widget-preview.html`.
2. Uji Gemini live menggunakan API key pada backend melalui Postman. Pastikan tanggapan tidak mengarang harga, stok, waktu produksi, dan status pesanan.
3. Pilih hosting yang mendukung Node.js dan HTTPS. Deploy folder proyek ke lingkungan *staging* terlebih dulu. Gunakan variabel lingkungan pada panel hosting (bukan `.env` di GitHub).
4. Isi misalnya `CORS_ORIGINS=https://pnyupercetakan.com,https://www.pnyupercetakan.com`. `DEMO_MODE=false` saat staging live. Tentukan model yang tersedia bagi API key.
5. Uji endpoint `https://HOST-CHATBOT/api/health` dan kirim POST ke `/api/chat` di staging.
6. Pada halaman website staging, muat script widget berikut (ganti HOST-CHATBOT dengan domain HTTPS hosting Anda):

```html
<script defer src="https://HOST-CHATBOT/widget.js" data-api-base="https://HOST-CHATBOT"></script>
```

7. Pastikan CORS/CSP website mengizinkan host script dan koneksi API. Cek aksesibilitas, tampilan mobile, galat API, kelayakan jawaban, abuse test, dan biaya kuota.
8. Tinjau **Kebijakan Privasi** situs karena chat dapat memproses konten pertanyaan melalui penyedia AI eksternal. Perbarui pemberitahuan dan kebijakan sesuai keputusan pengelola dan ketentuan hukum yang berlaku.
9. Sebelum publikasi: review kode, setup backup/rollback, rate limiting terpusat jika lebih dari satu instance, kontrol biaya, lalu minta persetujuan pemilik PNYU untuk merilis.

## Tentang kode website PNYU
Karena stack belum terverifikasi, **jangan langsung menyalin snippet ke produksi**. Untuk Next.js/React bisa memerlukan pengaturan script melalui komponen framework / CSP. Lakukan integrasi melalui repository yang benar setelah memperoleh akses dan audit awal.

## Batasan layanan chatbot
- Pemberi informasi awal, bukan mesin transaksi.
- Tidak terhubung ke status pesanan resmi, database stok, sistem harga, atau pembayaran.
- Tidak melakukan pengiriman WhatsApp otomatis. Pengguna sendiri mengklik tautan resmi.
- Tidak memiliki kemampuan menerima/membaca file desain secara langsung.
- Chatbot harus membantu pelanggan mengumpulkan kebutuhan cetak, kemudian beralih ke formulir / WhatsApp untuk konfirmasi manusia.

## Konfirmasi sebelum go-live
- Akses repository website yang sah, framework/hosting, lokasi penempatan script.
- Subdomain atau URL hosting AI, kebijakan privasi, akses API key (dikelola di server, jangan dikirim di chat).
- Persetujuan atas konten chatbot, alur eskalasi WhatsApp, dan apakah layanan ini akan dipasang di seluruh halaman.
- Rencana pemantauan error, biaya API, perlindungan spam, dan rollback.
