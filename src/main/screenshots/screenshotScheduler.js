import { getStorage, setStorage } from '../storage/storage'
import { takeScreenshot } from './screenshotHandler'

// Initialize variables from storage or set defaults
let timeoutIds = []
let isCapturing = getStorage('isCapturing') || false
let isPaused = getStorage('isPaused') || false
let scheduledTimes = getStorage('scheduledTimes') || []
let currentExecutionIndex = getStorage('currentExecutionIndex') || 0
let elapsedTime = getStorage('elapsedTime') || 0
let previousTotalDuration = getStorage('totalDurationInSeconds') || null
let previousExecutions = getStorage('executions') || null

// Function to save the current state to storage
function saveState() {


  setStorage('isCapturing', isCapturing)
  setStorage('isPaused', isPaused)
  setStorage('scheduledTimes', scheduledTimes)
  setStorage('currentExecutionIndex', currentExecutionIndex)
  setStorage('elapsedTime', elapsedTime)
  setStorage('totalDurationInSeconds', previousTotalDuration)
  setStorage('executions', previousExecutions)
}

// New global variable to store the interval ID for elapsedTime increment
let elapsedTimeInterval

// Function to increment elapsed time every second while capturing is active
// Function to increment elapsed time every second while capturing is active
function startElapsedTime(taskData) {
  if (elapsedTimeInterval) return // Prevent multiple intervals
  elapsedTimeInterval = setInterval(() => {
    if (!isCapturing || isPaused) return // Stop incrementing if paused or capturing is stopped

    elapsedTime++

    // Check if elapsedTime exceeds totalDurationInSeconds
    if (elapsedTime >= previousTotalDuration) {
      console.log('Elapsed time has exceeded the total duration. Resetting to 0.')
      elapsedTime = 0 // Reset elapsedTime to 0
      currentExecutionIndex = 0 // Reset execution index
      scheduledTimes = [] // Reset scheduled times
      scheduleScreenshots(previousTotalDuration, previousExecutions, taskData) // Reschedule screenshots
    }

    saveState() // Save the updated elapsed time to storage
  }, 1000) // Increment every second (1000 ms)
}

// Function to stop the increment of elapsed time
function stopElapsedTime() {
  if (elapsedTimeInterval) {
    clearInterval(elapsedTimeInterval) // Clear the interval to stop the time
    elapsedTimeInterval = null
    console.log('Elapsed time increment has been stopped.')
  }
}

export function scheduleScreenshots(totalDurationInSeconds, executions, taskData) {
  // Check if parameters have changed
  if (previousTotalDuration !== totalDurationInSeconds || previousExecutions !== executions) {
    console.log('Parameters have changed. Resetting scheduler...')
    resetScheduler(totalDurationInSeconds, executions, taskData) // Reset scheduler data
  }

  if (!isCapturing || isPaused) return

  if (scheduledTimes.length === 0 || elapsedTime >= totalDurationInSeconds) {
    scheduledTimes = []
    for (let i = 0; i < executions; i++) {
      const randomTime = Math.floor(Math.random() * totalDurationInSeconds)
      scheduledTimes.push(randomTime)
    }
    scheduledTimes.sort((a, b) => a - b)
    console.log('Scheduled screenshot times (seconds):', scheduledTimes)
    saveState() // Save updated scheduled times
  }

  for (let i = currentExecutionIndex; i < scheduledTimes.length; i++) {
    const time = scheduledTimes[i]
    const remainingTime = Math.max(0, time - elapsedTime) * 1000
    // console.log(remainingTime, 'this is the remaining time')

    const timeoutId = setTimeout(() => {
      if (!isCapturing || isPaused) return

      takeScreenshot(taskData)
      console.log(`Screenshot taken at ${time} seconds.`)

      currentExecutionIndex++
      saveState() // Save updated execution index and elapsed time

      if (currentExecutionIndex === executions && isCapturing) {
        const delayUntilNextCycle = Math.max(0, totalDurationInSeconds - elapsedTime) * 1000
        console.log('Cycle complete, rescheduling...')
        setTimeout(() => {
          if (isCapturing) {
            elapsedTime = 0
            currentExecutionIndex = 0
            scheduledTimes = []
            saveState() // Save reset state
            scheduleScreenshots(totalDurationInSeconds, executions, taskData)
          }
        }, delayUntilNextCycle)
      }
    }, remainingTime)

    timeoutIds.push(timeoutId)
  }
}

export function startCapturingScreenshots(totalDurationInSeconds, executions, taskData) {
  if (isCapturing && !isPaused) return // If already capturing, do nothing
  if (isPaused) {
    isPaused = false
    console.log('Screenshot capturing has resumed.')
    console.log('Scheduled times:', scheduledTimes) // Log the scheduled times on resume
    console.log('Resuming from elapsed time:', elapsedTime)
    saveState() // Save resumed state
    scheduleScreenshots(totalDurationInSeconds, executions, taskData)
    startElapsedTime(taskData) // Start incrementing elapsed time again
  } else {
    isCapturing = true
    isPaused = false
    elapsedTime = 0 // Reset elapsed time on start
    currentExecutionIndex = 0
    scheduledTimes = []
    previousTotalDuration = totalDurationInSeconds
    previousExecutions = executions
    console.log('Screenshot capturing has started.')
    console.log('Scheduled times will be set soon.')
    saveState() // Save started state
    scheduleScreenshots(totalDurationInSeconds, executions, taskData)
    startElapsedTime(taskData) // Start incrementing elapsed time
  }
}

export function pauseCapturingScreenshots() {
  if (!isCapturing) return // If not capturing, do nothing
  if (isPaused) return // If already paused, do nothing

  isPaused = true
  stopElapsedTime() // Stop the elapsed time increment
  timeoutIds.forEach((id) => clearTimeout(id)) // Clear all scheduled timeouts
  timeoutIds = [] // Reset timeout IDs
  console.log('Screenshot capturing has been paused.')
  console.log('Scheduled times at pause:', scheduledTimes) // Log scheduled times on pause
  saveState() // Save paused state
}

export function stopCapturingScreenshots() {
  if (timeoutIds.length > 0) {
    timeoutIds.forEach((id) => clearTimeout(id)) // Clear all timeouts
    timeoutIds = [] // Reset timeout IDs
  }

  isCapturing = false
  isPaused = false
  elapsedTime = 0 // Reset elapsed time
  scheduledTimes = []
  currentExecutionIndex = 0
  console.log('Screenshot capturing has been stopped.')
  saveState() // Save stopped state
}

// Function to reset scheduler
function resetScheduler(totalDurationInSeconds, executions, taskData) {
  if (timeoutIds.length > 0) {
    timeoutIds.forEach((id) => clearTimeout(id)) // Clear all timeouts
    timeoutIds = [] // Reset timeout IDs
  }

  isCapturing = false
  isPaused = false
  elapsedTime = 0
  scheduledTimes = []
  currentExecutionIndex = 0
  previousTotalDuration = totalDurationInSeconds
  previousExecutions = executions
  console.log('Scheduler has been reset.')
  console.log('Scheduled times cleared on reset:', scheduledTimes) // Log when scheduled times are reset
  saveState() // Save reset state
  scheduleScreenshots(totalDurationInSeconds, executions, taskData)
}
