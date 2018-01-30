<template>
  <div class="search">
    <!-- 搜索框-->
  	<div class="search-box-wrapper">
      <search-box ref="searchBox" @query='onQueryChange'></search-box>
    </div>
    <!--热门搜索词-->
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcut" >
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click='showConfirm'>
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @delete="deleteOne" @select="addQuery"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!--搜索结果-->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest  ref="suggest" :searches="searchHistory" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
  </div>
</template>

<script  type="text/ecmascript-6">
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import searchList from 'base/search-list/search-list'
import confirm from 'base/confirm/confirm'
import scroll from 'base/scroll/scroll'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapActions, mapGetters} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  components: {
    searchBox,
    suggest,
    searchList,
    confirm,
    scroll
  },
  created () {
    this._getHotKey()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    // 获取热门搜索词
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
          // console.log(res)
        }
      })
    },
    // 点击热门词传到input
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    // 失去焦点事件
    blurInput () {
      this.$refs.searchBox.blur()
    },
    // 保存搜索结果历史事件
    saveSearch () {
      console.log(this.query)
      this.saveSearchHistory(this.query)
    },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  computed: {
    shortcut () {
      return this.hotkey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  watch: {
    shortcut (newShortcut) {
      console.log(newShortcut)
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.search
  .search-box-wrapper
    margin:20px
  .shortcut-wrapper
    position:fixed
    top:178px
    bottom:0
    width:100%
    .shortcut
      height:100%
      overflow:hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom:20px
          font-size:14px
          color:rgba(255,255,255,0.5)
        .item
          display:inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius:6px
          background:#333
          font-size:14px
          color:rgba(255,255,255,0.3)
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color:$color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d 
  .search-result
    position:fixed
    top:178px
    bottom:0
    width:100%
</style>
