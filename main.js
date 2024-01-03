const { app, BrowserWindow, Menu } = require('electron');
// MAIN WINDOW
var mainWindow = null;
async function createWindow(){
    // console.log("Hello World")
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    await mainWindow.loadFile('src/pages/editor/index.html');

    mainWindow.webContents.openDevTools();
}
var file = {}

function createNewFile(){
    file = {
        name: 'novo-arquivo.txt',
        content: '',
        saved: false,
        path: app.getPath('documents')+'/novo-arquivo.txt'
    };

    mainWindow.webContents.send('set-file',file)
    contextIsolation: false
}

// TEMPLATE MENU
const templateMenu = [
    {
        label:  'Arquivo',
        submenu: [
            {
                label:  'Novo',
                click(){
                    createNewFile();
                }
            },
            {
                label:  'Abrir'
            },
            {
                label:  'Salvar'
            },
            {
                label:  'Salvar como'
            },
            {
                label: 'Fechar',
                role:process.platform === 'darwin' ? 'close' : 'quit'
            }
        ]
    },
];

// Menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// ON READY
app.whenReady().then(createWindow);
