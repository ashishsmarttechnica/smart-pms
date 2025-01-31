// src/socketHandler.js
import { Server } from 'socket.io'
import express from 'express'
import http from 'http'
import cors from 'cors'
const expressApp = express()
export const localServer = http.createServer(expressApp)

expressApp.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow specific methods
    credentials: true // Allow credentials (if needed)
  })
)
export function setupSocketServer() {
  const io = new Server(localServer, {
    cors: {
      origin: 'http://localhost:5173', // Allow your Vite app's origin
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true // Allow credentials if needed
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected')
    socket.emit('message', { text: 'Welcome to the server!' })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  return io
}
