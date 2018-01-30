<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script  type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: { // 是否监听滚动位置事件
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    pullup: { // 是否设置上拉加载
      type: Boolean,
      default: false
    },
    beforeScroll: { // 是否监听滚动前派发事件
      type: Boolean,
      default: false
    },
    refreshDelay: { // 延迟时间
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      // 如果监听了滚动事件,则向上派发滚动事件座标
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
      // 监听了上拉刷新事件
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => { // 绑定滚动结束事件
          // 判断此时滚动位置小于底部50时派发一个事件
          // this.scroll.y 指的是时时滚动位置
          // this.scroll.maxScrollY 指的是最大滚动位置
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      // 监听了滚动前派发事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 封装滚动到某个位置(坐标)
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 封装滚动到某个元素
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    // 封装刷新动作
    refresh () {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >

</style>
