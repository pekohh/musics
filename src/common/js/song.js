import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

// 采用面向对象的方式创建一个歌曲类
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id // 歌曲id
    this.mid = mid // 歌曲mid
    this.singer = singer // 歌手
    this.name = name // 歌曲名
    this.album = album // 专辑
    this.duration = duration // 歌曲时常
    this.image = image // 专辑图片
    this.url = url // 歌曲地址
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

// 创建歌曲函数，并采用歌曲基本类
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

export function filterSinger (singer) {
  let ret = []
  if (!singer) { // 如果歌手数组为空。则返回‘’
    return ''
  }
  singer.forEach((s) => { // 否则遍历歌手数组,取出来歌手名称放到新数组
    ret.push(s.name)
  })
  return ret.join('/') // 把数组里面的歌手换成用/ 拼接的字符串
}
