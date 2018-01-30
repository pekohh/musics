<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="query"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script  type="text/ecmascript-6">
import {debounce} from 'common/js/util'
export default {
  data () {
    return {
      placeholder: '搜索歌曲、歌手',
      query: ''
    }
  },
  methods: {
    // 设置搜索词
    setQuery (query) {
      this.query = query
    },
    // 点击右边清除input
    clear () {
      this.query = ''
    },
    // 失去焦点的事件
    blur () {
      this.$refs.query.blur()
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 400))
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"
.search-box
  display:flex
  box-sizing:border-box
  padding: 0 6px
  height:40px
  background:#333
  border-radius:6px
  align-items:center /*使子集剧中对齐*/
  .icon-search
    font-size:24px
    color:#222
  .box
    flex:1
    margin: 0 5px
    line-height:18px
    background:#333
    color:#fff
    font-size:14px
  .icon-dismiss
    font-size:16px
    color:#222
</style>
