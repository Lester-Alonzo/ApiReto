import { app } from "./config"

import {Server} from 'socket.io'

const io = new Server(
app.listen(5898, () =>
  console.log(`
    http://localhost:5898,
    /api-docs : Documentacion en swagger con OpenApi 3.0
    `),
)
)

io.on("connection", (socket) => {
  console.log(`Usuario Conectado`)

  socket.on('message', (data) => {
    console.log(`Mesaje Recibido`, data)
    io.emit('message', data)
  })

  socket.on("disconnect", () => {
    console.log('El cliente se desconecto')
  })
})