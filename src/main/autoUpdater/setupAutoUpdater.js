// 🔹 Auto-Updater Function
import { autoUpdater } from "electron-updater";
import log from "electron-log";


function setupAutoUpdater() {
  log.transports.file.level = "info";
  autoUpdater.logger = log;

  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...");
  });

  autoUpdater.on("update-available", (info) => {
    log.info(`Update available: ${info.version}`);

    // User ko confirm karne ke liye dialog
    dialog
      .showMessageBox({
        type: "info",
        title: "Update Available",
        message: `New version ${info.version} is available. Do you want to update now?`,
        buttons: ["Update", "Later"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  autoUpdater.on("update-not-available", () => {
    log.info("No new update available.");
  });

  autoUpdater.on("download-progress", (progressObj) => {
    log.info(`Download Speed: ${progressObj.bytesPerSecond}`);
    log.info(`Downloaded ${progressObj.percent}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded. Installing...");

    dialog
      .showMessageBox({
        type: "info",
        title: "Update Ready",
        message:
          "Update downloaded. The app will now restart to apply the update.",
        buttons: ["Restart Now"],
      })
      .then(() => {
        autoUpdater.quitAndInstall();
      });
  });

  autoUpdater.on("error", (err) => {
    log.error("Update error:", err);
  });

  autoUpdater.checkForUpdatesAndNotify();
}


export default setupAutoUpdater