<template>
  <div class="player" v-show="playlist.length>0">
    <!-- --正常播放器-->
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
    	<div class="normal-player" v-show="fullScreen">
    		<div class="background">
    			<img width="100%" height="100%" :src="currentSong.image"/>
    		</div>
    		<div class="top">
    			<div class="back" @click="back">
    				<i class="icon-back"></i>
    			</div>
    			<h1 class="title">{{currentSong.name}}</h1>
    			<h2 class="subtitle">{{currentSong.singer}}</h2>
    		</div>
    		<!-- --中部-->
    		<div class="middle"
    		  @touchstart.prevent='middleTouchStart'
    		  @touchmove.prevent='middleTouchMove'
    		  @touchend='middleTouchEnd'
    		>
    			<div class="middle-l" ref="middleL">
    				<div class="cd-wrapper" ref="cdWrapper">
    					<div class="cd" :class="cdCls">
    						<img class="image" :src="currentSong.image"/>
    					</div>
    				</div>
    				<div class="playing-lyric-wrapper">
    					<div class="playing-lyric">{{playingLyric}}</div>
    				</div>
    			</div>
    			<scroll class="middle-r"  ref="lyricList" :data="currentLyric && currentLyric.lines">
    				<div class="lyric-wrapper">
    					<div v-if="currentLyric">
    						<p class="text" v-for="(line, index) in currentLyric.lines" ref="lyricLine">{{line.txt}}</p>
    					</div>
    				</div>
    			</scroll>
    		</div>
    		<!-- --底部-->
    		<div class="bottom">
    			<div class="dot-wrapper">
    				<span class="dot" :class="{active: currentShow === 'cd'}"></span>
    				<span class="dot" :class="{active: currentShow === 'lyric'}"></span>
    			</div>
    			<!--进度条 -->
    			<div class="progress-wrapper">
    				<span class="time time-l">{{format(currentTime)}}</span>
    				<div class="progress-bar-wrapper">
    					<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
    				</div>
    				<span class="time time-l">{{format(currentSong.duration)}}</span>
    			</div>
    			<!--模式前进后退按钮 -->
    			<div class="operators">
    				<div class="icon i-left" @click="changeMode">
    					<i :class="iconMode"></i>
    				</div>
    				<div class="icon i-left"  :class="disableCls">
    					<i class="icon-prev" @click="prev"></i>
    				</div>
 				    <div class="icon i-center" :class="disableCls">
    					<i :class="playIcon" @click="togglePlaying"></i>
    				</div>
 				    <div class="icon i-right"  :class="disableCls">
    					<i class="icon-next" @click="next"></i>
    				</div>  
 				    <div class="icon i-right">
    					<i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
    				</div>     				  				  				
    			</div>
    		</div>
    	</div>
    </transition>
    <!-- --迷你播放器-->
    <transition name="mini" >
    	<div class="mini-player" v-show="!fullScreen" @click="open">
    		<div class="icon">
    		  <img :src="currentSong.image" width="40" height="40" :class="cdCls" />
    		</div>
    		<div class="text">
    			<h2 class="name" v-html="currentSong.name"></h2>
    			<p class="desc" v-html="currentSong.singer"></p>
    		</div>
    		<div class="control">
    		   <progress-circle :radius="radius" :percent="percent">
    		   	 <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
    		   </progress-circle>
    		</div>
    		<div class="control" @click.stop='showPlaylist'>
    			<i class="icon-playlist"></i>
    		</div>
    	</div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @ended="end" @error="error" @play="ready"></audio>
  </div>
</template>

<script  type="text/ecmascript-6">
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import scroll from 'base/scroll/scroll'
import playlist from 'components/playlist/playlist'
import {playMode} from 'common/js/config'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {prefixStyle} from 'common/js/dom'

import animations from 'create-keyframe-animation' // 引入第三方框架实现动画
import Lyric from 'lyric-parser' // 引入第三方框架来实现自动解析歌词

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

import {playerMixin} from 'common/js/mixin'

