const { contextBridge, ipcRenderer, ipcMain } = require("electron");
// const os = require("os");



contextBridge.exposeInMainWorld("electron", {
//   arch: () => os.arch(),

  getScreenId: (callback) => ipcRenderer.on("SET_SOURCE_ID", callback),


});
