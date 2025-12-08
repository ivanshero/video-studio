const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Disable security warnings for production
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'استوديو الفيديو الإسلامي',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    backgroundColor: '#0a0a0f',
    show: false,
    autoHideMenuBar: true,
  });

  // Remove menu in production
  if (app.isPackaged) {
    Menu.setApplicationMenu(null);
  }

  // Load the app
  if (app.isPackaged) {
    // Production: load from dist folder
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // Development: load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Uncomment for debugging: mainWindow.webContents.openDevTools();
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle fullscreen
  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('fullscreen', true);
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('fullscreen', false);
  });
}

// App ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle second instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
