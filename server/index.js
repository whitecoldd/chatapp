import express from "express"
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const admin = 'admin'
const PORT = process.env.PORT || 3333

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`))

const userState = {
  users: [],
  setUsers: function (newUserArray) {
    this.users = newUserArray
  }
}

const io = new Server(expressServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
  }
})

io.on("connection", socket => {
  console.log(`User ${socket.id} connected!`)

  socket.emit('message', "Welcome to the Chat!")

  socket.broadcast.emit('message', `User ${socket.id} connected!`)

  socket.on('message', data => {

    io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `User ${socket.id} disconnected!`)
  })

  socket.on('activity', (name) => {
    socket.broadcast.emit('activity', name)
  })
})

function buildMsg(name, msg) {
  return {
    name,
    msg,
    time: new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',

    }).format(new Date())
  }
}

function activateUser(id, room, name) {
  const user = { id, room, name }
  userState.setUsers([
    ...userState.users.filter(user => user.id !== id),
    user
  ])
  return user
}

function userLeft(id) {
  userState.setUsers(
    userState.users.filter(user => user.id !== id)
  )
}

function getUser(id) {
  return userState.users.find(user => user.id === id)
}

function getUsersByRoom(room) {
  return userState.users.filter(user => user.room === room)
}

function getAllActiveRooms(room) {
  return Array.from(new Set(userState.users.map(user => user.room)))
}
//minute 26 lesson 5