// 检测某个元素是否有class
export function hasClass (el, cName) {
  let reg = new RegExp('(^|\\s)' + cName + '(\\s | $)') // (^|\\s)空白符或者字符串的开始
  return reg.test(el.className)
}

// 给元素添加class
export function addClass (el, cName) {
  if (hasClass(el, cName)) {
    return
  }
  // 因为一个标签 可能 有多个class.则需要先拆分再集合
  let newClass = el.className.split(' ') // 把标签的class名分数组
  newClass.push(cName) // 把新class 添加到数组
  el.className = newClass.join(' ') // 再把数组还原成字符串
}

// 获取自定义属性的值
export function getData (el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

// 元素能力检测
let elementStyle = document.createElement('div').style // 此浏览器中所有的样式名称

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== 'undefined') { // 查出来transform在此浏览器的前缀
      return key
    }
  }
  return ''
})()

export function prefixStyle (style) {
  if (vendor === 'standart') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1) // 返回前缀+样式
}
