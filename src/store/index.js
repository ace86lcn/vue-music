import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import state from './state'
import createLogger from 'vuex/dist/logger' // 记录日志方便对比查看插件

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 测试工具，开发环境开启，上线关闭

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
