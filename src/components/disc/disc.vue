<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script  type="text/ecmascript-6">
import musicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  components: {
    musicList
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    console.log(this.disc)
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push({
          path: '/recommend'
        })
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this.normalizeSongs(res.cdlist[0].songlist)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  watch: {
    disc (newDisc) {
      console.log(newDisc)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
.slide-enter-active, slide-leave-active
  transition: all 0.4s
.slide-enter, .slide-leave-to
  transform:translate3d(100%,0,0)
</style>
