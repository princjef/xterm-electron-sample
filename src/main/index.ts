import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windows: Set<BrowserWindow> = new Set();

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        title: 'Xterm Electron Sample',
        width: 800,
        height: 600,
        transparent: false,
        minHeight: 200,
        minWidth: 200
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../../index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        windows.delete(win);
    });

    windows.add(win);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.size === 0) {
        createWindow();
    }
});
