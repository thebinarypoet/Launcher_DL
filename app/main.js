const {app,BrowserWindow,ipcMain} = require('electron')
const { PythonShell } = require('python-shell')
const path=require('path')
const { spawn } = require('child_process');

let mainwindow

function createWindow () 
{
  mainwindow = new BrowserWindow(
    {
        width: 1060,
        height: 700,
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
      pythonPath:'C:\\ProgramData\\anaconda3\\python.exe',
      mode: 'text',
      pythonOptions: ['-u'],
      args: [
        '--chatVer', '3',
        '--stream', 'True',
        '--character', 'catmaid',
        '--model', 'gpt-3.5-turbo',
        '--APIKey', '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',
        '--proxy', 'http://127.0.0.1:7890',
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
      pythonPath:'C:\\ProgramData\\anaconda3\\python.exe',
      mode: 'text',
      pythonOptions: ['-u'],
    };
    const pyshell = new PythonShell(scriptPath, options)
    pyshell.on('message', (message) => 
    {
      console.log(message)
      event.sender.send('TTS-results', message)
    });
    pyshell.end((err, code, signal) => 
    {
      if (err) throw err;
      console.log('Python script finished with code', code)
    });
  })

  ipcMain.on('run-Model', (event, { appPath }) => 
  {
    const childProcess = spawn(appPath);
    childProcess.stdout.on('data', (data) => {
      console.log(`外部程序的输出: ${data}`);
    });

    // 可以监听子进程的错误输出
    childProcess.stderr.on('data', (data) => {
      console.error(`外部程序的错误输出: ${data}`);
    });

    // 可以监听子进程的退出事件
    childProcess.on('close', (code) => {
      console.log(`外部程序退出，退出码: ${code}`);
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