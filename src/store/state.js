import { playMode } from 'common/js/config'

const state = {
  singer: {}, // 歌手
  playing: false, // 播放状态
  fullScreen: false, // 播放器展开或是收起
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引
  disc: {} // 热门歌单数据
}

export default state
