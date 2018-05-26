// 拦截所有组件中的 a，把 a 变成站外跳转提示
import $ from 'jquery'
import Vue from 'vue'

const _open = window.open.bind(window)
window.open = (href, target) => {
  console.log(href)
  // 小程序环境下的站外链接
  if (/:|^\/\//.test(href) && window.__herald_env === 'mina') {
    if (href !== 'about:blank') {
      wx.miniProgram.navigateTo({
        url: '/pages/link/link?href=' + encodeURIComponent(href)
      })
    }
    return null
  }

  // 其他情况
  return _open(href, target)
}

$('a').on('click', function (e) {
  console.log(e)
  e.preventDefault()
  let href = $(this).attr('href')
  let target = $(this).attr('target')
  window.open(href, target)
})