<template>
  <scroll class="suggest" :data="result" ref="suggest"
    :pullup='pullup'
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
    	<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
    		<div class="icon">
    			<i :class="getIconCls(item)"></i>
    		</div>
    		<div class="name">
    			<p class="text" v-html="getDisplayName(item)"></p>
    		</div>
    	</li>
      <loading title='' v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script  type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import noResult from 'base/no-result/no-result'

import {ERR_OK} from 'api/config'
import {search} from 'api/search'
// import {filterSinger} from 'common/js/song' // filterSinger为私有方法,不建议暴露出来
import {createSong} from 'common/js/song'

import {mapMutations, mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20 // 默认每页有多少条数据

export default {
  data () {
    return {
      result: [], // 搜索结果
      page: 1,
      pullup: true, // 设置上拉刷新为true
      hasMore: true, // 是否有更多的标志位
      beforeScroll: true // 是否派发滚动前事件
    }
  },
  props: {
    query: { // 关键词
      type: String,
      default: ''
    },
    showSinger: { // 是否有歌手列表项
      type: Boolean,
      default: true
    }
  },
  components: {
    scroll,
    loading,
    noResult
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    // 搜索结果列表
    search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data) // 处理结果数据
          this._checkMore(res.data)
          // console.log(res.data)
          // console.log(this.result)
        }
      })
    },
    // 处理结果数据
    _genResult (data) {
      let ret = []
      // 第一个对象为歌手。如果有，则优先添加
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // 扩展运算符
      }
      // 再处理其余数据
      if (data.song) {
        // ret = ret.concat(data.song.list)
        ret = ret.concat(this._normalizeSongs(data.song.list)) // 对歌曲列表数据做处理
      }
      return ret
    },
    // 处理歌曲列表数据
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    // 获取显示列表数据的图标
    getIconCls (item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    // 获取显示列表数据的数据
    getDisplayName (item) {
      // return item.type === TYPE_SINGER ? item.singername : `${item.songname}-${filterSinger(item.singer)}`
      return item.type === TYPE_SINGER ? item.singername : `${item.name}-${item.singer}`
    },
    // 加载更多事件
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page ++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data)) // 处理结果数据
          this._checkMore(res.data)
        }
      })
    },
    // 检测是否有更多
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    // 点击筛选结果。跳到新的二级页面
    selectItem (item) {
      if (item.type === TYPE_SINGER) { // 如果是歌手，则跳到singerdetail歌手详情页面
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item) // 把这个选项派发到父组件
    },
    // 监听滚动条的滚动前事件
    listScroll () {
      this.$emit('listScroll')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (newQuery) {
      this.search(newQuery)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
.suggest
  height:100%
  overflow:hidden
  .suggest-list
    padding: 0 30px
    position: relative
    min-height: 24px
    .suggest-item
      display:flex
      align-items:center
      padding-bottom:20px
      .icon
        flex: 0 0 30px
        width:30px
        [class^='icon-']
          font-size: 14px
          color:$color-text-d
      .name
        flex:1
        font-size:14px
        color:rgba(255,255,255,0.3)
        overflow:hidden
        .text
          text-overflow:ellipsis
          overflow:hidden
          white-space:nowrap
    .loading-container
      position:absolute
      width:100%
      top:50%
      transform: translateY(-50%)
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
