import { Notification, BrowserWindow, app } from 'electron'

// Track active notifications and previous critical task count
let activeNotifications = []
let oldCriticalCount = 0

// Helper function to create or retrieve the main window
// const getOrCreateMainWindow = () => {
//   let mainWindow = BrowserWindow.getAllWindows()[0]
//   if (!mainWindow) {
//     // Ensure `createWindow` is defined elsewhere in your code
//     mainWindow = createWindow()
//   }
//   return mainWindow
// }

// Common function to show a notification with click handling
const showNotification = (title, body, data, isESTTab) => {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  const notification = new Notification({ title, body })

  // Add a custom property for easy identification
  notification.customTag = 'task-notification'

  // Store the notification for tracking
  activeNotifications.push(notification)
  mainWindow.webContents.send('notification-clicked', {
    message: 'Task notification clicked!',
    data: data,
    IsESTTab: isESTTab
  })
  // Handle notification click
  notification.on('click', () => {
    mainWindow.show() // Show the main window
    mainWindow.focus() // Focus on the window
    // mainWindow.webContents.send('notification-clicked', {
    //   message: 'Task notification clicked!',
    //   data: data,
    //   IsESTTab: isESTTab
    // })
    notification.close() // Close the notification
  })

  // Display the notification
  notification.show()
}

// Function to send task notifications based on task status
export const sendTaskNotification = (data) => {
  if (data.task) {
    const { task } = data
    const { status, task_creator, total_assigns, isCritical } = task

    if (data.role != 'QA') {
      // Case 1: New Task with status 0
      if (status == 0) {
        showNotification('New Estimate Task Added', task.task, data, true)
      }

      // Case 2: Task Approved (status 2) and task creator is not the assigned user
      else if (status == 2 && task_creator !== total_assigns[0]) {
        showNotification('Your Task Has Been Approved', task.task, data, false)
      }

      // Case 3: Task Updated (status 3 or 4), not critical, and critical count decreased
      else if ((status == 3 || status == 4) && !isCritical && data.critical < oldCriticalCount) {
        showNotification('Your Critical Task Has Been Updated', task.task, data, false)
      }
    } else {
      // Case 1: New Task with status 0
      if (status == 6) {
        showNotification('New Estimate Task Added', task.task, data, true)
      }

      // Case 2: Task Approved (status 2) and task creator is not the assigned user
      else if (status == 7 && task_creator !== total_assigns[0]) {
        showNotification('Your Task Has Been Approved', task.task, data, false)
      }

      // Case 3: Task Updated (status 3 or 4), not critical, and critical count decreased
      else if ((status == 8 || status == 9) && !isCritical && data.critical < oldCriticalCount) {
        showNotification('Your Critical Task Has Been Updated', task.task, data, false)
      }
    }

    // Update the old critical count
    oldCriticalCount = data.critical
  }
}

// Function to close all active task notifications
export const removeTaskNotifications = () => {
  activeNotifications = activeNotifications.filter((notification) => {
    if (notification.customTag === 'task-notification') {
      notification.close() // Close the notification
      return false // Remove from activeNotifications
    }
    return true // Keep non-task notifications
  })
}

// Listen for app activation (when a notification is clicked)
// app.on('open-url', (event, url) => {
//   event.preventDefault()

//   const mainWindow = getOrCreateMainWindow()
//   mainWindow.show()
//   mainWindow.focus()
// })

// // To handle app focus in general
// app.on('activate', () => {
//   const mainWindow = getOrCreateMainWindow()
//   mainWindow.show()
//   mainWindow.focus()
// })
