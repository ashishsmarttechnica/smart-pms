import { ipcMain } from 'electron'

let ntpClient

/**
 * Initializes the NTP client if not already initialized.
 */
async function initializeNTPClient() {
  if (!ntpClient) {
    const { NtpTimeSync } = await import('ntp-time-sync')
    ntpClient = NtpTimeSync.getInstance()
  }
}

/**
 * Fetches the global NTP time and returns the current time.
 */
export async function getGlobalReactTime() {
  try {
    await initializeNTPClient()
    const result = await ntpClient.getTime()
    return result.now.getTime()
  } catch (error) {
    console.error('Error fetching NTP time:', error)
    throw error
  }
}

/**
 * Compares the local system time with NTP time and checks if they are within an acceptable threshold.
 */
export async function checkSystemTime() {
  try {
    const ntpTime = await getGlobalReactTime()
    const localTime = Date.now()
    const timeDifference = Math.abs(ntpTime - localTime)
    const isTimeAccurate = timeDifference < 60000 * 20 // 20-minute threshold
    // console.log(ntpTime, 'thisis a time accurate')
    // console.log(localTime, 'thisis a time accurate')

    return {
      ntpTime,
      localTime,
      timeDifference,
      isTimeAccurate
    }
  } catch (error) {
    console.error('Error checking system time:', error)
    return {
      error: 'Failed to check system time',
      localTime: Date.now()
    }
  }
}

/**
 * Starts recurring system time checks and sends a warning to the renderer process if the time is inaccurate.
 */
export function startTimeCheckHandler(event) {
  const timeCheckInterval = setInterval(async () => {
    try {
      const timeResult = await checkSystemTime()
      if (!timeResult.isTimeAccurate) {
        event.sender.send('time-mismatch-detected')
      }
    } catch (error) {
      console.error('Error in time checking:', error)
    }
  }, 60000) // Check every minute

  event.sender.on('stop-time-check', () => {
    clearInterval(timeCheckInterval)
    console.log('Time check interval cleared.')
  })
}

/**
 * Sets up IPC handlers for checking system time and starting recurring checks.
 */
export function setupTimeCheckHandlers() {
  ipcMain.handle('check-system-time', async () => {
    return await checkSystemTime()
  })

  ipcMain.handle('start-time-check', async (event) => {
    startTimeCheckHandler(event)
  })
}
