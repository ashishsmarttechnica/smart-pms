export const openLinkInBrowser = async (url) => {
  try {
    if (window.electron && window.electron.openExternal) {
      await window.electron.openExternal(url)
    } else {
      console.error('Electron API is not available')
    }
  } catch (error) {
    console.error('Error while trying to open the link:', error)
  }
}
