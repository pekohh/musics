<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到队列</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框-->
      <div class="search-box-wrapper">
        <search-box :placeholder="placeholder" ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <!-- 最近播放/搜索历史-->
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">         
          <!-- 最近播放-->
          <scroll :data="playHistory" class="list-scroll" v-if="currentIndex===0">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <!-- 搜索历史-->
          <scroll :data="searchHistory" class="list-scroll" v-if="currentIndex===1">
            <div class="list-inner">
              <search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!-- 搜索结果-->
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @listScroll='blurInput' @select="selectSuggest"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>  
</template>

<script  type="text/ecmascript-6">
import searchBox from 'base/search-box/search-box'
import switches from 'base/switches/switches'
import scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import searchList from 'base/search-list/search-list'
import suggest from 'components/suggest/suggest'
import topTip from 'base/top-tip/top-tip'
import Song from 'common/js/song'
import {searchMixin} from 'common/js/mixin'
import {mapGetters, mapActions} from 'vuex'

export default {
  mixins: [searchMixin],
  data () {
    return {
      showFlag: false,
      showSinger: false,
      placeholder: '搜索歌曲',
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ],
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  components: {
    searchBox,
    switches,
    scroll,
    songList,
    searchList,
    suggest,
    topTip
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSuggest () {
      this.$refs.topTip.show()
      this.saveSearch()
    },
    selectSong (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.$refs.topTip.show()
      }
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import '~common/stylus/variable'
.add-song
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index: 200
  background: #222
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.4s
  &.slide-enter, &.slide-leave-active
    transform: translate3d(100%, 0, 0)
  .header
    position: relative
    height: 44px
    text-align: center
    .title
      line-height: 44px
      font-size: 18px
      color: #fff
    .close
      position: absolute
      right: 8px
      top: 0
      .icon-close
        display: block
        padding: 12px
        font-size: 20px
        color: #ffcd32
  .search-box-wrapper
    margin: 20px
  .shortcut
    .list-wrapper
      position: absolute
      top: 165px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
