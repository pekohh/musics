import * as types from './mutations-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex (list, song) { // 满足回调函数中指定的测试条件的第一个数组元素的索引值
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 播放一首歌的方法
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_MODE, playMode.sequence)
  commit(types.SET_CURRENTINDEX, index)
}

// 随机播放全部
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENTINDEX, 0)
  commit(types.SET_PLAY_MODE, playMode.random)
}

// suggest里面播放一首歌
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]

  // 第一项、先查找一下当前列表中否有待添加歌曲
  let fpIndex = findIndex(playlist, song)

  // 在当前播放歌曲后边插入，所以索引+1
  currentIndex++
  playlist.splice(currentIndex, 0, song) // playlist里面添加这首歌

  // 插入完成之后需要判断两种情况，新插入的歌曲是否已经存在在列表中
  if (fpIndex > -1) { // 如果存在
    if (currentIndex > fpIndex) { // [1,2,3,4,(2)]
      playlist.splice(fpIndex, 1) // 删除原来的
      currentIndex--
    } else { // 【1，(2),3，4，2】
      playlist.splice(fpIndex + 1, 1) // 删除原来的
    }
  }

  // 第二项、设置顺序播放列表中将要插入歌曲的位置(当前位置+1)
  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  // 查找一下当前列表是否有待添加歌曲，并返回其索引
  let fsIndex = findIndex(sequenceList, song)

  // 将歌曲插入到顺序播放列表
  sequenceList.splice(currentSIndex, 0, song)

  // 如果此列表此前已包含待插入歌曲
  if (fsIndex > -1) {
    // 两种情况 【1，2，3，4，2】
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)  // 删除原来的
    } else { //  【1，(2),3，4，2】
      sequenceList.splice(fsIndex + 1, 1)  // 删除原来的
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENTINDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史结果
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除一条历史记录值
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空历史记录的值
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除playlist(sequenceList) 里面的一条歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playlist, song) // 查找这首歌在playlist的位置
  playlist.splice(pIndex, 1) // 把这首歌在playlist里面删除

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1) // 把这首歌在sequenceList里面删除

  if (currentIndex > pIndex || currentIndex === playlist.length) { // 删除当前歌曲或者当前歌曲前面的歌，则currentIndex -1
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENTINDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false) // 如果删除完了之后此时列表里为空。则播放状态要改成false
  } else {
    commit(types.SET_PLAYING_STATE, true) // 否则播放状态为true
  }
}

// 清空playlist(sequenceList)里面的所有歌曲
export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENTINDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

// 保存播放历史记录
export const savePlayHistory = function ({commit, state}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 保存收藏的列表记录
export const saveFavoriteList = function ({commit, state}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 从收藏列表中删除一条记录
export const deleteFavoriteList = function ({commit, state}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
