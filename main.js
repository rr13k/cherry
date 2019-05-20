const { app, BrowserWindow, ipcMain,BrowserView } = require('electron')
// const {lowdb}   = require('lowdb')
let win
function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600,icon:"strawberry.ico" })
  win.loadFile('index.html')
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}

//修改case页面
let changeCaseDriver
ipcMain.on('changepage', function (event, arg) {
  changeCaseDriver = new BrowserWindow({
    width: 1000,
    height: 800,
    fullscreenable: true,
    contextIsolation: true,
    webPreferences: {
      webSecurity: false
    }
  })
  let path = require("path")
  let url = require("url")
  let html = './src/view/' + arg.html
  console.dir(arg.html)
  changeCaseDriver.loadURL(
    url.format({
      pathname: path.join(__dirname, html),
      protocol: 'file:',
      slashes: true
    })
  )
  if(arg.test === true){
    changeCaseDriver.webContents.on('did-frame-finish-load', () => {
    changeCaseDriver.webContents.send('caseData', arg)
  })
  changeCaseDriver.on('closed', () => {
    win.webContents.send('changeClosed') //更新
    changeCaseDriver = null
  })
  }else{

  /* describe:
  来回发送传送数据保证消息执行。*/
  changeCaseDriver.webContents.on('did-frame-finish-load', () => {
    win.webContents.send('getCsaeData', arg.id)
    ipcMain.on('sendCaseData', function (event, arg) {
      changeCaseDriver.webContents.send('caseData', arg)
    })
  })
  changeCaseDriver.on('closed', () => {
    win.webContents.send('changeClosed') //更新
    changeCaseDriver = null
  })

}
})


ipcMain.on('cmdEnd',(event,arg)=>{
  win.webContents.send('cmdEnd')
})

ipcMain.on('changeCaseSave', function (event, arg) {
  win.webContents.send('changeCaseSaveok', arg)
})


ipcMain.on('getWinodwRange',function(event, arg){
  driver.webContents.send('WinRange',{'win':driver.getBounds(),'arg':arg})
})

ipcMain.on('viewChange', (event, arg) => {
  if(win.webContents.isDevToolsOpened()){
    win.webContents.closeDevTools()
  }
  win.webContents.openDevTools()
  win.loadFile(arg)
})

var _x = -300

ipcMain.on('test1',()=>{
  var view = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  })

  _x  = _x + 300
  x = _x
  win.setBrowserView(view)
  view.setBounds({ x: x, y: 0, width: 300, height: 300 })
  view.webContents.loadURL('https://electronjs.org')
})

ipcMain.on('sendCMD', function (event, arg) {
  win.send('CmdList', arg)
})


ipcMain.on('liveTitle',(event,title)=>{
  win.send('liveTitleto',title)
})

ipcMain.on('backHome', (event, arg) => {
  win.loadFile('index.html')
})

let driver
ipcMain.on('openBrowser', function (event, arg) { //打开浏览器的方法，arg控制状态及地址
  var _type = arg.type
  var html = "./src/view/webDriver.html"
  driver = new BrowserWindow({
    width: 1000,
    height: 800,
    icon:"strawberry.ico",
    fullscreenable: true,
    contextIsolation: true,
    webPreferences: {
      webSecurity: false
    }
  })

  driver.maximize()

  if(driver.isDevToolsOpened()){
    driver.closeDevTools()
  }
  driver.openDevTools()
  driver.webContents.on('dom-ready', () => {
    driver.webContents.send('openURL', arg.url)
    driver.webContents.send('CMDLIST', arg)
  })

  var path = require("path")
  var url = require("url")
  win.send('showURL',
    url.format({
      pathname: path.join(__dirname, html),
      protocol: 'file:',
      slashes: true
    })
  )
  driver.loadURL(
    url.format({
      pathname: path.join(__dirname, html),
      protocol: 'file:',
      slashes: true
    })
  )
  driver.setMenu(null)    // 隐藏菜单栏
  driver.on('closed', (event, arg) => {  //录制完毕，存储用例
    driver = null
    win.send('BrowserClosed', _type)
  })
})

ipcMain.on('packtest', (event, arg) => {
  var webDriver = new BrowserWindow({ width: 800, height: 600 ,icon:"strawberry.ico"})
  // webDriver.webContents.openDevTools()
  webDriver.loadFile(arg)
  webDriver.on('closed', () => {
    webDriver = null
  })
  // win.webContents.send("ok")
})

app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})