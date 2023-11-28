const socket = io('ws://localhost:3333')

const activity = document.querySelector('.activity')
const users = document.querySelector('.user-list')
const rooms = document.querySelector('.room-list')
const chat = document.querySelector('.chat-display')
const msg = document.querySelector('#message')
const username = document.querySelector('#name')
const room = document.querySelector('#room')

function onSend(e) {
  e.preventDefault()
  if (username.value && chat.value && msg.value) {
    socket.emit('message', {
      msg: msg.value,
      name: username.value
    })
    msg.value = ''
  }
  msg.focus()
}

function onEnter(e) {
  e.preventDefault()
  if (username.value && chat.value) {
    socket.emit('enterRoom', {
      name: username.value,
      room: chat.value
    })
  }
}

document.querySelector('form-msg').addEventListener('submit', onSend)
document.querySelector('form-join').addEventListener('submit', onEnter)
msg.addEventListener("keypress", () => {
  socket.emit('activity', username.value,)
})



socket.on('message', (data) => {
  activity.textContent = ""
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})



let timer
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`

  clearTimeout(timer)
  timer = setTimeout(() => {
    activity.textContent = ""
  }, 3000)
})