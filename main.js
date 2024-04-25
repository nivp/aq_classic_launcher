const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
  MenuItem,
  ipcMain,
} = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const fs = require("fs");

let pluginName;
let iconName;
switch (process.platform) {
  case "win32":
    iconName = "\\resources\\Favicon.ico";
    if (process.arch == "ia32") {
      // Pepper Flash Player 32-bit 32_0_0_371
      pluginName = "\\resources\\pepflashplayer_32.dll";
    } else {
      // Pepper Flash Player 64-bit 32_0_0_371
      pluginName = "\\resources\\pepflashplayer_64.dll";
    }
    break;
  case "darwin":
    // Plugin not updated
    iconName = "/resources/Favicon.ico";
    pluginName = "/resources/PepperFlashPlayer.plugin";
    break;
  case "linux":
    iconName = "/resources/Favicon.ico";
    if (process.arch == "ia32") {
      // Plugin not updated
      pluginName = "/resources/libpepflashplayer_32.so";
    } else if (process.arch == "armv7l") {
      // Plugin not updated
      pluginName = "/resources/libpepflashplayer_armv7l.so";
    } else {
      // Plugin not updated
      pluginName = "/resources/libpepflashplayer_64.so";
    }
    break;
}

let pluginPath = process.env.ELECTRON_START_URL
  ? path.join(__dirname, pluginName)
  : __dirname.replace("app.asar", "app.asar.unpacked") + pluginName;

let iconPath = process.env.ELECTRON_START_URL
  ? path.join(__dirname, iconName)
  : __dirname.replace("app.asar", "app.asar.unpacked") + iconName;

function returnPath() {
  return pluginPath;
}

if (!fs.existsSync(pluginPath)) {
  console.log(pluginPath);
  throw new Error(`Plugin does not exist in path: ${pluginPath}.`);
}
else {
  console.log(`Found plugin in path: ${pluginPath}`);
}

ipcMain.on("asynchronous-message", (event, arg) => {
  event.sender.send("asynchronous-reply", returnPath());
});

app.commandLine.appendSwitch("ppapi-flash-path", pluginPath);
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.371');
app.commandLine.appendSwitch('--no-sandbox')
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

let tray;

function createWindow() {
  const { screen } = require("electron");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  let s_height = parseInt(height / 240 - 1) * 240;
  let s_width = (s_height * 4) / 3;

  const win = new BrowserWindow({
    icon: iconPath,
    show: false,
    height: s_height + 61,
    width: s_width,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
      webviewTag: true,
    },
  });

  win.setMenu(null);

  win.once("ready-to-show", () => {
    if (isDev) {
      win.webContents.openDevTools();
    }
    win.show();
  });

  win.loadFile("index.html");

  return win;
}

function createSystemTray(win) {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Reload",
      type: "normal",
      click: (item, window, event) => {
        win.webContents.send("hotkey", "reload");
      },
    },
    {
      label: "Clear Cache",
      type: "normal",
      click: (item, window, event) => {
        win.webContents.session.clearCache(function () {
          win.webContents.session.getCacheSize((value) => {
            if (isDev) {
              console.log(value);
            }
          });
        });
      },
    },
    {
      label: "Reload + Clear Cache",
      type: "normal",
      click: (item, window, event) => {
        win.webContents.session.clearCache(function () {
          win.webContents.session.getCacheSize((value) => {
            if (isDev) {
              console.log(value);
            }
          });
        });
        win.webContents.send("hotkey", "reload");
      },
    },
    {
      label: "Exit",
      type: "normal",
      click: (item, window, event) => {
        if (process.platform == "win32") {
          tray.destroy();
        }
        app.quit();
      },
    },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}

function createMenu(win) {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Options",
      submenu: [
        {
          label: "Reload",
          type: "normal",
          accelerator: "F5",
          click: (item, window, event) => {
            win.webContents.send("hotkey", "reload");
          },
        },
        {
          label: "Clear Cache",
          type: "normal",
          accelerator: "F4",
          click: (item, window, event) => {
            win.webContents.session.clearCache(function () {
              win.webContents.session.getCacheSize((value) => {
                if (isDev) {
                  console.log(value);
                }
              });
            });
          },
        },
        {
          label: "Reload + Clear Cache",
          type: "normal",
          accelerator: process.platform === "darwin" ? "Cmd+F5" : "Ctrl+F5",
          click: (item, window, event) => {
            win.webContents.session.clearCache(function () {
              win.webContents.session.getCacheSize((value) => {
                if (isDev) {
                  console.log(value);
                }
              });
            });
            win.webContents.send("hotkey", "reload");
          },
        },
        {
          label: "Toggle Fullscreen",
          type: "normal",
          accelerator: "F11",
          click: (item, window, event) => {
            if (win.isFullScreen()) {
              win.setFullScreen(false);
            } else {
              win.setFullScreen(true);
            }
          },
        },
        {
          label: "Open Developer Tools",
          type: "normal",
          accelerator:
            process.platform === "darwin" ? "Cmd+Shift+I" : "Ctrl+Shift+I",
          click: (item, window, event) => {
            //win.webContents.openDevTools();
            win.webContents.send("hotkey", "devtools");
          },
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
}

app.on("ready", () => {
  win = createWindow();
  if (process.platform == "win32") {
    createSystemTray(win);
  }
  createMenu(win);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    try {
      if (process.platform == "win32") {
        tray.destroy();
      }
    } catch (e) {
      console.log("incorrect platform.");
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
