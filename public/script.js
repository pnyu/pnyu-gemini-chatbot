const form = document.querySelector('#chat-form');
const input = document.querySelector('#user-input');
const sendButton = document.querySelector('#send-button');
const messagesBox = document.querySelector('#messages');
const welcome = document.querySelector('#welcome');
const conversationArea = document.querySelector('#conversation');
const statusPill = document.querySelector('#connection-status');
const conversation = [];
let waiting = false;

function updateStatus(label, mode) {
  statusPill.className = `status-pill ${mode ? `is-${mode}` : ''}`;
  statusPill.innerHTML = '<span class="status-dot"></span>';
  statusPill.append(document.createTextNode(label));
}

async function checkHealth() {
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    if (!response.ok) throw new Error('Server tidak merespons.');
    const data = await response.json();
    if (data.mode === 'gemini') updateStatus('Gemini siap', 'ready');
    else if (data.mode === 'demo') updateStatus('Mode demo', 'demo');
    else updateStatus('Perlu API key', 'offline');
  } catch {
    updateStatus('Server offline', 'offline');
  }
}

function appendMessage(role, text, { pending = false, error = false } = {}) {
  const wrapper = document.createElement('article');
  wrapper.className = `message ${role === 'user' ? 'user' : 'model'} ${error ? 'error' : ''}`;
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'user' ? '●' : '✦';
  const content = document.createElement('div');
  content.className = 'message-content';
  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = role === 'user' ? 'ANDA' : 'ASISTEN PNYU';
  const body = document.createElement('div');
  body.className = 'message-text';
  if (pending) {
    body.setAttribute('aria-label', 'Sedang menunggu jawaban');
    const spinner = document.createElement('span');
    spinner.className = 'typing';
    for (let i = 0; i < 3; i += 1) spinner.append(document.createElement('i'));
    body.append(spinner);
  } else {
    // textContent (bukan innerHTML) menjaga teks AI tidak dieksekusi sebagai HTML.
    body.textContent = text;
  }
  content.append(label, body);
  wrapper.append(avatar, content);
  messagesBox.append(wrapper);
  welcome.hidden = true;
  welcome.style.display = 'none';
  scrollDown();
  return { wrapper, body };
}

function scrollDown() {
  conversationArea.scrollTop = conversationArea.scrollHeight;
}

function setBusy(value) {
  waiting = value;
  input.disabled = value;
  sendButton.disabled = value;
  document.querySelectorAll('.suggestion').forEach(button => { button.disabled = value; });
  if (!value) input.focus();
}

function resetChat() {
  if (waiting) return;
  conversation.length = 0;
  messagesBox.replaceChildren();
  welcome.hidden = false;
  welcome.style.display = '';
  input.value = '';
  adjustTextarea();
  input.focus();
}

async function sendMessage(message) {
  const trimmed = message.trim();
  if (!trimmed || waiting) return;
  if (trimmed.length > 3000) return;
  appendMessage('user', trimmed);
  conversation.push({ role: 'user', text: trimmed });
  // Batasi konteks agar tidak melebihi limit backend; hapus pasangan turn tertua.
  while (conversation.length > 1 && (conversation.length > 25 || conversation.reduce((n, entry) => n + entry.text.length, 0) > 14000)) {
    conversation.splice(0, 2);
  }
  input.value = '';
  adjustTextarea();
  setBusy(true);
  const placeholder = appendMessage('model', '', { pending: true });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Permintaan gagal (HTTP ${response.status}).`);
    if (!data.result || typeof data.result !== 'string') throw new Error('Server tidak memberikan respons teks.');
    placeholder.body.textContent = data.result;
    conversation.push({ role: 'model', text: data.result });
  } catch (error) {
    placeholder.wrapper.classList.add('error');
    placeholder.body.textContent = error.message || 'Tidak dapat menghubungi server.';
    // Hindari memasukkan pesan user tanpa balasan ke riwayat percakapan model.
    conversation.pop();
  } finally {
    setBusy(false);
    scrollDown();
  }
}

function adjustTextarea() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  void sendMessage(input.value);
});
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    form.requestSubmit();
  }
});
input.addEventListener('input', adjustTextarea);
document.querySelector('#new-chat').addEventListener('click', resetChat);
document.querySelector('#sidebar-new-chat').addEventListener('click', resetChat);
document.querySelectorAll('[data-prompt]').forEach(button => {
  button.addEventListener('click', () => { void sendMessage(button.dataset.prompt); });
});
void checkHealth();
