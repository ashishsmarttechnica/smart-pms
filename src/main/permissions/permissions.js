import { dialog, desktopCapturer, Notification, app } from 'electron'
import fs from 'fs'
import path from 'path'

// File path to save permission status
const permissionFilePath = path.join(app.getPath('userData'), 'permissions.json')

// Function to save permissions status persistently
function savePermissions(status) {
  fs.writeFileSync(permissionFilePath, JSON.stringify(status))
}

// Function to load saved permissions
function loadPermissions() {
  if (fs.existsSync(permissionFilePath)) {
    return JSON.parse(fs.readFileSync(permissionFilePath, 'utf-8'))
  }
  return { notification: false, screenshot: false }
}

// Function to check if notifications are allowed
function checkNotificationPermission() {
  if (Notification.permission === 'default') {
    return 'default' // Not granted or denied yet
  }
  return Notification.permission // 'granted' or 'denied'
}

// Function to check screenshot permissions (for screen capture)
async function checkScreenshotPermission() {
  try {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return sources.length > 0 // Returns true if sources are available
  } catch (error) {
    console.error('Error checking screenshot permissions:', error)
    return false
  }
}

// Function to request permissions when the app opens
export async function requestPermissions() {
  const savedPermissions = loadPermissions()
  let permissionsUpdated = false

  // 1. Check and handle notification permission
  const notificationPermission = checkNotificationPermission()
  if (notificationPermission === 'default' && !savedPermissions.notification) {
    // Trigger test notification to prompt user for notification permission on macOS
    if (process.platform === 'darwin') {
      new Notification({
        title: 'Test Notification',
        body: 'Allow notifications for full functionality.'
      }).show()
    }

    savedPermissions.notification = true
    permissionsUpdated = true
  } else if (notificationPermission === 'denied' && !savedPermissions.notification) {
    savedPermissions.notification = false
    permissionsUpdated = true
  }

  // 2. Check and handle screenshot permission
  const screenshotPermission = await checkScreenshotPermission()
  if (!screenshotPermission && !savedPermissions.screenshot) {
    if (process.platform === 'darwin') {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Enable Screenshot Permissions',
        message:
          'Please enable screen recording permissions in System Preferences > Security & Privacy > Privacy > Screen Recording.'
      })
    }

    savedPermissions.screenshot = false // Explicitly set to false
    permissionsUpdated = true
  } else if (screenshotPermission && !savedPermissions.screenshot) {
    savedPermissions.screenshot = true
    permissionsUpdated = true
  }

  // Save updated permissions if any changes were made
  if (permissionsUpdated) {
    savePermissions(savedPermissions)
  }
}
