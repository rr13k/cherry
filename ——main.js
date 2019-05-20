const electron = require('electron')
const path = require("path")
const url = require('url')
const lowdb = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
var adapter = new FileSync('db.json'); // 申明一个适配器
var _lowdb = lowdb(adapter)  // 以上初始化数据库
_lowdb.defaults({projects:[],projectsConts:0,casesConts:0,cases:[]}).write(); //初始化数据表格
       
 
const { app,BrowserWindow,globalShortcut} = require('electron')
 
let mainWindow
 
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
 
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
 
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
 
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
 
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
 
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
 
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})