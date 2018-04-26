export class Log {
  format = ''
  objects = []

  str(str) {
    this.format += ' %s '
    this.objects.push(str)
    return this
  }

  obj(obj) {
    this.format += ' %o '
    this.objects.push(obj)
    return this
  }

  auto(thing, color = null) {
    if (typeof thing === 'object') {
      return this.obj(thing)
    } else {
      // Ignore numbers, bools etc
      if (/^\{[\s\S]*\}$|^\[[\s\S]*\]$/.test(thing)) {
        try {
          let json = JSON.parse(thing)
          return this.obj(json)
        } catch (e) {}
      }

      if (color) {
        this.format += ' %c%s%c '
        this.objects.push('background: ' + color + '; color: #fff; padding: 2px; font-weight: normal;')
        this.objects.push(thing)
        this.objects.push('background: initial; color: initial; padding: initial; font-weight: initial;')
      } else {
        this.format += ' %s '
        this.objects.push(thing)
      }
      return this
    }
  }

  red(thing) {
    return this.auto(thing, '#cf4d47')
  }

  yellow(thing) {
    return this.auto(thing, '#cfa61e')
  }

  green(thing) {
    return this.auto(thing, '#9bab2d')
  }

  cyan(thing) {
    return this.auto(thing, '#30ab89')
  }

  blue(thing) {
    return this.auto(thing, '#1cadcf')
  }

  fire(stream = console.log) {
    stream(this.format.replace(/\s{2,}/g, ' ').replace(/%c\s+%c/g, '%c%c').trim(), ...this.objects)
  }
}

let logger = {
  openListeners: [],
  doneListeners: [],
  pending: 0,

  bindAjax() {
    logger.doneListeners.push(function () {
      const endTime = new Date();
      const costTime = endTime - this.startTime;
      if (this.status >= 200 && this.status < 400) {
        new Log().blue(this.status).cyan(this._method).auto(this._url).yellow(costTime + 'ms').fire(console.groupCollapsed)
      } else {
        new Log().red(this.status).cyan(this._method).auto(this._url).yellow(costTime + 'ms').fire(console.groupCollapsed)
      }
      if (data) new Log().blue('Request:').auto(data).fire()
      new Log().blue('Response:').auto(this.responseText).fire()
      console.groupEnd()
    })
  }
}

let xhrOpen = XMLHttpRequest.prototype.open
let xhrSend = XMLHttpRequest.prototype.send

function _resolveUrl(url) {
  const link = document.createElement('a')
  link.href = url
  return `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`
}

XMLHttpRequest.prototype.open = function (...args) {
  this._method = args[0].toUpperCase()
  this._url = _resolveUrl(args[1])
  logger.pending++
  if (logger.pending == 1) {
    logger.openListeners.map(k => k.call(this))
  }
  xhrOpen.apply(this, args)
}

XMLHttpRequest.prototype.send = function (data) {
  this.startTime = new Date()

  this.addEventListener('readystatechange', () => {
    if (this.readyState === XMLHttpRequest.DONE) {
      logger.pending--
      if (logger.pending == 0) {
        logger.doneListeners.map(k => k.call(this))
      }
    }
  });

  xhrSend.call(this, data);
};

export default logger
