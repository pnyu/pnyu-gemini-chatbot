/**
 * Widget mandiri PNYU. Contoh pemakaian di website:
 * <script defer src="https://HOST-CHATBOT/widget.js" data-api-base="https://HOST-CHATBOT"></script>
 * Tidak bergantung pada framework website, menggunakan Shadow DOM agar CSS terisolasi.
 * Riwayat hanya ada di memori halaman. Tidak ada localStorage/cookies/chat analytics.
 */
(() => {
  if (document.querySelector('#pnyu-chatbot-mount')) return;
  const script = document.currentScript;
  const apiBase = (script?.dataset.apiBase || (script?.src ? new URL(script.src).origin : location.origin)).replace(/\/$/, '');
  const root = document.createElement('div');
  root.id = 'pnyu-chatbot-mount';
  document.body.append(root);
  const shadow = root.attachShadow({ mode: 'open' });
  const css = `
:host{font-family:Arial,Helvetica,sans-serif;color:#16334e;font-synthesis:none}
*{box-sizing:border-box}button,input,textarea{font:inherit}button{cursor:pointer}
.launcher{position:fixed;z-index:2147483000;right:22px;bottom:20px;border:0;border-radius:60px;background:#ed872c;color:white;box-shadow:0 7px 30px #112d4880;display:flex;align-items:center;gap:10px;padding:14px 18px;font-size:14px;font-weight:800}
.launcher:focus-visible,.head button:focus-visible,.send:focus-visible{outline:3px solid #285e9d;outline-offset:3px}
.launcher .spark{font-size:19px}
.panel{position:fixed;z-index:2147483001;right:20px;bottom:84px;width:370px;max-width:calc(100vw - 24px);height:min(615px,calc(100dvh - 105px));border-radius:20px;background:#fff;box-shadow:0 10px 54px #10294055;border:1px solid #dfe6eb;display:flex;flex-direction:column;overflow:hidden}
.panel[hidden]{display:none}.head{padding:16px 16px 14px;background:#0b2945;color:white;display:flex;align-items:center;gap:10px}.mark{display:grid;place-items:center;background:#ee882d;color:#fff;width:40px;height:40px;border-radius:13px;font-size:21px;font-weight:900}
.headcopy{display:flex;flex:1;flex-direction:column;gap:4px}.headcopy strong{font-size:15px}.headcopy small{color:#c0cfde;font-size:10px}.close{border:0;background:#244563;color:white;border-radius:8px;width:30px;height:30px;font-size:21px}
.intro{padding:13px 15px;background:#fff8ef;border-bottom:1px solid #f2e6d8;font-size:11px;line-height:1.55;color:#5f5b50}
.messages{padding:14px;display:flex;flex-direction:column;gap:12px;flex:1;overflow-y:auto;background:#f7f9fb;scroll-behavior:smooth}
.msg{display:flex;flex-direction:column;max-width:89%;gap:4px;align-self:flex-start}.msg.user{align-self:flex-end}
.msg small{font-size:10px;color:#71879a}.msg .bubble{padding:10px 12px;background:#fff;border:1px solid #e1e8ef;border-radius:13px 13px 13px 3px;line-height:1.57;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}
.msg.user .bubble{background:#123b60;color:white;border-color:#123b60;border-radius:13px 13px 3px 13px}.msg.error .bubble{border-color:#df9999;color:#a13131}
.chips{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-top:1px solid #e7edf2;background:white}
.chips button{border:1px solid #d6e3ee;color:#254a69;background:#f7fbfe;border-radius:30px;padding:7px 9px;font-size:10px}.chips button:hover{border-color:#ec872d}
.composer{display:flex;gap:8px;align-items:end;padding:9px 12px;background:white;border-top:1px solid #e9edf1}.composer textarea{min-height:38px;max-height:90px;resize:none;flex:1;border:1px solid #d6e0e9;border-radius:10px;padding:9px;outline:none;font-size:12px}.composer textarea:focus{border-color:#ed872c}
.send{border:0;color:white;background:#ee882d;border-radius:10px;padding:10px 13px;height:38px;font-size:12px;font-weight:bold}.send:disabled{opacity:.5;cursor:wait}
.foot{display:flex;gap:7px;justify-content:space-around;padding:8px 10px 12px;background:#fff}.foot a{font-size:10px;font-weight:750;color:#17476a;text-decoration:none}.foot a:hover{text-decoration:underline}.status{font-size:10px;margin:0;padding:0 15px 7px;background:white;color:#6c7985}
@media(max-width:480px){.panel{right:6px;bottom:76px;width:calc(100vw - 12px);max-width:none;height:calc(100dvh - 90px);border-radius:15px}.launcher{right:12px;bottom:12px;padding:12px 14px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  shadow.append(style);

  const launcher = document.createElement('button');
  launcher.className = 'launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded','false');
  launcher.setAttribute('aria-controls','pnyu-chat-panel');
  launcher.innerHTML = '<span class="spark" aria-hidden="true">✦</span> Tanya P’NYU AI';
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.id = 'pnyu-chat-panel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Chat konsultasi PNYU Percetakan');
  panel.hidden = true;
  panel.innerHTML = `
    <header class="head"><div class="mark" aria-hidden="true">P</div><div class="headcopy"><strong>Asisten P’NYU</strong><small>Konsultasi cetak · didukung Gemini AI</small></div><button type="button" class="close" aria-label="Tutup chatbot">×</button></header>
    <div class="intro">Saya membantu informasi produk dan cara pesan. <strong>Harga, estimasi, dan pemesanan final dikonfirmasi oleh tim PNYU.</strong> Jangan kirim data pribadi sensitif di chat ini.</div>
    <div class="messages" role="log" aria-live="polite" aria-label="Percakapan"></div>
    <div class="chips"><button type="button" data-prompt="Apa yang perlu disiapkan untuk pesan banner atau spanduk?">Banner & spanduk</button><button type="button" data-prompt="Bagaimana cara pemesanan di PNYU Percetakan?">Cara pesan</button><button type="button" data-prompt="Bisa dibantu desain atau cek file cetak?">Bantuan desain</button></div>
    <form class="composer"><textarea placeholder="Tanyakan kebutuhan cetak..." rows="1" maxlength="3000" aria-label="Pesan untuk asisten PNYU" required></textarea><button type="submit" class="send">Kirim</button></form>
    <div class="foot"><a href="https://pnyupercetakan.com/katalog/" target="_blank" rel="noopener noreferrer">Katalog ↗</a><a href="https://pnyupercetakan.com/pemesanan/" target="_blank" rel="noopener noreferrer">Form pesan ↗</a><a href="https://wa.me/6281220817037?text=Halo%20PNYU%20Percetakan%2C%20saya%20ingin%20konsultasi%20cetak." target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div>
    <p class="status" aria-live="polite">Memeriksa koneksi...</p>
  `;
  shadow.append(launcher, panel);
  const close = panel.querySelector('.close');
  const messageList = panel.querySelector('.messages');
  const form = panel.querySelector('.composer');
  const input = form.querySelector('textarea');
  const sendButton = form.querySelector('.send');
  const status = panel.querySelector('.status');
  const chips = [...panel.querySelectorAll('.chips button')];
  const history = [];
  let waiting = false;
  let initialized = false;

  function append(role, value, error=false) {
    const m = document.createElement('div');
    m.className = `msg ${role}${error ? ' error' : ''}`;
    const who = document.createElement('small');
    who.textContent = role === 'user' ? 'Anda' : 'Asisten P’NYU';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = value; // Jangan gunakan innerHTML untuk teks tidak terpercaya.
    m.append(who, bubble);
    messageList.append(m);
    messageList.scrollTop = messageList.scrollHeight;
    return bubble;
  }
  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.style.display = open ? 'none' : 'flex';
    if (open) {
      if (!initialized) {
        append('model', 'Halo! Saya Asisten P’NYU. Mau cetak apa hari ini? Saya bisa bantu informasi produk, cara pemesanan, dan persiapan file.');
        initialized = true;
      }
      input.focus();
    } else launcher.focus();
  }
  launcher.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  shadow.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
  function setBusy(v) {
    waiting = v; input.disabled = v; sendButton.disabled = v;
    chips.forEach(el => {el.disabled = v;});
  }
  async function send(message) {
    message = String(message || '').trim();
    if (waiting || !message || message.length > 3000) return;
    append('user', message);
    history.push({role:'user',text:message});
    while (history.length > 1 && (history.length > 23 || history.reduce((n,x) => n+x.text.length, 0) > 13000)) history.splice(0, 2);
    input.value=''; setBusy(true);
    const bubble = append('model','Sedang memeriksa informasi...');
    try {
      const res = await fetch(`${apiBase}/api/chat`, { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({conversation:history}) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Permintaan tidak berhasil.');
      if (typeof data.result !== 'string' || !data.result) throw new Error('Respons kosong.');
      bubble.textContent = data.result;
      history.push({role:'model',text:data.result});
      status.textContent = data.demo ? 'Mode DEMO — simulasi, bukan jawaban AI asli.' : 'Jawaban AI perlu diverifikasi untuk keputusan pembelian.';
    } catch(err) {
      bubble.textContent = (err.message || 'Gagal terhubung.') + ' Silakan konsultasi melalui WhatsApp.';
      bubble.parentElement.classList.add('error');
      history.pop();
    } finally { setBusy(false); input.focus(); messageList.scrollTop=messageList.scrollHeight; }
  }
  form.addEventListener('submit',e => {e.preventDefault();void send(input.value);});
  input.addEventListener('keydown',e => {if (e.key==='Enter' && !e.shiftKey && !e.isComposing) {e.preventDefault();form.requestSubmit();}});
  chips.forEach(button => button.addEventListener('click',() => {void send(button.dataset.prompt);}));
  void fetch(`${apiBase}/api/health`,{cache:'no-store'}).then(r => r.ok?r.json():Promise.reject()).then(data => {
    status.textContent = data.mode==='demo' ? 'Mode DEMO — simulasi, bukan jawaban AI asli.' : data.mode==='gemini' ? 'Layanan AI terhubung. Jawaban perlu verifikasi.' : 'AI belum dikonfigurasi. Gunakan WhatsApp.';
  }).catch(()=>{status.textContent='Server chatbot belum terhubung. Gunakan WhatsApp.';});
})();
