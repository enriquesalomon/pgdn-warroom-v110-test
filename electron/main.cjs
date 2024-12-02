const { app, BrowserWindow, globalShortcut, dialog } = require("electron");
const path = require("path");

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    fullscreen: true, // Set fullscreen to true
    frame: false, // Remove window frame
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false, // Disable DevTools
    },
  });

  mainWindow.on("ready-to-show", mainWindow.show);
  //-->THIS WILL BE USED WHEN PACKAGIN THE APP (NPM RUN PACKAGE)
  mainWindow.loadFile(path.join(app.getAppPath(), "dist/index.html"));
  //<--
  //-->THIS WILL BE USED WHEN BUILDING THE APP (NPM RUN BUILD)
  // mainWindow.loadURL("http://localhost:5371");
  //<--

  // Register a global shortcut to close the app when CmdOrCtrl+Q is pressed
  const shortcut = globalShortcut.register("CmdOrCtrl+Q", () => {
    // Display confirmation dialog
    const options = {
      type: "question",
      buttons: ["Yes", "No"],
      defaultId: 1,
      title: "Confirm",
      message: "Are you sure you want to quit?",
    };

    dialog
      .showMessageBox(mainWindow, options)
      .then((response) => {
        if (response.response === 0) {
          // 'Yes' button
          app.quit(); // Quit the application
        }
      })
      .catch((err) => {
        console.error(err); // Handle error
      });
  });

  if (!shortcut) {
    console.error("Global shortcut registration failed");
  }

  // Handle the close event
  mainWindow.on("close", () => {
    // Unregister the shortcut when the app is closing
    globalShortcut.unregister("CmdOrCtrl+Q");
  });

  // Remove window reference when window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
