<template>
  <div class="search">
    <!-- 搜索框-->
    <div class="search-box-wrapper">
    	<search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 热门搜索部分-->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
    	<scroll class="shortcut" :data="shortcut" ref="shortcut">
    		<div>
    		   <!-- 热门搜索词-->
    			<div class="hot-key">
    				<h1 class="title">热门搜索</h1>
    				<ul>
    					<li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
    						<span>{{item.k}}</span>
    					</li>	
    				</ul>
    			</div>
    			<!-- 搜索历史-->
    			<div class="search-history" v-show="searchHistory.length">
    				<h1 class="title">
    					<span class="text">搜索历史</span>
    					<span class="clear" @click="showConfirm">
    						<i class="icon-clear"></i>
    					</span>
    				</h1>
    				<search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
    			</div>
    		</div>
    	</scroll>
    </div>
    <!-- 搜索结果部分-->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll='blurInput' @select="saveSearch" ref="suggest"></suggest >
    </div> 
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"  @confirm="clearSearchHistory"></confirm>   
  </div>
</template>

<script  type="text/ecmascript-6">
import searchBox from 'base/search-box/search-box'
import searchList from 'base/search-list/search-list'
import scroll from 'base/scroll/scroll'
import confirm from 'base/confirm/confirm'

import {ERR_OK} from 'api/config'
import {getHotKey} from 'api/search'
import suggest from 'components/suggest/suggest'
import {mapGetters, mapActions} from 'vuex'
import {playlistMixin, searchMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  components: {
    searchBox,
    scroll,
    searchList,
    suggest,
    confirm
  },
  created () {
    this._getHotKey()
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.botton = bottom
      this.$refs.shortcut.refresh()
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    showConfirm () {
      console.log(1)
      this.$refs.confirm.show()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: 14px
          color:rgba(255,255,255,0.5)
        .item
          display: inline-block
          padding: 5px 10px 
          margin: 0 20px 10px 0
          border-radius: 6px
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
          font-size: 14px
          color: rgba(255,255,255,0.5)
          .text
            flex: 1
          .clear
            position: relative
            .icon-clear
              font-size: 14px
              color: rgba(255,255,255,0.3)
  .search-result
    position: fixed
    top: 178px
    width: 100%
    bottom: 0
</style>
