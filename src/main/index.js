// import { app, BrowserWindow, ipcMain, desktopCapturer, Notification, powerMonitor } from 'electron'
// import { join } from 'path'

// import { localSocketPort } from '../url'
// import {
//   stopCapturingScreenshots,
//   startCapturingScreenshots,
//   pauseCapturingScreenshots
// } from './screenshots/screenshotScheduler'
// import { setupTimeCheckHandlers } from './timeChecker/timeChecker'
// import { localServer, setupSocketServer } from './socket/socketHandler'
// import { requestPermissions } from './permissions/permissions'
// import { startAFKMonitoring, stopAFKMonitoring } from './afkManager/afkManager'
// import { removeTaskNotifications, sendTaskNotification } from './notification/notificationHandler'
// import { starttrackerWidget, stopTrackerWidget } from './TrackerWidget/TrackerWidget'

// app.disableHardwareAcceleration()
// powerMonitor.setMaxListeners(20)
// const isMac = process.platform === 'darwin'
// const isWin = process.platform === 'win32'
// const isDev = process.env.NODE_ENV === 'development'

// const server = localServer
// // Set up Socket.io using the imported function
// const io = setupSocketServer()

// let mainWindow
// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1080,
//     height: 720,
//     show: true,

//     autoHideMenuBar: true,
//     resizable: false,
//     // frame: false, // Remove the window frame
//     transparent: false, // Make the window transparent
//     webPreferences: {
//       preload: join(__dirname, '../preload/index.js'),
//       contextIsolation: true,
//       nodeIntegration: false,
//       nodeIntegrationInWorker: true
//     }
//   })

//   // win.loadURL('electron');
//   if (isDev) {
//     mainWindow.webContents.openDevTools()
//   }
//   // Prevent refresh
//   mainWindow.webContents.on('before-input-event', (event, input) => {
//     if (
//       input.key === 'F5' ||
//       (input.key.toLowerCase() === 'r' && input.control) ||
//       (input.key.toLowerCase() === 'r' && input.control && input.shift)
//     ) {
//       event.preventDefault()
//     }
//     if (input.key.toLowerCase() === 'w' && input.control && input.shift && input.alt) {
//       mainWindow.webContents.reloadIgnoringCache()
//     }
//   })

//   // Disable context menu
//   mainWindow.webContents.on('context-menu', (e) => {
//     e.preventDefault()
//   })

//   mainWindow.on('ready-to-show', () => {
//     mainWindow.show()
//   })

//   if (process.env['ELECTRON_RENDERER_URL']) {
//     mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
//   } else {
//     mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
//   }
// }

// ipcMain.handle('start-capturing-screenshots', (e, data) => {
//   const totalDurationInSeconds = data.settingData.timeDuration ?? 1800
//   const executions = data.settingData.screenshotCount ?? 2
//   // const totalDurationInSeconds = 50
//   // const executions = 2
//   startCapturingScreenshots(totalDurationInSeconds, executions, data)
// })

// ipcMain.handle('task-notification', (e, data) => {
//   sendTaskNotification(data, mainWindow)
// })
// ipcMain.handle('stop-capturing-screenshots', () => {
//   stopCapturingScreenshots()
// })
// ipcMain.handle('pause-capturing-screenshots', () => {
//   pauseCapturingScreenshots()
// })

// setupTimeCheckHandlers()

// ipcMain.handle('afk-on-off', (e, data) => {
//   if (data.status) {
//     // startAFKMonitoring(io, mainWindow, 10)
//     startAFKMonitoring(io, mainWindow, data.AfkTime)
//   } else {
//     stopAFKMonitoring()
//   }
// })

// ipcMain.handle('tracker-widget', (e, data) => {
//   if (data.status) {
//     starttrackerWidget(mainWindow, data.activeTask)
//   } else {
//     stopTrackerWidget(mainWindow)
//   }
// })

// app.whenReady().then(() => {
//   createWindow()
//   requestPermissions()

//   server.listen(localSocketPort || 335, () => {
//     console.log(`Socket.IO server is running on http://localhost:${localSocketPort || 335}`)
//   })

//   // Remove all notifications when the app is ready
//   removeTaskNotifications()

//   // Optionally, listen for when the window gains focus and remove notifications
//   BrowserWindow.getAllWindows()[0].on('focus', () => {
//     removeTaskNotifications()
//   })

