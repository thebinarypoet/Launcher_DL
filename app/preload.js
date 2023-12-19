const {contextBridge} = require('electron')
const { ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld(
    'python', 
    {
        ASR_run(res)
        {
            // 发送消息到主进程以执行Python脚本
            ipcRenderer.send('run-ASR', { scriptPath: 'C:\\Users\\Space\\Desktop\\DigitalLife\\Digital_Life_Server\\SocketServer.py'});

            // 接收来自主进程的Python脚本执行结果
            ipcRenderer.on('ASR-results', (event, message) => 
            {
                res.append(message)
            });
        },

        TTS_run(res)
        {
            // 发送消息到主进程以执行Python脚本
            ipcRenderer.send('run-TTS', { scriptPath: 'C:\\Users\\Space\\Desktop\\DigitalLife\\Digital_Life_Server\\TTS\\xg\\server_fastapi.py'});

            // 接收来自主进程的Python脚本执行结果
            ipcRenderer.on('TTS-results', (event, message) => 
            {
                res.append(message)
            });
        }
    }
)