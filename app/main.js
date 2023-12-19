const {app,BrowserWindow,ipcMain} = require('electron')
const { PythonShell } = require('python-shell')
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
  
  ipcMain.on('run-ASR', (event, { scriptPath }) => 
  {
    const options = 
    {
      mode: 'text',
      pythonOptions: ['-u'],
      args: [
        '--chatVer', '3',
        '--stream', 'True',
        '--character', 'catmaid',
        '--model', 'gpt-3.5-turbo',
        '--APIKey', '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'
      ]
    };
    const pyshell = new PythonShell(scriptPath, options);
    pyshell.on('message', (message) => 
    {
      event.sender.send('ASR-results', message);
    });
    pyshell.end((err, code, signal) => 
    {
      if (err) throw err;
      console.log('Python script finished with code', code);
    });
  })

  ipcMain.on('run-TTS', (event, { scriptPath }) => 
  {
    const options = 
    {
      mode: 'text',
      pythonOptions: ['-u'],
    };
    const pyshell = new PythonShell(scriptPath, options);
    pyshell.on('message', (message) => 
    {
      event.sender.send('TTS-results', message);
    });
    pyshell.end((err, code, signal) => 
    {
      if (err) throw err;
      console.log('Python script finished with code', code);
    });
  })
})

app.on('window-all-closed', () => 
{
  if (process.platform !== 'darwin') 
  {
    app.quit()
  }
})