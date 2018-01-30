<template>
  <div class="singer" ref="singer">
    <list-view  ref="list" :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script  type="text/ecmascript-6">
import listView from 'base/listview/listview'

import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  mixins: [playlistMixin],
  name: 'hello',
  data () {
    return {
      singers: []
    }
  },
  components: {
    listView
  },
  mounted () {
    this._getSingerList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 获取singer原始数据
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          // this.singers = res.data.list
          this.singers = this._normalizeSinger(res.data.list) // 整合数据
          // console.log(this.singers)
        }
      })
    },
    // 对数据做格式处理{hot: {title:{},items: {}},"A":{title:"A",items: []},"B":{}}
    _normalizeSinger (list) {
      // 定义一个新对象。和一个hot属性
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 把前10条数据放到热门里
      list.forEach((item) => {
        if (map.hot.items.length < HOT_SINGER_LEN) {
          /*
          map.hot.items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            img: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
          */
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 给其它字母创建对象
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 将其它字母的内容添加
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 给map对象排序 热门--a-z
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 将数据排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    // 接收listView传过来的选择的二级页面的歌手信息
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
