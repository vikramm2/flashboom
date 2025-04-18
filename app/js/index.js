// app/js/index.js
const { ipcRenderer } = require('electron');
document.getElementById('ai-generate-btn').addEventListener('click', () => {
  const topic = document.getElementById('ai-topic').value;
  if (!topic) return alert('Please enter a topic.');
  console.log('[RENDERER] Sending topic to main:', topic);
  ipcRenderer.send('ai:generate-flashcards', { topic });
});


// app/js/index.js
document.getElementById('ai-upload-btn').addEventListener('click', () => {
    alert('E‑textbook upload is coming soon—stay tuned!');
  });
  

ipcRenderer.on('ai:flashcards-generated', (e, cardsJson) => {
    const cards = JSON.parse(cardsJson);
    console.log('[RENDERER] Received flashcards:', cards);
  
    // 1) Save to localStorage for the flashcard page to pick up
    localStorage.setItem('ai_flashcards', cardsJson);
  
    // 2) Redirect into your flashcard viewer, flagging the AI session
    window.location.href = 'flashcard.html?ai=true';
  });
  