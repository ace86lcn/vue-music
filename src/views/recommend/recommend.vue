<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content">
            <div>

            </div>
        </scroll>
    </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  components: {
    Scroll
  },
  data () {
    return {

    }
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider)
        }
      })
    }
  },
  created () {
    this._getRecommend()
  }
}
</script>
<style lang="stylus" scoped>

</style>
