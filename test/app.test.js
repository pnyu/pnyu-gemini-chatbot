import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

async function withApp(options, fn) {
  const server = createApp(options).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { await new Promise(resolve => server.close(resolve)); }
}
async function send(base, conversation, origin) {
  const r = await fetch(`${base}/api/chat`, {
    method:'POST', headers: { 'Content-Type':'application/json', ...(origin ? { Origin:origin } : {}) },
    body: JSON.stringify({ conversation })
  });
  return { status:r.status, body:await r.json() };
}

test('health: mode demo', async () => {
  await withApp({ demoMode:true }, async url => {
    const r = await fetch(`${url}/api/health`);
    assert.equal((await r.json()).mode, 'demo');
  });
});
test('demo: jawaban ditandai simulasi dan memuat konteks produk', async () => {
  await withApp({ demoMode:true }, async url => {
    const { status, body } = await send(url, [{role:'user', text:'Saya ingin cetak banner'}]);
    assert.equal(status, 200);
    assert.equal(body.demo, true);
    assert.match(body.result, /MODE DEMO/);
    assert.match(body.result, /banner/i);
  });
});
test('validasi: data tak lengkap ditolak', async () => {
  await withApp({ demoMode:true }, async url => {
    const r = await send(url, null);
    assert.equal(r.status, 400);
  });
});
test('tanpa key: status 503 yang tidak membocorkan key', async () => {
  await withApp({}, async url => {
    const { status, body } = await send(url, [{role:'user', text:'Halo'}]);
    assert.equal(status, 503);
    assert.match(body.error, /belum dikonfigurasi/);
  });
});
test('mengirim conversation + system instruction ke Gemini mock', async () => {
  let forwarded;
  await withApp({ hasApiKey:true, generate:async p=>{forwarded=p;return {text:'Silakan konsultasi ukuran dan jumlah.'};} }, async url => {
    const { status, body } = await send(url, [{role:'user',text:'Saya butuh kalender'}]);
    assert.equal(status,200);
    assert.equal(body.result,'Silakan konsultasi ukuran dan jumlah.');
    assert.equal(forwarded.contents[0].role,'user');
    assert.match(forwarded.config.systemInstruction,/PNYU Percetakan/);
  });
});
test('origin yang tak diizinkan ditolak saat whitelist aktif', async () => {
  await withApp({ demoMode:true, env:{ CORS_ORIGINS:'https://pnyupercetakan.com' } }, async url => {
    const r = await send(url, [{role:'user',text:'Halo'}], 'https://situs-tak-diizinkan.example');
    assert.equal(r.status,403);
  });
});
test('rate limiter membatasi jumlah request', async () => {
  await withApp({ demoMode:true, env:{ RATE_LIMIT_PER_10_MIN:'2' } }, async url => {
    const p = [{role:'user',text:'Halo'}];
    assert.equal((await send(url,p)).status,200);
    assert.equal((await send(url,p)).status,200);
    assert.equal((await send(url,p)).status,429);
  });
});
