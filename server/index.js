import express from 'express'
import http from 'http'
import faye from 'faye'
import { Nuxt, Builder } from 'nuxt'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Hook up Faye and Express.
const server = http.createServer(app)
const bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45})
bayeux.attach(server)

// Subscribe to /foo
bayeux.getClient().subscribe('/foo', (message) => {
  console.log(message)
})

// Subscribe to /channelClient
bayeux.getClient().subscribe('/channelClient', (message) => {
  console.log('message: ' + message)
  bayeux.getClient().publish('/channelServer', message)
})

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
