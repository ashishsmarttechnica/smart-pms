import axios from 'axios'

const TIME_THRESHOLD_MS = 5000 // 5 seconds threshold

export async function checkUTCTimeMatch(localTimeString) {
  try {
    const localTime = new Date(localTimeString)
    const response = await axios.get('https://worldtimeapi.org/api/ip')
    const apiTime = new Date(response.data.utc_datetime)

    console.log('Local time string:', localTimeString)
    console.log('API time string:', apiTime.toUTCString())

    const timeDifference = Math.abs(localTime.getTime() - apiTime.getTime())

    console.log('Local time:', localTime.toISOString())
    console.log('API time:', apiTime.toISOString())
    console.log('Time difference:', timeDifference, 'ms')
    console.log(timeDifference <= TIME_THRESHOLD_MS)
    return timeDifference <= TIME_THRESHOLD_MS
  } catch (error) {
    console.error('Error checking UTC time match:', error)
    return false // Assume time mismatch on error
  }
}
