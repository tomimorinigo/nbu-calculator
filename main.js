const { app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');

// const backendPath = path.join(__dirname, 'src', 'backend', 'server.js');
let mainWindow;
let popupPrintError;

const createWindow = ()=>{
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        minHeight: 700,
        minWidth: 1200,
        fullscreen: false,
        resizable: false,
        title: 'nbu-calculator',
        webPreferences: {
            nodeIntegration: true, // Habilitar la integración de Node.js en el proceso de renderizado
            contextIsolation: false, // Deshabilitar el aislamiento de contexto (context isolation)
            enableRemoteModule: true // Habilitar el módulo remote
          }
    })

    // Crear menu vacio
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    mainWindow.loadFile('./src/frontend/public/index.html');
}

app.whenReady().then(()=>{
    createWindow();  
})

ipcMain.on('abrir-ventana-emergente', () => {
    popupPrintError = new BrowserWindow({
      width: 400,
      height: 200,
      parent: mainWindow,
      modal: true,
      fullscreen: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Crear menu vacio
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);
  
    popupPrintError.loadFile('src/frontend/public/popupPrint.html');
  
    popupPrintError.once('ready-to-show', () => {
      popupPrintError.show();
    });
  
    popupPrintError.on('closed', () => {
      // Liberar recursos cuando la ventana emergente sea cerrada
      popupPrintError = null;
    });
  });

ipcMain.on('cerrar-ventana-emergente', () => {
    if (popupPrintError) {
        popupPrintError.close();
    }
});