<template>
  <scroll 
  class="listview" 
  ref="listview" 
  :data="data" 
  @scroll="scroll" 
  :probeType="probeType"
  :listenScroll="listenScroll">
    <!--左侧歌手列表 -->
	<ul>
		<li v-for="group in data" class="list-group" ref="listGroup">
			<h2 class="list-group-title">{{group.title}}</h2>
			<ul>
				<li class="list-group-item" v-for="item in group.items" @click="selectItem(item)">
					<img class="avatar" v-lazy="item.avatar"/>
					<span class="name">{{item.name}}</span>
				</li>
			</ul>
		</li>
	</ul>
	<!--右侧菜单列表 -->
	<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStar" @touchmove.stop.prevent='onShortcutTouchMove'>
		<ul>
			<li class="item" v-for="(item, index) in shortcutList" :class="{'current': currentIndex === index}" :data-index="index">{{item}}</li>
		</ul>
	</div>
	<div class="list-fixed" ref="fixed"  v-show="fixedTitle"> 
		<div class="fixed-title">{{fixedTitle}}</div>
	</div>
	<!--加载ing -->
	<div class="loading-container">
		<loading></loading>
	</div>
  </scroll>
</template>

<script  type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 定义右侧每个小菜单的高度是18
const TITLE_HEIGHT = 30

export default {
  data () {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    scroll,
    loading
  },
  created () {
    this.listHeight = []
    this.listenScroll = true
    this.probeType = 3
    this.touch = {}
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    // 计算左边每个歌手li的高度坐标,放在一个数组中
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight // 求元素的高用元素.clientHeight
        this.listHeight.push(height)
      }
    },
    // 接收scroll组件传过来的滚动位置事件
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 手指触摸右侧导航菜单时
    onShortcutTouchStar (e) {
      let anchorIndex = getData(e.target, 'index') // 获取点击的当前id
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY // 获取点击的当前y坐标放在y1里
      this.touch.anchorIndex = anchorIndex // 把id赋给touch
      /*
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      this.scrollY = -this.listHeight[anchorIndex]
      */
      this._scrollTo(anchorIndex)
    },
    // 手指在右侧导航菜单上划动时
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY // 获取移动后的y坐标
      // 计算出移动了几个li
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta // 用原来的+移动了的,就是现在的坐标点
      /*
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      this.scrollY = -this.listHeight[anchorIndex]
      */
      this._scrollTo(anchorIndex)
    },
    // 封装的滚动方法
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      // 当滚动到最顶时候，等于第一个
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2 // 当滚动到最后一个还往下的时候，让index为最后一个
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      this.scrollY = -this.listHeight[index]
    },
    // 选择左边的歌手列表。跳到歌手详情二级页面
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    }
  },
  watch: {
    // 当singer的数据发生变化时,重新计算每个的高度数组
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 监听滚动位置发生变化,则右侧导航菜单相应的变化
    scrollY (newY) {
      const listHeight = this.listHeight
      // console.log(newY)
      // 当滚动到页面顶部时
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY // 计算滚动位置与顶部的差值
          // console.log(this.diff)
          return
        }
      }
      // 滚动到最后,且newY大于最后一个的上限时
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      // 求出来差值与栏目高度的差值
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import '~common/stylus/variable'
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: #222
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: 12px
      color: rgba(255,255,255,0.5)
      background:#333
    .list-group-item
      display: flex
      padding: 20px 0 0 30px
      align-items:center
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: rgba(255,255,255,0.5)
        font-size: 14px
  .list-shortcut
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: rgba(0,0,0,0.3)
    font-family: Helvetica
    z-index: 30
    .item
      padding: 3px
      line-height: 1
      font-size: 12px
      &.current
        color: #ffcd32
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-sze: 12px
      color: rgba(255,255,255,0.5)
      background:#333
</style>
