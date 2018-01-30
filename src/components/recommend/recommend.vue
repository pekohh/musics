<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
	  	<div >
	  		<!--轮播图-->
		    <div class="slider-wrapper" v-if="this.recommends.length > 0">
		    	<slider>
			    	<div v-for="img in recommends">
			    		<a :href="img.linkUrl">
			    			<img class="needsclick" :src="img.picUrl"/>
			    		</a>
			    	</div>
		        </slider>
		    </div>
		    <!--推荐歌单详情 -->
		    <div class="recommend-list">
		    	<h3 class="list-title">热门歌单推荐</h3>
		    	<ul>
		    		<li class="item" v-for="item in discList" @click="selectItem(item)">
		    			<div class="icon">
		    				<img width="60" height="60" v-lazy="item.imgurl"/>
		    			</div>
		    			<div class="text">
		    				<h3 class="name">{{item.creator.name}}</h3>
		    				<p class="desc">{{item.dissname}}</p>
		    			</div>
		    		</li>
		    	</ul>
		    </div>
		 </div>
		 <div class="loading-container" v-show="!discList.length">
		 	<loading></loading>
		 </div>
	 </scroll>
	 <router-view></router-view>
  </div>
</template>

<script  type="text/ecmascript-6">
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {ERR_OK} from 'api/config'
import {getRecommend, getDiscList} from 'api/recommend'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  components: {
    slider,
    scroll,
    loading
  },
  mounted () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 获取轮播图数据
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          // console.log(this.recommends)
        }
      })
    },
    // 获取推荐列表数据
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
          // console.log(this.discList)
        }
      })
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
@import '~common/stylus/variable'
.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height:100%
    overflow:hidden
    .slider-wrapper
      position:relative
      width:100%
      overflow:hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: 14px
        color:#ffcd32
      .item
        display: flex
        align-items: center
        box-sizing: border-box
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          flex: 1
          flex-direction:column
          justify-content:center
          line-height: 20px
          overflow: hidden
          font-size:$font-size-medium
          .name
            margin-bottom:10px
            color:$color-text
          .desc
            color:$color-text-d
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
