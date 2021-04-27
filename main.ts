import * as server from './server'
import * as ui from './ui'

server.connectDB()
server.startServer()
ui.startUI()
