import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息singer.vue
  playing: false, // 是否播放
  fullScreen: false, // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式(默认为顺序播放)
  currentIndex: -1, // 当前播放歌曲id
  disc: [], // 推荐歌曲列表 recommand 二级页面的数据
  topList: [], // 排行榜歌曲列表 rank 二级页面的数据
  searchHistory: loadSearch(), // search页面的搜索历史数据列表
  playHistory: loadPlay(), // 播放历史记录
  favoriteList: loadFavorite()// 收藏喜欢的列表
}
export default state
