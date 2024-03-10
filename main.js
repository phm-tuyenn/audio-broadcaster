const { app, BrowserWindow } = require('electron')
const waitPort = require('wait-port')

function createWindow () {
  const win = new BrowserWindow({
    autoHideMenuBar: true
  })

  win.loadURL("http://127.0.0.1:3000")
  win.maximize()
}

app.whenReady().then(() => {
  const start = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1000,
    height: 300,
    frame: false,
    transparent: true,
  })

  start.loadFile("index.html")
  start.setIgnoreMouseEvents(true)

    waitPort({ host: '127.0.0.1', port: 3000 })
    .then(({ open, ipVersion }) => {
        if (open) {start.close(); createWindow();}
        else console.log('The port did not open before the timeout...');
    })
    .catch((err) => {
        console.err(`An unknown error occured while waiting for the port: ${err}`);
    });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        waitPort({ host: '127.0.0.1', port: 3000 })
        .then(({ open, ipVersion }) => {
          if (open) {start.close(); createWindow();}
            else console.log('The port did not open before the timeout...');
        })
        .catch((err) => {
            console.err(`An unknown error occured while waiting for the port: ${err}`);
        });
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})