export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false, // 设置歌曲的准备状态为false
      radius: 32, // svg的大小
      currentTime: 0,
      currentShow: 'cd', // 默认当前页面展示的是cd版块|lyric
      currentLyric: null, // 当前歌曲的歌词
      currentLineNum: 0, // 当前高亮的歌词的行号
      playingLyric: '' // 显示在cd页面的单行歌词信息
    }
  },
  components: {
    progressBar,
    scroll,
    progressCircle,
    playlist
  },
  computed: {
    // 1 计算播放状态
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 9计算cd图片是否旋转
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    // 10计算小cd的播放状态
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 11 计算当前播放时间与总播放时间的百分比
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    // 12 计算改变播放模式 iconMode(){}
    // 如果歌曲没有加载出来之前这些按钮是不可用的
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'playing',
      'playlist',
      'fullScreen',
      'currentSong',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created () {
    this.touch = {}
  },
  watch: {
    // 5 监测currentSong。如果发生变化就重新播放
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    // 6 测试播放状态如果发生变化则根据变化播放还是暂停
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => { // 数据之后立即使用这个方法，获取更新后的 DOM
        newPlaying ? audio.play() : audio.pause()
      })
    },
    fullScreen (newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyricList.refresh()
        }, 20)
      }
    }
  },
  methods: {
    // 4切换播放状态
    togglePlaying () {
      // 如果准备状态为false则return
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 7后退
    prev () {
      // 如果准备状态为false则return
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    // 8前进
    next () {
      // 如果准备状态为false则return
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length - 1) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    // 12 audio播放时间更新
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    // 13 时间格式转换
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 15从progress-bar传来的移动进度条的百分比算出当前歌曲播放的进度
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 16 改变播放模式changeMode () {}
    // 17 重置currentIndex resetCurrentIndex (list) {},
    // 18 播放完当前歌曲的事件
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 19 循环
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 20 middle划屏展示cd封面和歌词切换动作
    // 如果是cd页面则向左切换lyric页面，如果是lyric页面则向右切换cd页面
    middleTouchStart (e) {
      this.touch.initiated = true // 标志位
      this.touch.moved = false
      const touch = e.touches[0] // 获取触点
      this.touch.startX = touch.pageX // 记录触点的x坐标
      this.touch.startY = touch.ppageY // 记录触点的y坐标
      // console.log(this.touch.startX)
    },
    // 移动之后的触点
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 当移动的纵坐标大于横坐标时判断此次行为是上下滚动
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      // 移动过后moved设为true
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      // 设定初始点
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth

      // 当前页面cd,歌词块移动的范围从右-左0 --window.innerWidth
      // 当前页面lyricl,歌词块移动的范围从左-右 0-window.innerWidth
      // 移动了的距离的计算
      // console.log(deltaX)
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

      // 定义一个移动的距离与页面宽度的百分比
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent // 设置cd页面的透明度
      this.$refs.middleL.style[transitionDuration] = 0
    },
    // 移动完成之后
    middleTouchEnd () {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      // 当middle在cd页面时
      if (this.currentShow === 'cd') {
        // 只要当移动的百分比大于百分之十的时候我们就让其完全移动，并设置透明度为0
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else { // 当页面在lyric时
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    // 21 获取歌词
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // 22歌词的显示和处理lineNum行号 txt 每行的歌词内容
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 100)
      }
      this.playingLyric = txt
    },
    error () {
      this.songReady = true
    },
    // 1点击按钮关掉大播放器打开小播放器
    back () {
      this.setFullScreen(false)
    },
    // 2点击迷你播放器时候关掉小的,打开大的
    open () {
      this.setFullScreen(true)
    },
    // 3自定义的动画
    enter (el, done) {
      let {x, y, scale} = this._getPosAndScale() // 解构赋值
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 初始化动画的坐标
    _getPosAndScale () {
      const targetWidth = 40 // 定义小cd的宽度
      const paddingLeft = 40 // 定义小cd距离左边的距离
      const paddingBottom = 30 // 定义小cd的圆心距离底距离
      const paddingTop = 80 // 定义大cd顶距顶部距离
      const width = window.innerWidth * 0.8 // 定义大cd宽度
      const scale = targetWidth / width // 定义小cd/大cd的百分比
      const x = -(window.innerWidth / 2 - paddingLeft) // 定义大cd最终需要移动的坐标
      // 定义大cd最终需要移动的y坐标 大cd半径
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    // 14 秒数补零操作
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color:$color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-sze-medium
        color:$color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size:0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color:$color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height:100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color:$color-text-l
            font-size:$font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: rgba(255,255,255,0.5)
          &.active
            width: 20px
            border-radius: 5px
            background: rgba(255,255,255,0.8)
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color:$color-text
          font-size:$font-size-small
          flex: 0 0 30px
          width: 30px
          line-height: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: #ffcd32
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
            text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color:$color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      display: none
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)  
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: #333
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex: 1
      flex-direction: column
      justify-content: center
      line-height: 20px
      overflow:hidden
      .name
        margin-bottom: 2px
        text-overflow: ellipsis
        overflow: hidden
        white-space:nowrap
        font-size: 14px
        color:#fff
        no-wrap()
      .desc
        no-wrap()
        text-overflow: ellipsis
        overflow: hidden
        white-space:nowrap
        font-size:12px
        color:rgba(255,255,255,0.3)
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .progress-circle
        position: relative
        .icon-mini
          font-size: 32px
          position:absolute
          left: 0
          top: 0
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size:30px
          color:rgba(255,205,49,0.5)
      .icon-playlist
        font-size: 30px
        color:rgba(255,205,49,0.5)
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
