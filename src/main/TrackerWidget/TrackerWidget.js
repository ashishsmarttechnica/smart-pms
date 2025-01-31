import { app, BrowserWindow } from 'electron';
import path, { join } from 'path';

let trackerWindows = []; // Array to hold all tracker widget windows

/**
 * Starts a tracker widget.
 *
 * @param {BrowserWindow} mainWindow - The main Electron window.
 * @param {Object} activeTask - The active task data to be sent to the tracker widget.
 */
export const starttrackerWidget = (mainWindow, activeTask) => {
  const { screen } = require('electron');
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  // Create the tracker widget window
  const trackerWindow = new BrowserWindow({
    width: 140,
    height: 40,
    x: screenSize.width - 150,
    y: screenSize.height - 100,
    resizable: false,
    transparent: true,
    frame: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    show: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
    },
  });

  trackerWindow.setAlwaysOnTop(true)
  trackerWindow.setSkipTaskbar(true)
  // Add the tracker window to the list
  trackerWindows.push(trackerWindow);
  // Load the content for the tracker widget
  const routePath = 'tracker-widget'; // Route for the tracker widget
  const filePath = path.join(__dirname, '../renderer/index.html');
  let url = `file://${filePath}`;

  if (routePath) {
    url += `#${routePath.startsWith('/') ? routePath.slice(1) : routePath}`;
  }

  if (process.env['ELECTRON_RENDERER_URL']) {
    url = `${process.env['ELECTRON_RENDERER_URL']}/#/tracker-widget`;
  }

  trackerWindow.loadURL(url);

  trackerWindow.webContents.on('did-finish-load', () => {
    if (activeTask) {
      trackerWindow.webContents.send('set-active-task', activeTask);
    }
  });

  trackerWindow.on('closed', () => {
    // Remove the closed tracker window from the list
    trackerWindows = trackerWindows.filter(win => win !== trackerWindow);
  });

  mainWindow.on('close', () => {
    // Close all tracker windows when the main window closes
    trackerWindows.forEach(win => {
      if (win && !win.isDestroyed()) {
        win.close();
      }
    });
    trackerWindows = []; // Clear the list after closing all tracker windows
  });
};

/**
 * Stops all tracker widgets.
 */
export const stopTrackerWidget = () => {
  trackerWindows.forEach(win => {
    if (win && !win.isDestroyed()) {
      win.close();
    }
  });
  trackerWindows = []; // Clear the list after closing all windows
};
