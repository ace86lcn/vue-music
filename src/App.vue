<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from './views/m-header/m-header'
import Tab from './views/tab/tab'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus">
</style>
