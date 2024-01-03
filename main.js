const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path')
// MAIN WINDOW
var mainWindow = null;
async function createWindow(){
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false
        }
    });
    await mainWindow.loadFile('src/pages/editor/index.html');

    mainWindow.webContents.openDevTools();
    createNewFile();
    ipcMain.on('update-content',function(event,data){
        file.content = data
    })
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
}

function writeFile(filePath){
    try{
        fs.writeFile(filePath,file.content,function(error){
            if(error) throw error;
            file.path = filePath;
            file.saved = true;
            file.name = path.basename(filePath)
            mainWindow.webContents.send('set-file',file);
        })
    }catch(e){
        console.log(e);
    }
}
async function saveFileAs(){
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    });
    if(dialogFile.canceled){
        return false;
    }
    writeFile(dialogFile.filePath);
}

function saveFile(){
    if(file.saved){
        return writeFile(file.path);
    }
    return saveFileAs()
}
function readFile(filePath){
    try{
        return fs.readFileSync(filePath, 'utf8');
    }catch(e){
        console.log(e)
        return '';
    }
}

async function openFile(){
    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path
    });
    if(dialogFile.canceled) return false;
    file = {
        name: path.basename(dialogFile.filePaths[0]),
        content: readFile(dialogFile.filePaths[0]),
        saved: true,
        path: dialogFile.filePaths[0]
    }
    mainWindow.webContents.send('set-file',file)
}
// TEMPLATE MENU
const templateMenu = [
    {
        label:  'Arquivo',
        submenu: [
            {
                label:  'Novo',
                accelerator: 'CmdOrCtrl+N',
                click(){
                    createNewFile();
                }
            },
            {
                label:  'Abrir',
                accelerator: 'CmdOrCtrl+O',
                click(){
                    openFile()
                }
            },
            {
                label:  'Salvar',
                accelerator: 'CmdOrCtrl+S',
                click(){
                    saveFile()
                }
            },
            {
                label:  'Salvar como',
                accelerator: 'CmdOrCtrl++Shift+S',
                click(){
                    saveFileAs();
                }
            },
            {
                accelerator: 'CmdOrCtrl+Q',
                label: 'Fechar',
                role:process.platform === 'darwin' ? 'close' : 'quit'
            }
        ]
    },
    {
     label: 'Editar',
     submenu: [
        {
            label: 'Desfazer',
            role: 'undo'
        },
        {
            label: 'Refazer',
            role: 'redo'
        },
        {
            type: 'separator'
        },
        {
            label: 'Copiar',
            role: 'copy'
        },
        {
            label: 'Cortar',
            role: 'cut'
        },
        {
            label: 'Colar',
            role: 'paste'
        },
     ]
    }

];

// Menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// ON READY
app.whenReady().then(createWindow);
