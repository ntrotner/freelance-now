import { POST, GET } from '/http_requests.js'
import { error } from './session_manager.js'

export function startChat (email, success, failed) {
  POST('/api/startChat',
    [{ name: 'Content-Type', value: 'application/json' }],
    { to: email },
    (msg) => {
      success(msg)
    },
    (msg) => {
      error(msg)
      failed()
    }
  )
}

export function getAllChats (success, failed) {
  GET('/api/getActiveChats', (msg) => success(msg), (msg) => {
    error(msg)
    failed(msg)
  })
}

export function getChatContent (email, success, failed) {
  POST('/api/getAllChats',
    [{ name: 'Content-Type', value: 'application/json' }],
    { to: email },
    (msg) => {
      success(msg)
    },
    (msg) => {
      error(msg)
      failed()
    }
  )
}

export function checkChatUpdate (email, index, success, failed) {
  POST('/api/updateMessages',
    [{ name: 'Content-Type', value: 'application/json' }],
    { to: email, index },
    (msg) => {
      success(msg)
    },
    (msg) => {
      error(msg)
      failed()
    }
  )
}

export function sendMessage (email, message, index, success, failed) {
  POST('/api/sendMessage',
    [{ name: 'Content-Type', value: 'application/json' }],
    { to: email, message, index },
    (msg) => {
      success(msg)
    },
    (msg) => {
      error(msg)
      failed()
    }
  )
}
