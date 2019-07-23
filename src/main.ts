import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { loadConfig, setupWindowCloser } from '@/store/tools/configurator'

async function init() {
  Vue.config.productionTip = false

  setupWindowCloser()

  loadConfig()

  new Vue({
    store,
    router,
    render: (h) => h(App),
  }).$mount('#app')
}

init()
