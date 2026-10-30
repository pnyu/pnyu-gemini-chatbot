# Checklist Final Project — Hacktiv8 Sesi 3 Developers

## Persyaratan materi
- [x] Chatbot berbasis web dengan HTML, CSS, dan Vanilla JavaScript.
- [x] REST API Node.js + Express; endpoint POST `/api/chat`.
- [x] SDK Gemini (`@google/genai`) + `generateContent()`.
- [x] Kustomisasi AI: persona PNYU, system instruction dan parameter model.
- [x] Riwayat percakapan dan feedback UI ketika menunggu respons.
- [ ] Uji end-to-end menggunakan API key Gemini sendiri.
- [ ] Screenshot tampilan chatbot dari aplikasi yang berjalan.
- [ ] Publikasikan kode ke repository GitHub pribadi (rahasia tidak ikut tersimpan).
- [ ] Submit URL repository GitHub dan screenshot UI ke form tugas.

## Langkah submit
1. Buat file `.env` dari `.env.example`, tanpa memasukkan file rahasia ke Git.
2. Jalankan `npm install`, `npm test`, `npm run dev`.
3. Uji browser dan Postman; ambil screenshot aplikasi.
4. Buat repository GitHub terpisah untuk proyek tugas (tidak harus menggunakan repository website PNYU).
5. Jalankan:

```bash
git init
git add .
git commit -m "Final Project Gemini Chatbot - PNYU Percetakan"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

6. Submit ke form yang tercantum dalam materi Sesi 3: https://bit.ly/finalproject-developers

**Jangan memasukkan API key, password, atau file `.env` ke GitHub.**

**Catatan:** Materi menyebut tenggat H+2 Sesi 3 pukul 23.59 WIB; verifikasi deadline nyata pada kelas.
