const axios = require('axios')

const api = axios.create({
  baseURL: 'https://www.heraldstudio.com/',
  timeout: 1000,
  validateStatus: () => true
});

(async () => {
  let res = (await api.get('stat'))
})()
