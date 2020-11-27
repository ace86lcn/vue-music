<template>
    <div class="singer">
        <list-view :data="singerList" @select="selectSinger"></list-view>
        <router-view></router-view>
    </div>
</template>
<script>
import { getSinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/list/list-view'
import { mapMutations } from 'vuex'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  components: {
    ListView
  },
  data () {
    return {
      singerList: []
    }
  },
  methods: {
    // 歌手列表
    getSingerList () {
      getSinger().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this.normalizeSinger(res.data.list)
        }
      })
    },
    // 对取到的列表进行转换
    normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // 为了得到有序列表，我们需要处理 map
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    // 歌手详情页
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created () {
    this.getSingerList()
  }
}
</script>
<style lang="stylus" scoped>
    .singer
        position fixed
        top 88px
        bottom 0
        width 100%
</style>
