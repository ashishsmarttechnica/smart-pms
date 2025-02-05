import { autoUpdater } from "electron-updater";
import log from "electron-log";
import { app, ipcMain } from "electron";

function setupAutoUpdater(win) {
  log.transports.file.level = "info";
  autoUpdater.logger = log;
  console.log("auto updater setup");

  // Force update check in development mode
  if (!app.isPackaged) {
    autoUpdater.forceDevUpdateConfig = true;
  }

  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...");

    win.webContents.send("update-checking");
  });

  autoUpdater.on("update-available", (info) => {
    log.info(`Update available: ${info.version}`);
    win.webContents.send("update-available", info.version);
  });

  autoUpdater.on("update-not-available", () => {
    log.info("No new update available.");
    win.webContents.send("update-not-available");
  });

  autoUpdater.on("download-progress", (progressObj) => {
    log.info(`Downloaded ${progressObj.percent}%`);
    win.webContents.send("update-progress", progressObj.percent);
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded. Installing...");
    win.webContents.send("update-downloaded");
  });

  autoUpdater.on("error", (err) => {
    log.error("Update error:", err);
    win.webContents.send("update-error", err.message);
  });

  ipcMain.on("check-for-updates", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  ipcMain.on("restart-app", () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdatesAndNotify();
}

export default setupAutoUpdater;
