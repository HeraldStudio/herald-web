Date.prototype.getFullWeek = function () {
  let baseDay = new Date(1970, 0, 5);
  return parseInt((this.getTime() - baseDay.getTime()) / (7 * 24 * 3600 * 1000)) + 1;
}

export default {
  formatTimeNatural: function (timestamp) {
    let date = new Date(timestamp)
    let now = new Date()
    let nowTime = now.getTime()
    let dsec = Math.round((timestamp - nowTime) / 1000)
    if (Math.abs(dsec) < 60) {
      return dsec < 0 ? '刚刚' : '现在'
    }
    let dmin = Math.round(dsec / 60)
    if (Math.abs(dmin) < 60) {
      return Math.abs(dmin) + '分钟' + (dmin < 0 ? '前' : '后')
    }
    let dhr = Math.round(dmin / 60)
    if (Math.abs(dhr) < 24 && date.getDate() === now.getDate()) {
      return Math.abs(dhr) + '小时' + (dhr < 0 ? '前' : '后')
    }
    return this.formatDateNatural(timestamp)
  },

  formatPeriodNatural: function (start, end) {
    let startDate = this.formatDateNatural(start)
    let endDate = this.formatDateNatural(end)
    let startTime = this.formatTime(start, 'H:mm')
    let endTime = this.formatTime(end, 'H:mm')

    if (startTime === '0:00' && (endTime === '23:59' || endTime === '0:00')) {
      if (startDate === endDate) {
        return startDate + '全天'
      } else {
        return startDate + '~' + endDate + ' 全天'
      }
    }

    if (startDate === endDate) {
      if (startTime === endTime) {
        return startDate + ' ' + this.formatTime(start, 'H:mm')
      }
      return startDate + ' ' + this.formatTime(start, 'H:mm') + '~' + this.formatTime(end, 'H:mm')
    } else {
      return startDate + ' ' + this.formatTime(start, 'H:mm') + '~' + endDate + ' ' + this.formatTime(end, 'H:mm')
    }
  },

  formatDateNatural: function (timestamp) {
    let date = new Date(timestamp)
    let today = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)

    let dday = parseInt((date.getTime() - today.getTime()) / 1000 / 60 / 60 / 24)
    if (dday === 0) {
      return '今天'
    }
    if (dday === 1) {
      return '明天'
    }
    if (dday === 2) {
      return '后天'
    }
    if (dday === -1) {
      return '昨天'
    }
    if (dday === -1) {
      return '前天'
    }
    if (date.getFullWeek() === today.getFullWeek()) {
      return '周' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    }
    if (date.getFullWeek() === today.getFullWeek() - 1) {
      return '上周' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    }
    if (date.getFullWeek() === today.getFullWeek() + 1) {
      return '下周' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    }
    if (date.getFullYear() === today.getFullYear()) {
      return this.formatTime(timestamp, 'M/d')
    } else {
      return this.formatTime(timestamp, 'yyyy/M/d')
    }
  },

  formatTime: function (timestamp, format) {
    let date = new Date(timestamp)
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
      'H+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds() //毫秒
    }
    let week = ['日', '一', '二', '三', '四', '五', '六']
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(format)) {
      format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay()])
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return format.replace(/N?aN/g, '')
  },

  formatYearAndMonth: function (t) {
    if (/[0-9]{4}年[0-9]{1,2}月/.test(t)) {
      return t
    }
    //yyyy,mm => yyyy年mm月
    if (/([0-9]{4}),([0-9]{1,2})/.test(t)) {
      return `${RegExp.$1}年${RegExp.$2}月`
    }
  }
}
