// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import VueLazyload from 'vue-lazyload'
import router from './router'
import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
