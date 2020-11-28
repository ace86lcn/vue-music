<template>
  <div class="player" v-show="playList.length > 0">
      <transition
        name="normal"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle">
            <div class="middle-l" >
                <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdLs">
                    <img class="image" :src="currentSong.image">
                </div>
                </div>
                <div class="playing-lyric-wrapper">
                <div class="playing-lyric"></div>
                </div>
            </div>
            <scroll class="middle-r" >
                <div class="lyric-wrapper">
                <div >
                    <p class="text"></p>
                </div>
                </div>
            </scroll>
            </div>
            <div class="bottom">
            <div class="dot-wrapper">
                <span class="dot" ></span>
                <span class="dot" ></span>
            </div>
            <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                </div>
                <span class="time time-r">{{format(currentSong.duration)}}</span>
            </div>
            <div class="operators">
                <div class="icon i-left" @click="changeMode">
                <i :class="iconMode"></i>
                </div>
                <div class="icon i-left" :class="disIcon">
                <i  class="icon-prev" @click="prev"></i>
                </div>
                <div class="icon i-center" :class="disIcon">
                <i :class="playIcon" @click="plays"></i>
                </div>
                <div class="icon i-right" :class="disIcon">
                <i  class="icon-next" @click="next"></i>
                </div>
                <div class="icon i-right">
                <i  class="icon icon-not-favorite" ></i>
                </div>
            </div>
        </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
            <img  width="40" height="40" :src="currentSong.image" :class="cdLs">
            </div>
            <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control"></div>
            <div class="control" >
              <progress-circle :radius="radius" :percent="percent">
                <i :class="miniIcon" @click.stop="plays" class="icon-mini"></i>
              </progress-circle>
            </div>
        </div>
      </transition>
<audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">

import Scroll from 'base/scroll/scroll'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
// js动画插件
import animations from 'create-keyframe-animation'
import { mapGetters, mapMutations } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
export default {
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle
  },
  data() {
    return {
      songReady: false,       // 歌曲是否准备好
      currentTime: 0,          // 当前播放时间
      radius: 32            // 圆形进度条半径
    }
  },
  computed: {
    // 全屏点击播放暂停按钮样式变化
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 精简模式点击播放暂停按钮样式变化
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 播放时图片旋转
    cdLs() {
      return this.playing ? 'play' : 'play-pause'
    },
    // 快速切换歌曲短暂禁用
    disIcon() {
      return this.songReady ? '' : 'disabled'
    },
    // 播放时间
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    // 播放模式
    iconMode() {
      return this.model === playMode.sequence ? 'icon-sequence' : playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'model',
      'sequenceList'
    ])
  },
  methods: {
    // 点击展示简约模式
    back() {
      this.setFullScreen(false)
    },
    // 点击展示全屏模式
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this.getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this.getPosAndScale()
      this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style['transform'] = ''
    },
    // 获取初始位置函数
    getPosAndScale() {
      const targetWidth = 40 // 获取宽度
      const paddingLeft = 40 // 距离左边距离
      const paddingBottom = 30 // 小播放器距离下边的距离
      const paddingTop = 80 // 中间cd距离上边的距离
      const width = window.innerWidth * 0.8 // cd所占屏幕的宽度
      const scale = targetWidth / width // 缩放
      const x = -(window.innerWidth / 2 - paddingLeft) // cd相距小播放器的水平位移
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // // cd相距小播放器的上下位移
      return {
        x,
        y,
        scale
      }
    },
    // 播放
    plays() {
      this.setPlayState(!this.playing)
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndent(index)
      if (!this.playing) {
        this.plays()
      }
      this.songReady = false
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length - 1) {
        index = 0
      }
      this.setCurrentIndent(index)
      if (!this.playing) {
        this.plays()
      }
      this.songReady = false
    },
    // 解决快速切换歌曲报错
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    // 播放歌曲时间
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 时间函数
    format(interval) {
      interval = interval | 0       // | 0  操作等价于Math.floor(),向下取整
      const minute = interval / 60 | 0   // 获取分
      const second = this.pad(interval % 60)         // 获取秒
      return `${minute}:${second}`
    },
    // 时间补零函数
    pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 拖动进度条时间跟随改变
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.plays()
      }
    },
    // 点击改变播放模式
    changeMode() {
      const model = (this.model + 1) % 3
      this.setPlayModel(model)
      // eslint-disable-next-line no-unused-vars
      let list = null
      if (model === playMode.sequence) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.setSequenceList(list)
    },
    // 重置当前播放索引
    restCurrentIndent(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndent(index)
    },
    // 播放到最后一首继续下一首播放
    end() {
      if (this.model === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 循环播放到最后一首继续循环
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndent: 'SET_CURRENT_INDEX',
      setPlayModel: 'SET_PLAY_MODE',
      setSequenceList: 'SET_SEQUENCE_LIST'
    })
  },
  watch: {
    // 音乐播放
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.currentSong.getLyric()
      })
    },
    //
    playing(newPlay) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newPlay ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