//   // app.on('activate', function () {
//   //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   // })
//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })

// const gotTheLock = app.requestSingleInstanceLock()

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     console.log('window all close ')

//     app.quit()
//   }
// })

import { app, BrowserWindow, dialog, ipcMain, powerMonitor } from "electron";
import { join } from "path";

import { localSocketPort } from "../url";
import {
  stopCapturingScreenshots,
  startCapturingScreenshots,
  pauseCapturingScreenshots,
} from "./screenshots/screenshotScheduler";
import { setupTimeCheckHandlers } from "./timeChecker/timeChecker";
import { localServer, setupSocketServer } from "./socket/socketHandler";
import { requestPermissions } from "./permissions/permissions";
import { startAFKMonitoring, stopAFKMonitoring } from "./afkManager/afkManager";
import {
  removeTaskNotifications,
  sendTaskNotification,
} from "./notification/notificationHandler";
import {
  starttrackerWidget,
  stopTrackerWidget,
} from "./TrackerWidget/TrackerWidget";
import setupAutoUpdater from "./autoUpdater/setupAutoUpdater";

app.disableHardwareAcceleration();
powerMonitor.setMaxListeners(20);

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV === "development";

const server = localServer;
const io = setupSocketServer();

let mainWindow;

// Function to create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    show: true,
    autoHideMenuBar: true,
    resizable: false,
    fullscreen: false,
    transparent: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Prevent refresh
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      input.key === "F5" ||
      (input.key.toLowerCase() === "r" && input.control) ||
      (input.key.toLowerCase() === "r" && input.control && input.shift)
    ) {
      event.preventDefault();
    }
    if (
      input.key.toLowerCase() === "w" &&
      input.control &&
      input.shift &&
      input.alt
    ) {
      mainWindow.webContents.reloadIgnoringCache();
    }
  });

  // Disable context menu
  mainWindow.webContents.on("context-menu", (e) => {
    e.preventDefault();
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  if (process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// IPC Handlers
ipcMain.handle("start-capturing-screenshots", (e, data) => {
  const totalDurationInSeconds = data.settingData.timeDuration ?? 1800;
  const executions = data.settingData.screenshotCount ?? 2;
  startCapturingScreenshots(totalDurationInSeconds, executions, data);
});

ipcMain.handle("task-notification", (e, data) => {
  sendTaskNotification(data, mainWindow);
});

ipcMain.handle("stop-capturing-screenshots", () => {
  stopCapturingScreenshots();
});

ipcMain.handle("pause-capturing-screenshots", () => {
  pauseCapturingScreenshots();
});

ipcMain.handle("afk-on-off", (e, data) => {
  if (data.status) {
    startAFKMonitoring(io, mainWindow, 5);
  } else {
    stopAFKMonitoring();
  }
});

ipcMain.handle("tracker-widget", (e, data) => {
  if (data.status) {
    starttrackerWidget(mainWindow, data.activeTask);
  } else {
    stopTrackerWidget(mainWindow);
  }
});
setupTimeCheckHandlers();

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Quit if another instance is already running
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Focus the existing window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    requestPermissions();
    setupAutoUpdater();
    server.listen(localSocketPort || 335, () => {
      console.log(
        `Socket.IO server is running on http://localhost:${
          localSocketPort || 335
        }`
      );
    });

    // Remove all notifications when the app is ready
    removeTaskNotifications();

    // Remove notifications when window gains focus
    BrowserWindow.getAllWindows()[0]?.on("focus", () => {
      removeTaskNotifications();
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    powerMonitor.on("shutdown", async (event) => {
      console.log("System is shutting down or restarting...");

      // Prevent immediate shutdown
      event.preventDefault();

      try {
        // Make the API call
        await axios.post("http://192.168.1.69:2911/api/v1/dummy/api", {
          data: {
            message: "App is closing",
            timestamp: new Date().toISOString(),
          },
        });

        console.log("API call successful. Proceeding with shutdown...");
      } catch (error) {
        console.error("API call failed:", error);
      }

      // Allow shutdown/restart to proceed
      app.quit();
    });
  });

  app.on("window-all-closed", () => {
    if (!isMac) {
      console.log("All windows closed. Quitting application...");
      app.quit();
    }
  });
}
