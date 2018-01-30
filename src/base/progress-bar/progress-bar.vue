<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
    	<div class="progress" ref="progress"></div>
    	<div class="progress-btn-wrapper" ref="progressBtn"
    	@touchstart.prevent="progressTouchStart"
    	@touchmove.prevent="progressTouchMove"
    	@touchend="progressTouchEnd"
    	>
    		<div class="progress-btn"></div>
    	</div>
    </div>
  </div>
</template>

<script  type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true // 标志
      this.touch.startX = e.touches[0].pageX // 记录触摸点的x轴 74
      this.touch.left = this.$refs.progress.clientWidth // 记录progress的宽度 初始值 0-244
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 计算移动了多少距离
      // console.log(deltaX)
      this.$refs.progressBar.clientWidth - progressBtnWidth // 移动的最大距离为224
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    // 划动结束后的百分比
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px` // 给移动了的区域变成黄色
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` // 小球移动
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect() // 获取某个元素相对于视窗的位置集合 67.5
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"

.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0,0,0,0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
