module.exports = (conf) => {
  const config = {
    sessionName: 'default',
    baseURL: 'https://myseu.cn/ws3/',
    requestDelegate: async (url, method, headers, body) => {
      // 条件：前端超时 > 后端超时 (= 后端爬虫超时 + 后端 axios 超时)
      // 这样才会在后端回源失败时取得后端缓存数据
      return (await require('axios')({ url, method, headers, data: body, timeout: 20000 })).data
    },
    storageDelegate: {
      set (key, value) {
        return require('js-cookie').set(key, value, { expires: 60 })
      },
      get (key) {
        return require('js-cookie').get(key)
      }
    },
    onLogin (newToken) {},
    onLogout (oldToken) {},
    onError (res, path) {
      let e = new Error(res.reason)
      e.code = res.code
      e.path = res.path
      throw e
    }
  }

  for (let key in conf) {
    config[key] = conf[key]
  }

  let token = null

  let tokenKey = 'herald-' + config.sessionName + '-token'

  const changeToken = async (newValue) => {
    if (token) {
      let oldToken = token
      token = null
      if (config.storageDelegate) {
        config.storageDelegate.set(tokenKey, '')
      }
      config.onLogout && await config.onLogout(oldToken)
    }
    token = newValue
    if (token) {
      config.onLogin && config.onLogin(token)
      if (config.storageDelegate) {
        config.storageDelegate.set(tokenKey, token)
      }
    }
  }

  const RouteBuilder = (route = []) => {
    let handler = async (params = {}) => {
      let last = route[route.length - 1]
      let method = ['get', 'post', 'put', 'delete'].find(k => k === last)
      if (!method) {
        method = 'get'
      } else {
        route.splice(-1, 1)
      }

      let path = route.join('/')

      let url = config.baseURL + path
      let body = null, headers = {}
      if (method === 'get' || method === 'delete') {
        url += '?' + (typeof params === 'string' ? params :
        Object.keys(params)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&'))
      } else {
        body = typeof params === 'string' ? params : JSON.stringify(params)
        headers['Content-Type'] = 'application/json'
      }

      if (token) {
        headers.token = token
      }

      let res

      try {
        res = await config.requestDelegate(url, method.toUpperCase(), headers, body)
      } catch (e) {
        res = {
          success: false,
          code: 599,
          reason: '请求超时'
        }
      }

      if (typeof res === 'string') {
        try {
          res = JSON.parse(res)
        } catch (e) {}
      }

      if (res.success) {
        if (path === 'auth') {
          await changeToken(method === 'delete' ? null : res.result)
        }
        return res.result
      } else {
        return (config.onError && config.onError(res, '/' + path))
      }
    }

    let toString = () => {
      let _route = route
      let last = _route[_route.length - 1]
      let method = ['get', 'post', 'put', 'delete'].find(k => k === last)
      if (!method) {
        method = 'get'
      } else {
        _route.splice(-1, 1)
      }

      let path = _route.join('/')
      return 'Call this function to ' + method.toUpperCase() + ' ' + config.baseURL + path
    }

    let builder = new Proxy (handler, {
      set (target, key, value) {
        if (key === 'token') {
          changeToken(value)
          return true
        }
        return false
      },
      get (target, key) {
        if (key === 'isLogin') {
          return !!token
        } else if (key === 'token') {
          return token || null
        } else if (key === 'name') {
          return toString()
        } else if (key === 'toString' || key === 'valueOf') {
          return toString
        } else if (key === 'inspect' || key === 'then') {
          return undefined
        } else if (key === '__proto__') {
          return {}
        } else if (key === 'hasOwnProperty') {
          return k => k === 'token'
        } else if (typeof key === 'string') {
          return RouteBuilder(route.concat(key))
        }
      }
    })

    return builder
  }

  const prepare = () => {
    if (config.storageDelegate) {
      token = config.storageDelegate.get(tokenKey)
    }
    if (token) {
      config.onLogin && config.onLogin(token)
    }
  }

  /* noawait */ prepare()

  return RouteBuilder()
}
