// 拦截所有组件中的 a，把 a 变成站外跳转提示
import Vue from 'vue'

// 重写 window.open 函数，该函数在小程序端行为将对小程序进行定制
const _open = window.open.bind(window)
window.open = (href, target) => {
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

// 所有对 a 内部的点击，截获并转换成上面的假的 window.open 函数
document.addEventListener('click', ({ target: node }) => {
  while (node && node.nodeName.toLowerCase !== 'a' && node.nodeName.toLowerCase !== 'html') {
    node = node.parentNode
  }
  if (node && node.nodeName.toLowerCase === 'a' && node.href) {
    e.preventDefault()
    window.open(node.href, node.target)
  }
})
