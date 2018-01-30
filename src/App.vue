<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-link to="/"></router-link>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script  type="text/ecmascript-6">
import mHeader from 'components/m-header/m-header'
import tab from 'components/tab/tab'
import player from 'components/player/player'
export default {
  components: {
    mHeader,
    tab,
    player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >

</style>
