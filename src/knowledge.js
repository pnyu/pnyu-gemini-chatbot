// Snapshot informasi resmi pnyupercetakan.com yang diverifikasi 30 Oktober 2026.
// Jangan menyisipkan daftar harga atau janji SLA tanpa persetujuan pemilik usaha.
export const BUSINESS = Object.freeze({
  name: 'PNYU Percetakan',
  website: 'https://pnyupercetakan.com',
  whatsapp: '6281220817037',
  phoneDisplay: '0812-2081-7037',
  address: 'Perumahan Teras Citra Blok A2 No. 5, Cukanggalih, Curug, Kabupaten Tangerang',
  hours: 'Senin–Sabtu, 08.00–21.00 WIB',
  categoriesCount: 22,
  listedItemsCount: 243,
  productExamples: ['banner', 'spanduk', 'stiker', 'kartu nama', 'undangan', 'kalender', 'brosur', 'kemasan/label', 'merchandise', 'kebutuhan event', 'percetakan kantor', 'percetakan sekolah'],
  catalog: 'https://pnyupercetakan.com/katalog/',
  order: 'https://pnyupercetakan.com/pemesanan/',
  howToOrder: 'https://pnyupercetakan.com/cara-pesan/',
  faq: 'https://pnyupercetakan.com/faq/',
  privacy: 'https://pnyupercetakan.com/kebijakan-privasi/',
  sources: ['https://pnyupercetakan.com/', 'https://pnyupercetakan.com/katalog/', 'https://pnyupercetakan.com/faq/', 'https://pnyupercetakan.com/cara-pesan/', 'https://pnyupercetakan.com/kebijakan-privasi/']
});

export function whatsappUrl(message = 'Halo PNYU Percetakan, saya ingin konsultasi kebutuhan cetak.') {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
