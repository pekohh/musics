<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script  type="text/ecmascript-6">
import {debounce} from 'common/js/util'

export default {
  data () {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  methods: {
    // 设置query值的方法
    setQuery (query) {
      this.query = query
    },
    // 清空搜索框
    clear () {
      this.query = ''
    },
    // 失去焦点方法
    blur () {
      this.$refs.query.blur()
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
 @import "~common/stylus/variable"
.search-box
  display:flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background:#333
  border-radius: 6px
  .icon-search
    font-size: 24px
    color:$color-background
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: #333
    color: #fff
    font-size: 14px
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: #222
</style>
