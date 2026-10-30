import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getGeminiConfig, SYSTEM_INSTRUCTION } from '../src/chatConfig.js';
import { BUSINESS, whatsappUrl } from '../src/knowledge.js';

test('informasi kontak dan situs menggunakan data PNYU yang dipastikan', () => {
  assert.equal(BUSINESS.website, 'https://pnyupercetakan.com');
  assert.equal(BUSINESS.whatsapp, '6281220817037');
  assert.equal(BUSINESS.categoriesCount, 22);
  assert.equal(BUSINESS.listedItemsCount, 243);
  assert.match(whatsappUrl(), /^https:\/\/wa\.me\/6281220817037\?text=/);
});

test('system instruction melarang kepastian harga dan status pesanan', () => {
  assert.match(SYSTEM_INSTRUCTION, /Jangan mengarang harga/);
  assert.match(SYSTEM_INSTRUCTION, /WEB-\.\.\./);
  assert.match(SYSTEM_INSTRUCTION, /tanpa akses database pesanan/);
});

test('nilai numerik parameter dibatasi', () => {
  const cfg = getGeminiConfig({ GEMINI_TEMPERATURE: '-10', GEMINI_TOP_P: '20', GEMINI_TOP_K: '100' });
  assert.equal(cfg.temperature, 0);
  assert.equal(cfg.topP, 1);
  assert.equal(cfg.topK, 40);
});
