const { app, BrowserWindow, Menu } = require('electron');
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

// TEMPLATE MENU
const templateMenu = [
    {
        label:  'Arquivo',
        submenu: [
            {
                label:  'Novo'
            },
            {
                label:  'Abrir'
            },
            {
                label:  'Salvar'
            }
        ]
    },
];

// Menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// ON READY
app.whenReady().then(createWindow);
