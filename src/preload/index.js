// const { contextBridge, ipcRenderer } = require('electron');
// const path = require('path');

// // Expose Electron API to the renderer process
// contextBridge.exposeInMainWorld('electron', {

//   send: (channel, data) => {
//     ipcRenderer.send(channel, data); // Send data to the main process
//   },
//   receive: (channel, callback) => {
//     ipcRenderer.on(channel, (event, ...args) => callback(...args)); // Receive data from the main process
//   },
//   invoke: (channel, data) => {
//     // Invoke a method and return a promise
//     return ipcRenderer.invoke(channel, data);
//   },

//   path: {
//     join: (...args) => path.join(...args),  // Expose path.join
//     dirname: () => __dirname,  // Expose __dirname
//   },
// });

// contextBridge.exposeInMainWorld('env', {
//   VITE_SERVER_URL: process.env.VITE_SERVER_URL
// });

// // console.log('Preload script loaded');

// const { contextBridge, ipcRenderer } = require('electron');
// const path = require('path');

// // Expose Electron API to the renderer process
// contextBridge.exposeInMainWorld('electron', {
//   send: (channel, data) => {
//     ipcRenderer.send(channel, data); // Send data to the main process
//   },
//   receive: (channel, callback) => {
//     ipcRenderer.on(channel, (event, ...args) => callback(...args)); // Receive data from the main process
//   },
//   invoke: (channel, data) => {
//     // Invoke a method and return a promise
//     return ipcRenderer.invoke(channel, data);
//   },

//   // Exposing the path module's functionality
//   path: {
//     join: (...args) => path.join(...args),  // Expose path.join for combining paths
//     dirname: () => __dirname,  // Expose __dirname to get the current directory
//   },
// });

// // Expose environment variables
// contextBridge.exposeInMainWorld('env', {
//   VITE_SERVER_URL: process.env.VITE_SERVER_URL || 'http://localhost:3000', // Set a fallback value if VITE_SERVER_URL is not defined
// });

// // Optional console log for testing if the preload script is loading
// console.log('Preload script loaded');

const { contextBridge, ipcRenderer, shell } = require('electron')
const path = require('path')

// Expose Electron API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data) // Send data to the main process
  },

  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args)) // Receive data from the main process
  },
  invoke: (channel, data) => {
    // Invoke a method and return a promise
    return ipcRenderer.invoke(channel, data)
  },

  // Exposing the path module's functionality
  path: {
    join: (...args) => path.join(...args), // Expose path.join for combining paths
    dirname: () => __dirname // Expose __dirname to get the current directory
  },
  openExternal: (url) => shell.openExternal(url)
  // Adding shell module functionality to open external links
})

// contextBridge.exposeInMainWorld('electron', {
//   openExternal: (url) => shell.openExternal(url)
// })

// Expose environment variables
contextBridge.exposeInMainWorld('env', {
  VITE_SERVER_URL: process.env.VITE_SERVER_URL || 'http://localhost:3000' // Set a fallback value if VITE_SERVER_URL is not defined
})

// Optional console log for testing if the preload script is loading
console.log('Preload script loaded')
