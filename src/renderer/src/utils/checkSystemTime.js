export const checkSystemTime = async () => {
  try {
    if (window.electron) {
      const timeDifference = await window.electron.invoke('check-system-time')
      console.log(timeDifference, 'this is a time difference')
      return timeDifference
    } else {
      console.error('Electron API is not available')
    }
  } catch (error) {
    console.error('Error checking system time:', error)
  }
}
