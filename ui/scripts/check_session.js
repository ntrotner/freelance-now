import { GET } from '/http_requests.js'
import { error } from './session_manager.js'

export function checkSession (success, failed) {
  GET('/api/sessionCredentials',
    (responseJSON) => {
      sessionStorage.clear()
      Object.keys(responseJSON).forEach((key) => {
        sessionStorage.setItem(key, responseJSON[key])
      })
      success()
    },
    (err) => {
      error(err)
      sessionStorage.clear()
      failed()
    }
  )
}
