import axios from 'axios'
import qs from 'qs'
import cookie from 'js-cookie'

export default axios.create({
  baseURL: 'https://www.heraldstudio.com/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest(req) {
    if (typeof req === 'object') {
      req = qs.stringify(req)
    }
    if (!/^uuid=|&uuid=/.test(req)) {
      let user = cookie.getJSON('user')
      if (typeof user === 'object' && user.uuid) {
        req = 'uuid=' + user.uuid + (req ? '&' + req : '')
      }
    }
    return req
  },
  timeout: 15000,
  validateStatus: () => true
})