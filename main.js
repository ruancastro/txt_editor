const { app, BrowserWindow } = require('electron');
// MAIN WINDOW
var mainWindow = null;
async function createWindow(){
    // console.log("Hello World")
    mainWindow = new BrowserWindow({
        width:800,
        height:600
    });
    await mainWindow.loadFile('src/pages/editor/index.html');
}

// ON READY
app.whenReady().then(createWindow);