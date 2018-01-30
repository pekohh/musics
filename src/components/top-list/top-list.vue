<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="rank"></music-list>
  </transition>
</template>

<script  type="text/ecmascript-6">
import musicList from 'components/music-list/music-list'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    musicList
  },
  created () {
    this._getMusicList()
    // console.log(this.topList)
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
          console.log(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  watch: {
    topList (newList) {
      console.log(newList)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
&.slide-enter-active, &.slide-leave-active
  transition: all 0.3s
&.slide-enter, &.slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
