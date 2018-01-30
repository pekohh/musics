import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 设置搜索字段
const SEARCH_MAX_LEN = 15 // 设置搜索存放的数据条数

const PLAY_KEY = '__PLAY__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

// 在数组的第一位插入新值。且保证此值是唯一的。如果有雷同，则把之前的删掉，
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare) // 查找数据中是否有与query相同的值
  if (index === 0) { // 说明在第一位,则不需要添加新词，原样返回
    return
  }
  if (index > 0) {
    arr.splice(index, 1) // 说明有，且不在第一位，则需要把这个旧的删掉
  }
  arr.unshift(val) // 然后在第一位添加(每次保证最新搜索词在队列最前面)

  if (maxLen && arr.length > maxLen) {
    arr.pop() // 此时判断队列中的长度,超过len时,把最后一个值删掉
  }
}

// 删除数据中的一条数据
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 定义一个保存一条搜索结果历史数据的方法
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, []) // 找到第一个变量的值，如果没有返回[]
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 加载数据
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

// 删除一条历史记录
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])

  deleteFromArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空所有历史记录
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 保存播放过的歌曲
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])

  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 加载播放历史记录
export function loadPlay () {
  return storage.get('__PLAY__', [])
}

// 保存一条记录到收藏列表的方法
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 从收藏列表中删除一条数据
export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 加载播放列表
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
