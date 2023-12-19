const {app,BrowserWindow} = require('electron')
const path=require('path')

let mainwindow

function createWindow () 
{
  mainwindow = new BrowserWindow(
    {
        width: 800,
        height: 600,
        webPreferences:
        {
          preload: path.join(__dirname,'preload.js'),
          sandbox: false
        }
    })
    
  mainwindow.loadFile(path.join(__dirname,'index.html'))
}

app.whenReady().then(() => 
{
  createWindow()
  app.on('activate', () => 
  {
    if (BrowserWindow.getAllWindows().length === 0) 
    {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => 
{
  if (process.platform !== 'darwin') 
  {
    app.quit()
  }
})