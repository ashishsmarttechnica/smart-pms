import { app, desktopCapturer } from 'electron'
// import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { url } from '../../url'

const screenshotsFolderPath = path.join(app.getPath('userData'), 'screenshots')

// Ensure the directory exists
if (!fs.existsSync(screenshotsFolderPath)) {
  fs.mkdirSync(screenshotsFolderPath)
}

export async function takeScreenshot(taskData) {
  // try {
  //   const sources = await desktopCapturer.getSources({
  //     types: ['screen'],
  //     thumbnailSize: { width: 1920, height: 1080 }
  //   })

  //   const screenSource = sources[0]
  //   const imageDataUrl = screenSource.thumbnail.toDataURL()
  //   const matches = imageDataUrl.match(/^data:(image\/([a-zA-Z]+));base64,(.+)$/)
  //   if (!matches) {
  //     throw new Error('Failed to parse image data URL')
  //   }

  //   const imageType = matches[2]
  //   const base64Data = matches[3]
  //   const imageBuffer = Buffer.from(base64Data, 'base64')
  //   const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  //   const filePath = path.join(screenshotsFolderPath, `screenshot-${timestamp}.jpg`)

  //   // Compress and save the screenshot
  //   await sharp(imageBuffer)
  //     .jpeg({ quality: 60 }) // Adjust quality
  //     .resize(1280, 720) // Optionally resize
  //     .toFile(filePath)

  //   console.log('Compressed screenshot saved successfully:', filePath)

  //   // Check and upload screenshots
  //   await checkAndSendScreenshots(taskData)
  // } catch (error) {
  //   console.error('Error capturing or compressing screenshot:', error)
  // }
}

async function checkAndSendScreenshots(taskData) {
  const files = fs
    .readdirSync(screenshotsFolderPath)
    .filter((file) => file.startsWith('screenshot'))
  try {
    const data = new FormData()

    data.append('user_id', taskData?.userId)
    data.append('project_id', taskData?.projectId)

    // List screenshot files

    // Append each file to FormData
    files.forEach((file) => {
      const filePath = path.join(screenshotsFolderPath, file)
      data.append('image', fs.createReadStream(filePath))
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${url}/api/v1/create/upload`,
      headers: {
        ...data.getHeaders()
      },
      data
    }

    const response = await axios.request(config)
    console.log('Upload successful:', response.data)

    // Delete screenshots after successful upload
    files.forEach((file) => {
      const filePath = path.join(screenshotsFolderPath, file)
      fs.unlinkSync(filePath)
      console.log('Deleted:', filePath)
    })
  } catch (error) {
    console.error('Error sending screenshots:', error)
    // Delete screenshots after successful upload
    files.forEach((file) => {
      const filePath = path.join(screenshotsFolderPath, file)
      fs.unlinkSync(filePath)
      console.log('Error Then Deleted:', filePath)
    })
  }
}
