import app from "app";
import BrowserWindow from "browser-window";

let mainWindow = null;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        frame: true, // close buttons
        resizable: true
    });

    mainWindow.loadURL('file://' + __dirname + '/../frontend/app.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

}

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', createWindow);

app.on('activate', function() {
    if (mainWindow === null) createWindow();
});