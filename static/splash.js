setTimeout(function () {
  var splash = document.getElementById('splash')
  splash.className = 'shrink'
  setTimeout(function () {
    splash.className = 'hidden'
    setTimeout(function () {
      splash.parentNode.removeChild(splash)
    }, 500)
  }, 500)
}, 1000)
