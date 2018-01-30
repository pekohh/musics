<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 背景图片的遮罩层用来模糊效果的-->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- list滚动列表的遮罩层用来向上滚动时的背景变黑-->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表-->
    <scroll class="list" ref="list" :data="songs" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem" ></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script  type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import songList from 'base/song-list/song-list'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40 // 定义移动距离顶部的位置
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  data () {
    return {
      scrollY: 0
    }
  },
  components: {
    scroll,
    loading,
    songList
  },
  props: {
    bgImage: { // 背景图片
      type: String,
      default: ''
    },
    songs: { // 歌曲列表
      type: Array,
      default: []
    },
    title: { // 歌手
      type: String,
      default: ''
    },
    rank: { // 是否有评价图片
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 计算背景图片的样式
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  created () {
    // console.log(this.bgImage)
    this.listenScroll = true
    this.probeType = 3
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight // 1获得背景图片的高度 263
    this.$refs.list.$el.style.top = `${this.imageHeight}px` // 2设置滚动列表距离顶部距离
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT // 3定义最大滚动距离-223
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 返回
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    // song-list组件传来的选择歌曲事件
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    // 随机播放全部
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      // 当滚动范围超过顶部40时.则为minTranslateY,否则跟newY值一样
      let translateY = Math.max(this.minTranslateY, newY) // 4设置背景层向上移动的距离
      let zIndex = 0
      let scale = 1 // 设置缩放大小为1
      let blur = 0
      // 10 定义一个滚动值与图片的百分比
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) { // newY只有在向下拉时才会大于0
        scale = 1 + percent // 缩放倍数大于1
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20) // 在向上拉时则背景模糊
      }

      // 5监听滚动事件.让背景层跟着list一下向上移动
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      // 6监测newy。当它超过顶部40cm的时候
      if (newY < this.minTranslateY) { // 当滚动范围超过顶部40
        this.$refs.bgImage.style.paddingTop = 0 // 设置背景图片距离顶部为0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px` // 设置背景图片的高度为40
        zIndex = 10 // 设置背景图片的zIndex为10
        this.$refs.playBtn.style.display = 'none' // 设置随机播放隐藏
      } else {
        this.$refs.bgImage.style.paddingTop = '70%' // 7否则恢复原值
        this.$refs.bgImage.style.height = '0' // 默认背景图height为o
        this.$refs.playBtn.style.display = '' // 默认随机播放的display为空
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.music-list
  position:fixed
  z-index:100
  top:0
  left:0
  bottom:0
  right:0
  background:$color-background
  .back
    position: absolute
    top:0
    left:6px
    z-index:50
    .icon-back
      display:block
      padding:10px
      font-size:22px
      color:#ffcd32
  .title
    position:absolute
    top:0
    left:10%
    width:80%
    z-index:40
    text-overflow:ellipsis
    overflow:hidden
    white-space:nowrap
    text-align:center
    line-height:40px
    font-size:18px
    color:#fff
  .bg-image
    position:relative
    width:100%
    height:0
    padding-top:70%
    transform-origin:top
    background-size:cover
    .play-wrapper
      position:absolute
      bottom:20px
      z-index:50
      width:100%
      .play
        box-sizing:border-box
        width:135px
        padding:7px 0
        margin:0 auto
        text-align:center
        border:1px solid #ffcd32
        color:#ffcd32
        border-radius:100px
        font-size:0
        .icon-play
          display:inline-block
          vertical-align:middle
          margin-right:6px
          font-size:16px
        .text
          display:inline-block
          vertical-align:middle
          font-size:12px
    .filter
      position:absolute
      top:0
      left:0
      width:100%
      height:100%
      background:rgba(7,17,27,0.4)
  .bg-layer
      position:relative
      height:100%
      background:#222
  .list
    position:fixed
    bottom:0
    width:100%
    background:#222
    top:0
    .song-list-wrapper
      padding:20px 30px
    .loading-container
      position:absolute
      width:100%
      top:50%
      transform:translateY(-50%)
      

</style>
