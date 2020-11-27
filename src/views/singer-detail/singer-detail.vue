<template>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>

import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'views/music-list/music-list.vue'

export default {
  components: { MusicList },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>
<style lang="stylus" scoped>
 @import "~common/stylus/variable"

.slide-enter-active, .slide-leave-active
    transition: all 0.3s
.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
