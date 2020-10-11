<template>
    <div class="loading">
<<<<<<< HEAD
        <img src="./loading.gif" alt="" height="24" width="24">
        <p class="desc">{{title}}</p>
=======
        <img src="./loading.gif" width="24" height="24">
        <p class="dess">{{title}}</p>
>>>>>>> 8bd3f5775dd96258ae450079de764601fa280942
    </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>
<<<<<<< HEAD
<style scoped lang="stylus">
    @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
=======
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.loading
    width 100%
    text-align center
>>>>>>> 8bd3f5775dd96258ae450079de764601fa280942
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
