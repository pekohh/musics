<template>
	<transition name="slide">
	  <music-list :bgImage="bgImage" :title="title" :songs="songs" ></music-list>
	</transition>
</template>

<script  type="text/ecmascript-6">
import musicList from 'components/music-list/music-list'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    musicList
  },
  computed: {
    bgImage () {
      return this.singer.avatar
    },
    title () {
      return this.singer.name
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          // res.data  list[obj1,obj2],singer_id,singer_mid,singer_name
          // res.data.list Flisten_count1,Fupload_time,index,isnew,listenCount,musicData[obj],playurl,price,vid
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        // console.log(item) // 每首歌的详细信息
        // 解构赋值,将item里面的musicData对象字段的值整体赋给左边的musicData
        let {musicData} = item
        // console.log({musicData}) // item里面musicData对象里面的值
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData)) // musicData
        }
      })
      return ret
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus" >
.slide-enter-active, .slide-leave-active
  transition: all 0.3s
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
