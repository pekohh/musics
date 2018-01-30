<template>
  <div class="tab">
  	<router-link tag="div" to="/recommend" class="tab-item">
  		<span class="tab-link">推荐</span>
    </router-link>
  	<router-link tag="div" to="/singer" class="tab-item">
  		<span class="tab-link">歌手</span>
    </router-link>
  	<router-link tag="div" to="/rank" class="tab-item">
  		<span class="tab-link">排行</span>
    </router-link>
  	<router-link tag="div" to="/search" class="tab-item">
  		<span class="tab-link">搜索</span>
    </router-link>
  </div>        
</template>

<script  type="text/ecmascript-6">
export default {
  data () {
    return {
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"
.tab
  display: flex
  height: 44px
  line-height: 44px
  font-size: 14px
  .tab-item
    flex: 1
    text-align: center
    .tab-link
      padding-bottom: 5px
      color: rgba(255,255,255,0.5)
    &.router-link-active
      .tab-link
        border-bottom: 2px solid $color-theme
        color: $color-theme
</style>
