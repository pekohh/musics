import originJsonp from 'jsonp'

export default function Jsonp (url, data, options) {
  url += (url.indexOf('?') === -1 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
function param (data) {
  let url = ''
  for (let k in data) {
    let str = data[k] ? data[k] : ''
    url += `&${k}=${encodeURIComponent(str)}`
  }
  return url ? url.substring(1) : '' // 至于为什么是从第一个开始取，是因为上边在每个等式前已经加了一个&
}
