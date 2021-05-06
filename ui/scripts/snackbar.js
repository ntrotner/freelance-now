export function callSnackbar (message) {
  const x = document.getElementById('snackbar')

  x.innerText = message
  x.className = 'show'

  setTimeout(function () {
    x.className = x.className.replace('show', '')
  }, 3000)
}

export function closeSnackbar () {
  const x = document.getElementById('snackbar')
  x.className = x.className.replace('show', '')
}
