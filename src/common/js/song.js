import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'

// 创建一个类实例
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  // 获取歌词接口
  // getLyric() {
  //   if (this.lyric) {
  //     return Promise.resolve(this.lyric)
  //   }

  //   return new Promise((resolve, reject) => {
  //     getLyric(this.mid).then((res) => {
  //       if (res.retcode === ERR_OK) {
  //         console.log(this.lyric)
  //       }
  //     })
  //   })
  // }
  getLyric() {
    getLyric(this.mid).then((res) => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
        console.log(this.lyric)
      }
    })
  }
}

// 工厂模式
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

// 创建一个方法，拼接名称
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
