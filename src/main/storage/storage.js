// import fs from 'fs'
// import path from 'path'
// import { app } from 'electron'

// // Define the path to the storage file in Electron's userData directory
// const storageFile = path.join(app.getPath('userData'), 'storage.json')

// // Helper to initialize storage file if it doesn't exist
// const initializeStorage = () => {
//   try {
//     if (!fs.existsSync(storageFile)) {
//       fs.writeFileSync(storageFile, JSON.stringify({}, null, 2))
//     }
//   } catch (error) {
//     console.error('Error initializing storage file:', error)
//   }
// }

// // Initialize storage on file import
// initializeStorage()

// // Function to get a value from storage
// export const getStorage = (key) => {
//   try {
//     const data = fs.readFileSync(storageFile, 'utf-8')
//     const parsedData = JSON.parse(data)
//     return key ? parsedData[key] : parsedData // If key is provided, return its value
//   } catch (error) {
//     console.error('Error reading from storage file:', error)
//     return null
//   }
// }

// // Function to set a value in storage
// export const setStorage = (key, value) => {
//   try {
//     const data = fs.readFileSync(storageFile, 'utf-8')
//     const parsedData = JSON.parse(data)
//     parsedData[key] = value // Update or add the key-value pair
//     fs.writeFileSync(storageFile, JSON.stringify(parsedData, null, 2)) // Write back to file
//   } catch (error) {
//     console.error('Error writing to storage file:', error)
//   }
// }

// // Function to delete a key from storage
// export const deleteStorage = (key) => {
//   try {
//     const data = fs.readFileSync(storageFile, 'utf-8')
//     const parsedData = JSON.parse(data)
//     delete parsedData[key] // Remove the key
//     fs.writeFileSync(storageFile, JSON.stringify(parsedData, null, 2)) // Write back to file
//   } catch (error) {
//     console.error('Error deleting from storage file:', error)
//   }
// }

// // Function to clear all storage
// export const clearStorage = () => {
//   try {
//     fs.writeFileSync(storageFile, JSON.stringify({}, null, 2)) // Overwrite with an empty object
//   } catch (error) {
//     console.error('Error clearing storage file:', error)
//   }
// }

import fs from 'fs'
import path from 'path'
import { app } from 'electron'

// Define the path to the storage file in Electron's userData directory
const storageFile = path.join(app.getPath('userData'), 'storage.json')

// const safeWriteFileSync = (filePath, data) => {
//   try {
//     fs.writeFileSync(filePath, data, { flag: 'w' }) // Ensure atomic writes
//   } catch (error) {
//     console.error('Error writing file atomically:', error)
//   }
// }


const createBackup = () => {
  const backupFile = `${storageFile}.backup`;
  try {
    if (fs.existsSync(storageFile)) {
      fs.copyFileSync(storageFile, backupFile);
      // console.log('Backup created successfully.');
    }
  } catch (error) {
    console.error('Error creating backup file:', error);
  }
};

const safeWriteFileSync = (filePath, data) => {
  try {
    createBackup(); // Create a backup before writing
    fs.writeFileSync(filePath, data, { flag: 'w' }); // Write data atomically
  } catch (error) {
    console.error('Error writing file atomically:', error);
  }
};

const readStorageFile = () => {
  try {
    const data = fs.readFileSync(storageFile, 'utf-8')
    return data.trim() ? validateJSON(data) : {}
  } catch (error) {
    console.error('Error reading storage file:', error)
    safeWriteFileSync(storageFile, JSON.stringify({}, null, 2)) // Reset on read error
    return {}
  }
}

// Utility function to validate and parse JSON
const validateJSON = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Invalid JSON detected, resetting to default:', error)
    safeWriteFileSync(storageFile, JSON.stringify({}, null, 2)) // Reset to default
    return {} // Return empty object
  }
}

// Helper to initialize the storage file if it doesn't exist or is invalid
const initializeStorage = () => {
  try {
    if (!fs.existsSync(storageFile)) {
      safeWriteFileSync(storageFile, JSON.stringify({}, null, 2)) // Create a new file with an empty object
    } else {
      const data = fs.readFileSync(storageFile, 'utf-8')
      if (!data || data.trim() === '' || Object.keys(validateJSON(data)).length === 0) {
        safeWriteFileSync(storageFile, JSON.stringify({}, null, 2)) // Reset file if it’s empty or invalid
      }
    }
  } catch (error) {
    console.error('Error initializing storage file:', error)
  }
}

// Initialize storage on file import
initializeStorage()

// Function to get a value from storage
export const getStorage = (key) => {
  try {
    const data = fs.readFileSync(storageFile, 'utf-8')
    const parsedData = validateJSON(data)
    return key ? parsedData[key] : parsedData // If key is provided, return its value
  } catch (error) {
    console.error('Error reading from storage file:', error)
    return null
  }
}

// Function to set a value in storage
export const setStorage = (key, value) => {
  try {
    const parsedData = readStorageFile() // Use safe read
    parsedData[key] = value // Update or add the key-value pair
    safeWriteFileSync(storageFile, JSON.stringify(parsedData, null, 2)) // Safe write
  } catch (error) {
    console.error('Error writing to storage file:', error)
  }
}

// Function to delete a key from storage
export const deleteStorage = (key) => {
  try {
    const parsedData = readStorageFile();
    delete parsedData[key]; // Remove the key
    safeWriteFileSync(storageFile, JSON.stringify(parsedData, null, 2)); // Safe write
  } catch (error) {
    console.error('Error deleting from storage file:', error);
  }
};
// Function to clear all storage
export const clearStorage = () => {
  try {
    fs.writeFileSync(storageFile, JSON.stringify({}, null, 2)) // Overwrite with an empty object
  } catch (error) {
    console.error('Error clearing storage file:', error)
  }
}
