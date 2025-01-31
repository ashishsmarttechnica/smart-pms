const calculateDuration = (startDate, endDate) => {

  const start = new Date(startDate)
  const end = new Date(endDate)
  const durationInMilliseconds = end - start
  const durationInSeconds = Math.floor(durationInMilliseconds / 1000)
  return durationInSeconds
}

export default calculateDuration
