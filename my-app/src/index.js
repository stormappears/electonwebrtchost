const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const { session } = require("electron");
const { clipboard } = require("electron")




function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Reciver",
    width: 1200,
    height: 722,
    // minWidth: 480,
    // minHeight: 280,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      sandbox: false,
      frame: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      focusable: false,
      transparent: true,
      backgroundColor: "#00FFFFFF",
      resizable: false,
      
    },
  });

  // mainWindow.setMenu(null)
// aspect ratio
//   const defaultRatio = 16 / 9;

//   mainWindow.setAspectRatio(defaultRatio);

//   mainWindow.on("resize", () => {
//   const ratio = mainWindow.isFullScreen() ? 0 : defaultRatio;
//   mainWindow.setAspectRatio(ratio);
// });


  function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
  }


  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { requestHeaders } = details;
      UpsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
      callback({ requestHeaders });
    }
  );

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      const { responseHeaders } = details;
      UpsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
      UpsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
      callback({
        responseHeaders,
      });
    }
  );


  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders["Content-Security-Policy"];

    callback({
      responseHeaders: details.responseHeaders,
    });
  });

  // const filter = {
  //   urls: ["http://localhost:3000/*"],
  // };

  // session.defaultSession.webRequest.onBeforeSendHeaders(
  //   filter,
  //   (details, callback) => {
  //     console.log(details);
  //     details.requestHeaders["Origin"] = "https://0.peerjs.com";
  //     callback({ requestHeaders: details.requestHeaders });
  //   }
  // );

  // session.defaultSession.webRequest.onHeadersReceived(
  //   filter,
  //   (details, callback) => {
  //     console.log(details);
  //     details.responseHeaders["Access-Control-Allow-Origin"] = [
  //       "capacitor-electron://-",
  //       'http://localhost:3000'
  //     ];
  //     callback({ responseHeaders: details.responseHeaders });
  //   }
  // );



  // // code for production build
  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "./build/index.html"),
  //   protocol: "file",
  // });

  // const startUrl = url.format({
  //     pathname: path.join(__dirname, './webapp/build/index.html'),
  //     protocol : 'file'
  // })

  mainWindow.loadURL("http://localhost:3000/");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.setPosition(800, 0);
    //devtool
    mainWindow.webContents.openDevTools();
    // Get available sources for screen capture

    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        console.log("here is my ids", sources[0]);

        for (const source of sources) {
          if (source.name === "Entire screen") {
            console.log(source.id + ": source id");
            mainWindow.webContents.send("SET_SOURCE_ID", source.id);
            return;
          }
        }
      });


  });
}

app.on("ready", createMainWindow);
// app.whenReady(createMainWindow);
app.allowRendererProcessReuse = false;
