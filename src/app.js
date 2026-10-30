import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGeminiConfig } from './chatConfig.js';
import { BUSINESS } from './knowledge.js';

const PUBLIC_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const MAX_MESSAGES = 25;
const MAX_USER_LENGTH = 3000;
const MAX_MODEL_LENGTH = 6000;
const MAX_TOTAL_LENGTH = 15000;

function validateConversation(conversation) {
  if (!Array.isArray(conversation) || conversation.length === 0) return 'Field conversation harus berupa array minimal satu pesan.';
  if (conversation.length > MAX_MESSAGES) return `Maksimal ${MAX_MESSAGES} pesan per permintaan.`;
  let total = 0;
  for (const item of conversation) {
    if (!item || !['user','model'].includes(item.role) || typeof item.text !== 'string' || !item.text.trim() ||
        item.text.length > (item.role === 'user' ? MAX_USER_LENGTH : MAX_MODEL_LENGTH)) {
      return 'Format pesan tidak valid atau terlalu panjang.';
    }
    total += item.text.length;
  }
  if (total > MAX_TOTAL_LENGTH) return 'Riwayat percakapan terlalu panjang. Mulai chat baru.';
  if (conversation.at(-1).role !== 'user') return 'Pesan terakhir harus berasal dari pengguna.';
  return null;
}

function demoAnswer(text) {
  const t = text.toLowerCase();
  let answer;
  if (/harga|biaya|berapa/.test(t)) answer = 'Harga perlu dihitung berdasarkan jenis cetak, ukuran, jumlah, bahan, dan finishing. Tim PNYU akan memberikan penawaran setelah detailnya dikonfirmasi.';
  else if (/banner|spanduk/.test(t)) answer = 'PNYU menyediakan banner dan spanduk. Untuk konsultasi, siapkan ukuran, jumlah, kebutuhan desain, serta tanggal dibutuhkan.';
  else if (/pesan|order|pemesanan/.test(t)) answer = `Lihat produk di ${BUSINESS.catalog}, kemudian isi permintaan melalui ${BUSINESS.order}. Nomor WEB adalah referensi permintaan, bukan invoice.`;
  else if (/lokasi|alamat|buka|jam/.test(t)) answer = `Lokasi PNYU: ${BUSINESS.address}. Jam layanan yang tercantum: ${BUSINESS.hours}.`;
  else if (/desain|file/.test(t)) answer = 'File desain dapat dikonsultasikan dan dikirim melalui WhatsApp agar tim dapat memeriksa kebutuhan sebelum produksi.';
  else answer = `Saya dapat membantu informasi produk, cara pemesanan, atau konsultasi cetak awal. Lihat katalog resmi ${BUSINESS.catalog} atau konsultasi via WhatsApp ${BUSINESS.phoneDisplay}.`;
  return `[MODE DEMO — simulasi, BUKAN jawaban Gemini asli]\n\n${answer}\n\nAktifkan GEMINI_API_KEY dan DEMO_MODE=false untuk menggunakan Gemini sungguhan.`;
}

// Pelindung awal untuk single-instance. Multi-instance wajib memakai limiter terdistribusi.
function rateLimiter({ windowMs = 10 * 60_000, maxRequests = 15 } = {}) {
  const states = new Map();
  return (req, res, next) => {
    const now = Date.now();
    if (states.size > 5000) for (const [key, state] of states) if (state.resetAt <= now) states.delete(key);
    const key = req.ip || 'unknown';
    let state = states.get(key);
    if (!state || state.resetAt <= now) {
      state = { count: 0, resetAt: now + windowMs };
      states.set(key, state);
    }
    state.count += 1;
    if (state.count > maxRequests) {
      res.set('Retry-After', String(Math.ceil((state.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'Batas permintaan sementara tercapai. Silakan coba kembali nanti atau hubungi WhatsApp.' });
    }
    return next();
  };
}

export function createApp({ model = 'gemini-2.5-flash', demoMode = false, hasApiKey = false, generate = null, env = process.env } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Browser cross-origin hanya diizinkan dari origin yang disetel eksplisit.
  const origins = (env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (origins.length) {
    app.use(cors({ origin(origin, callback) {
      callback(null, !origin || origins.includes(origin));
    }, methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type'] }));
  }
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (req.path.startsWith('/api/')) res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '48kb' }));
  app.use(express.static(PUBLIC_PATH, { extensions: ['html'] }));

  app.get('/api/health', (_req, res) => res.json({
    ok: true, mode: demoMode ? 'demo' : hasApiKey ? 'gemini' : 'unconfigured', model
  }));
  const rate = rateLimiter({ maxRequests: Math.max(1, Number(env.RATE_LIMIT_PER_10_MIN) || 15) });
  app.post('/api/chat', rate, async (req, res) => {
    // Ini proteksi origin tambahan, bukan autentikasi terhadap klien non-browser.
    if (origins.length && req.get('origin') && !origins.includes(req.get('origin')))
      return res.status(403).json({ error: 'Origin tidak diizinkan.' });
    const error = validateConversation(req.body?.conversation);
    if (error) return res.status(400).json({ error });
    if (demoMode) return res.json({ result: demoAnswer(req.body.conversation.at(-1).text), demo: true });
    if (!hasApiKey || typeof generate !== 'function')
      return res.status(503).json({ error: 'Chatbot belum dikonfigurasi. Hubungi administrator.' });

    try {
      const result = await generate({
        model,
        contents: req.body.conversation.map(({ role, text }) => ({ role, parts: [{ text: text.trim() }] })),
        config: getGeminiConfig(env)
      });
      const output = typeof result?.text === 'string' ? result.text.trim() : '';
      if (!output) return res.status(502).json({ error: 'Gemini belum memberikan jawaban teks. Silakan coba lagi.' });
      return res.json({ result: output, demo: false });
    } catch (err) {
      // Tidak mencatat pesan pelanggan/API key dalam log.
      console.error('[Gemini] request failed', Number(err?.status) || 'unknown');
      const status = Number(err?.status);
      if (status === 429) return res.status(429).json({ error: 'Kuota Gemini sedang terbatas. Silakan coba lagi nanti.' });
      if ([400,404].includes(status)) return res.status(502).json({ error: 'Model/konfigurasi Gemini perlu diperiksa administrator.' });
      if ([401,403].includes(status)) return res.status(502).json({ error: 'Akses ke layanan Gemini belum tersedia.' });
      return res.status(502).json({ error: 'Layanan AI belum dapat dihubungi. Silakan gunakan WhatsApp.' });
    }
  });
  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Ukuran permintaan terlalu besar.' });
    if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'JSON tidak valid.' });
    console.error('[Server] request parsing error');
    return res.status(500).json({ error: 'Kesalahan server.' });
  });
  return app;
}
