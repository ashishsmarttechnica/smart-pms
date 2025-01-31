const formatTime = (totalSeconds) => {
  if (isNaN(totalSeconds)) {
    totalSeconds = 0
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export const formatTimeByHHMM = (totalSeconds) => {


  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    return '0h 0m' // Return 0 hours and 0 minutes if totalSeconds is 0 or invalid
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  // If the total time is less than 1 minute (i.e., < 60 seconds), show 0 hours and 1 minute
  if (totalSeconds < 60) {
    return '0h 1m' // Or you can handle differently if needed, e.g., "less than a minute"
  }

  let timeString = `${hours}h `

  // Append minutes if they are greater than 0
  if (minutes > 0 || hours > 0) {
    timeString += `${minutes}m`
  }

  return timeString
}

export default formatTime
