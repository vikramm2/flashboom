// main.js
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const { generateFlashcards } = require('./flashcardAi');
const path = require('path');

// 1) Create the Electron window and load index.html
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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

// 3) IPC handler: listen for topic + optional filePath, reply with 5 cards
ipcMain.on('ai:generate-flashcards', async (event, { topic, filePath }) => {
  console.log(`⏳ [MAIN] Generating flashcards for topic: "${topic}" with PDF: ${filePath}`);
  try {
    const cards = await generateFlashcards(topic, filePath);
    console.log('✅ [MAIN] Flashcards generated:', cards);
    event.reply('ai:flashcards-generated', JSON.stringify(cards));
  } catch (err) {
    console.error('❌ [MAIN] Error generating flashcards:', err);
    event.reply('ai:flashcards-error', err.message);
  }
});

// 4) IPC handler: open native file dialog for PDFs
ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select a PDF to generate flashcards from',
    filters: [{ name: 'PDF Documents', extensions: ['pdf'] }],
    properties: ['openFile']
  });
  if (canceled || filePaths.length === 0) {
    return null;
  }
  return filePaths[0];
});
