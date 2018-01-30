<template>
  <scroll class="suggest" 
  ref="suggest"
  :data="result" 
  :pullup="pullup" 
  :beforScroll="beforeScroll"
  @scrollToEnd="searchMore"
  @beforeScroll="listScroll">
    <ul class="suggest-list">
    	<li v-for="item in result" class="suggest-item" @click="selectItem(item)">
    		<div class="icon" >
    			<i :class="getIconCls(item)"></i>
    		</div>
    		<div class="name">
    			<p class="text" v-html="getDisplayName(item)"></p>
    		</div>
    	</li>
    	<loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
    	<no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
   </scroll>
</template>

<script  type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import noResult from 'base/no-result/no-result'

import {ERR_OK} from 'api/config'
import {search} from 'api/search'
import {createSong} from 'common/js/song'
// import {filterSinger} from 'common/js/song' // filterSinger为私有方法不推荐使用
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'

const perpage = 20
const TYPE_SINGER = 'singer'

export default {
  data () {
    return {
      result: [],
      page: 1,
      pullup: true,
      hasMore: true, // 定义一个标志位(是否还有更多)
      beforeScroll: true // 设置scroll在滚动前派发事件
    }
  },
  components: {
    scroll,
    loading,
    noResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: { // 是否显示歌手
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 1搜索事件
    _search () {
      this.page = 1
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    // 2 对搜索结果数据进行处理
    _genResult (data) {
      let ret = []
      // 第一个对象为歌手。如果有，则优先添加
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // 扩展运算符给ret=[{zhida}]
      }
      // 再处理其它数据
      if (data.song) {
        // ret = ret.concat(data.song.list)
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    // 4 对结果数据二次处理
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    // 3计算显示内容的方法
    getDisplayName (item) {
      // console.log(item)
      // return item.type === TYPE_SINGER ? `${item.singername}` : `${item.songname} - ${filterSinger(item.singer)}`
      return item.type === TYPE_SINGER ? `${item.singername}` : `${item.name} - ${item.singer}`
    },
    // 5 scroll组件派发过来的滚动到底部加载更多事件
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page ++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    // 6检测是否还有更多
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    // 7展示的图标的计算
    getIconCls (item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    // 点击列表，进入二级页面
    selectItem (item) {
      if (item.type === TYPE_SINGER) { // 点击的是歌手，就跳到歌手详情页面
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `singer/${singer.id}`
        })
        this.setSinger(singer)
      } else { // 如果点击的是歌曲，则把这首歌加入现在的播放列表中。并播放
        this.insertSong(item)
      }
      this.$emit('select', item) // 当点击了li。不管是进入哪个页面都向上派发这个选择事件。并存入这个搜索词
    },
    // 接收scroll组件传过来的滚动前派发的事件
    listScroll () {
      this.$emit('listScroll')
    },
    refresh () {
      this.$refs.suggest.refresh()
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
      this._search(newQuery)
    },
    page (newPage) {
      // console.log(newPage)
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    position: relative
    min-height: 24px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^='icon-']
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: 14px
        color:rgba(255,255,255,0.3)
        overflow: hidden
        .text
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
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
