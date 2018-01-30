// 采用面向对象的方式创建一个歌手类  这是es6的方法创建一个类 ，传参采用coustructor(){}
export default class Singer {
  constructor ({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
