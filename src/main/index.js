'use strict'

import { app, BrowserWindow, Menu } from 'electron'
// import axios from 'axios'
// import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function checkUpdate () { // 检查更新
  // let currentVersion = `v${require('/package.json').version}`
  // console.log(currentVersion)
  // axios.get('https://gitee.com/api/v5/repos/black-flash-oreo/easy-snippets/releases/latest').then(res => {
  //   if (currentVersion !== res.data.tag_name) {
  //     let notification = new Notification({
  //       title: 'New version Available',
  //       body: `A new Version ${res.data.tag_name} is available!`,
  //       silent: false,
  //       timeoutType: 'default'
  //     })
  //     notification.on('click', () => {
  //       shell.openExternal('https://gitee.com/black-flash-oreo/easy-snippets/releases')
  //     })
  //     notification.show()
  //   }
  // })
}
function createWindow () {
  checkUpdate()
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Application',
        submenu: [
          {label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() }}
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
          {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
          {label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'}
        ]
      }
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    // useContentSize: true,
    width: 1000,
    frame: false
  })

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
