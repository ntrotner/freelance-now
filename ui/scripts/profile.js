import { POST } from '/http_requests.js';
import { error } from './session_manager.js';

/**
 * get profile of developer/client
 *
 * @param email
 * @param success
 * @param failed
 */
export function getProfile(email, success, failed) {
  POST('/api/getProfile',
      [{name: 'Content-Type', value: 'application/json'}],
      {email},
      (response) => {
        success(response);
      },
      (response) => {
        error(response);
        failed(response);
      }
  );
}

export function prettifySkill(skill) {
  return {
    frontend: 'Front-End',
    backend: 'Back-End',
    servermanagement: 'Server Management',
    docker: 'Docker',
    js: 'JavaScript',
    php: 'PHP',
    angular: 'Angular',
    vuejs: 'Vue.js'
  }[skill];
}
