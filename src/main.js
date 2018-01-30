// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
Vue.prototype.$http = axios

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
import 'common/stylus/index.styl'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
