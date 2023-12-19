const {contextBridge} = require('electron')
const {PythonShell} = require('python-shell')
contextBridge.exposeInMainWorld(
    'python', 
    {
        test()
        {
            window.alert(999)
        }
    }
)