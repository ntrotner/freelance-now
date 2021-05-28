/**
 * open snackbar for 3 seconds with custom message
 *
 * @param message
 */
export function callSnackbar(message) {
  const x = document.getElementById('snackbar');

  x.innerText = message;
  x.className = 'show';

  setTimeout(() => {
    x.className = x.className.replace('show', '');
  }, 3000);
}

/**
 * close snackbar
 */
export function closeSnackbar() {
  const x = document.getElementById('snackbar');
  x.className = x.className.replace('show', '');
}
