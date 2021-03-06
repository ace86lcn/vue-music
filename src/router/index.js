import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'views/recommend/recommend'
import Singer from 'views/singer/singer'
import Rank from 'views/rank/rank'
import Search from 'views/search/search'
import SingerDetail from 'views/singer-detail/singer-detail'
import Disc from 'views/disc/disc'
import TopList from 'views/top-list/top-list'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
      component: Recommend
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: TopList
      }]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
