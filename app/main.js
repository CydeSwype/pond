const {app, BrowserWindow} = require('electron');
const log = require('electron-log')
const path = require('path')

const isDev = process.mainModule.filename.indexOf('app.asar') === -1

let hotReload;
let mainWindow;
let app_version = app.getVersion();

if (isDev) {
    app_version += ' local debug';
    hotReload = 1;
} else {
    // supress uncaught exceptions in production
    process.on('uncaughtException', function (error) {
        log.info('uncaughtException occurred', error);
    })
}

if (hotReload) {
    log.info('🔥🔥🔥  hot reload is ON! 🔥🔥🔥')
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    })
}  

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 715});

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/src/index.html');

    // Hide menu during dev too
    // mainWindow.setMenu(null)

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
