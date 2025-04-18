
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const {generateFlashcards} = require('./flashcardAi');
const path = require('path');


// 1) Create the Electron window and load index.html
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:    true,
      contextIsolation:   false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Optional: open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

// 2) When Electron is ready, spawn the window
app.whenReady().then(createMainWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});







// 3) IPC handler: listen for topic requests, reply with 5 cards
ipcMain.on('ai:generate-flashcards', async (event, { topic }) => {
  console.log(`⏳ [MAIN] Generating flashcards for topic: "${topic}"`);
  try {
    const cards = await generateFlashcards(topic);    // calls flashcardAI.js
    console.log('✅ [MAIN] Flashcards generated:', cards);
    // send JSON string of cards back to renderer
    event.reply('ai:flashcards-generated', JSON.stringify(cards));
  } catch (err) {
    console.error('[MAIN] Error generating flashcards:', err);
    event.reply('ai:flashcards-error', err.message);
  }
});
