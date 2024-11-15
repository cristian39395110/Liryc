const {BrowserWindow} = require('electron');

let window

function createWindow(){
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: './style/medusa/pilar.ico',
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('login.html')
}

module.exports = {
    createWindow
}

