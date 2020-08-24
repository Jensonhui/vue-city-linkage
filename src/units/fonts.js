(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    const max = 24
    const min = 9.3125
    let size = 20 * (clientWidth / 320)

    size = Math.min(size, max)
    size = Math.max(size, min)
    docEl.style.fontSize = Math.floor(size) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
