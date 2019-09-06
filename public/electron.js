const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = require('electron-is-dev');
const contextMenu = require('electron-context-menu');

contextMenu({
  menu: actions => [
    actions.copyLink({
      transform: content => `${content}`
    }),
    actions.separator(),
    actions.copyImage({
      transform: content => `${content}`
    }),
    actions.separator(),
    actions.copy({
      transform: content => `${content}`
    }),
    {
      label: 'Invisible',
      visible: false
    },
    actions.paste({
      transform: content => `${content}`
    })
  ]
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1280,
    height: 720,
    icon: './public/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/', { userAgent: 'Takos/0.1.0' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '/../build/index.html'), { userAgent: 'Takos/0.1.0' });
  }
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
