import { GET } from '/http_requests.js';
import { error } from './session_manager.js';

/**
 * check if user is verified
 *
 * @param success
 * @param failed
 */
export function checkSession(success, failed) {
  GET('/api/sessionCredentials',
    (responseJSON) => {
      sessionStorage.clear();
      Object.keys(responseJSON).forEach((key) =>
        sessionStorage.setItem(key, responseJSON[key])
      );
      success();
    },
    (err) => {
      error(err);
      sessionStorage.clear();
      failed();
    }
  );
}
