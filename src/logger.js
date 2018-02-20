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

export default {

  bindAjax() {
    try {
      if (!XMLHttpRequest.prototype._injected) {
        XMLHttpRequest.prototype._injected = true
      } else {
        // Duplicate injection
        return
      }

      let xhrOpen = XMLHttpRequest.prototype.open
      let xhrSend = XMLHttpRequest.prototype.send

      function _resolveUrl (url) {
        const link = document.createElement('a')
        link.href = url
        return `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`
      }

      XMLHttpRequest.prototype.open = function (...args) {
        this._method = args[0].toUpperCase()
        this._url = _resolveUrl(args[1])
        xhrOpen.apply(this, args)
      }

      XMLHttpRequest.prototype.send = function (data) {
        const startTime = new Date()

        this.addEventListener('readystatechange', () => {
          if (this.readyState === XMLHttpRequest.DONE) {
            const endTime = new Date();
            const costTime = endTime - startTime;
            if (this.status >= 200 && this.status < 400) {
              new Log().blue(this.status).cyan(this._method).green(this._url).yellow(costTime + 'ms').fire(console.groupCollapsed)
            } else {
              new Log().red(this.status).cyan(this._method).green(this._url).yellow(costTime + 'ms').fire(console.groupCollapsed)
            }
            if (data) new Log().blue('Request:').auto(data).fire()
            new Log().blue('Response:').auto(this.responseText).fire()
            console.groupEnd()
          }
        });

        xhrSend.call(this, data);
      };
    } catch (e) {
      new Log().blue('Logger Inject').green('Fail').fire(console.error)
    }
  }
}
