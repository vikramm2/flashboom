// app/js/index.js
const { ipcRenderer } = require('electron');

// ── Diagnostics ─────────────────────────────────────────
console.log('▶ index.js loaded');

// ── DOM Elements ────────────────────────────────────────
const topicInput = document.getElementById('ai-topic');
const genBtn     = document.getElementById('ai-generate-btn');
const uploadBtn  = document.getElementById('ai-upload-btn');

// ── State ───────────────────────────────────────────────
let selectedPdfPath = null;

// ── 1) Upload Button opens native dialog ─────────────────
uploadBtn.addEventListener('click', async () => {
  // Ask main to open the PDF picker
  const filePath = await ipcRenderer.invoke('open-file-dialog');
  if (!filePath) return;  // user cancelled

  selectedPdfPath = filePath;
  console.log('▶ Selected PDF path:', selectedPdfPath);

  // Display filename next to upload button
  const filename = filePath.split(/[\\\/]/).pop();
  let label = document.getElementById('pdf-filename');
  if (!label) {
    label = document.createElement('span');
    label.id    = 'pdf-filename';
    label.style = 'margin-left:0.5rem;font-style:italic;';
    uploadBtn.after(label);
  }
  label.textContent = filename;

  // Move focus to topic input
  topicInput.focus();
});

// ── 2) Generate Flashcards Click ────────────────────────
genBtn.addEventListener('click', () => {
  // Enforce PDF selection first
  if (!selectedPdfPath) {
    return alert('Please upload your PDF first via the "Upload Your Textbook" button.');
  }

  const topic = topicInput.value.trim();
  if (!topic) {
    return alert('Please enter a topic.');
  }

  // Reset any previous error
  const prevErr = document.getElementById('error-banner');
  if (prevErr) prevErr.remove();

  console.log('[RENDERER] Sending topic:', topic);
  console.log('[RENDERER] Using PDF path:', selectedPdfPath);

  // Enter loading state
  genBtn.disabled    = true;
  genBtn.textContent = 'Loading…';

  // Send both topic and PDF path to main
  ipcRenderer.send('ai:generate-flashcards', { topic, filePath: selectedPdfPath });
});

// ── 3) Handle Generated Flashcards ──────────────────────
ipcRenderer.on('ai:flashcards-generated', (e, cardsJson) => {
  // Restore button
  genBtn.disabled    = false;
  genBtn.textContent = 'Generate Flashcards';

  const cards = JSON.parse(cardsJson);
  console.log('[RENDERER] Received flashcards:', cards);

  // Save and redirect
  localStorage.setItem('ai_flashcards', cardsJson);
  window.location.href = 'flashcard.html?ai=true';
});

// ── 4) Handle Errors Gracefully ─────────────────────────
ipcRenderer.on('ai:flashcards-error', (e, errorMsg) => {
  console.error('[RENDERER] AI error:', errorMsg);

  // Restore button
  genBtn.disabled    = false;
  genBtn.textContent = 'Generate Flashcards';

  // Show inline error banner
  const banner = document.createElement('div');
  banner.id    = 'error-banner';
  banner.style = 'background: #fee; color: #b00; padding: 0.5rem; margin-top: 1rem; border: 1px solid #b00; border-radius: 4px;';
  banner.textContent = `Error: ${errorMsg}`;
  document.getElementById('controls').after(banner);
});
