import { powerMonitor, Notification, BrowserWindow, screen } from 'electron'
import { join } from 'path'
import path from 'path'
let isMonitoringAFK = false // To keep track of whether AFK monitoring is active
let afkCheckInterval = null // Store the interval ID for idle time checking
let afkStatus = false
let activeNotificationWindow = null // Store the custom notification window

// Function to create a custom window as a persistent notification
// function createPersistentNotification(mainWindow) {
//   if (!activeNotificationWindow) {
//     activeNotificationWindow = new BrowserWindow({
//       width: 576,
//       height: 350,
//       frame: false, // No window frame
//       alwaysOnTop: true, // Keep on top
//       transparent: true, // Transparent background
//       webPreferences: {
//         nodeIntegration: false // Enable node integration for dynamic content
//       }
//     })

//     if (mainWindow) {
//       mainWindow.hide()
//     }
//     const pathToIndex = join(__dirname, '../renderer/index.html');

//     // activeNotificationWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/afk-user')
//     if (process.env['ELECTRON_RENDERER_URL']) {
//       activeNotificationWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/afk-user')
//     } else {
//       activeNotificationWindow.loadFile(join(__dirname, '../renderer/index.html') + '/#/afk-user')
//     }
//     activeNotificationWindow.on('closed', () => {
//       activeNotificationWindow = null
//     })
//   }
// }

function createPersistentNotification(mainWindow) {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize // Gets the usable area (excluding taskbars, etc.)

  if (!activeNotificationWindow) {
    activeNotificationWindow = new BrowserWindow({
      width: width,
      height: height,
      fullscreen: true, // Fullscreen mode
      frame: false, //  ` No window frame
      alwaysOnTop: true, // Keep on top
      transparent: true, // Transparent background
      webPreferences: {
        nodeIntegration: false // Disable node integration for security
      }
    })

    if (mainWindow) {
      mainWindow.hide()
    }

    // In production mode, use the file system to load the local index.html file
    const filePath = path.join(__dirname, '../renderer/index.html')
    let url = `file://${filePath}`

    // Append the route path if provided
    const routePath = 'afk-user' // Example route (can be dynamically set)
    if (routePath) {
      url += `#${routePath.startsWith('/') ? routePath.slice(1) : routePath}`
    }

    // Append query parameters if any
    const queryParams = {} // Add any query params if needed
    if (Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString()
      url += `?${queryString}`
    }

    // Load the URL into the active notification window

    if (process.env['ELECTRON_RENDERER_URL']) {
      activeNotificationWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/afk-user')
    } else {
      activeNotificationWindow.loadURL(url)
    }

    activeNotificationWindow.on('closed', () => {
      activeNotificationWindow = null
    })
  }
}

// Function to update AFK status
function updateStatus(isAFK, io, mainWindow) {
  if (afkStatus !== isAFK) {
    afkStatus = isAFK
    io.emit('status', { afk: afkStatus })

    console.log(afkStatus ? 'User is now AFK' : 'User is now active')

    if (afkStatus) {
      // Show the custom persistent notification window when user goes AFK
      createPersistentNotification(mainWindow)
    } else {
      // Close the custom persistent notification when user is active again
      if (activeNotificationWindow) {
        activeNotificationWindow.close()
        activeNotificationWindow = null
        mainWindow.show()
        mainWindow.focus()
        // Show the main window again when the user is active
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    }
  }
}

// Function to start AFK monitoring
export function startAFKMonitoring(io, mainWindow, afkTime = 120) {
  if (!isMonitoringAFK) {
    console.log('Starting AFK monitoring')

    // Set up power monitor listeners
    powerMonitor.on('lock-screen', () => updateStatus(true, io, mainWindow))
    powerMonitor.on('unlock-screen', () => updateStatus(false, io, mainWindow))
    powerMonitor.on('suspend', () => updateStatus(true, io, mainWindow))
    powerMonitor.on('resume', () => updateStatus(false, io, mainWindow))

    // Check idle time every second
    isMonitoringAFK = true
    afkCheckInterval = setInterval(() => {
      const idleTime = powerMonitor.getSystemIdleTime()
      updateStatus(idleTime >= afkTime, io, mainWindow)
    }, 1000)
  }
}

// Function to stop AFK monitoring
export function stopAFKMonitoring() {
  console.log('Stopping AFK monitoring')
  if (isMonitoringAFK) {
    // Remove listeners to prevent running AFK functions
    powerMonitor.removeAllListeners('lock-screen')
    powerMonitor.removeAllListeners('unlock-screen')
    powerMonitor.removeAllListeners('suspend')
    powerMonitor.removeAllListeners('resume')

    // Clear the idle time checking interval
    clearInterval(afkCheckInterval)
    afkCheckInterval = null
    isMonitoringAFK = false

    // Ensure to close any active notification window
    if (activeNotificationWindow) {
      activeNotificationWindow.close()
      activeNotificationWindow = null
    }
  }
}
