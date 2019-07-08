import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import RepositoryModule from '@/store/modules/repositories'
import store from '@/store/index'
import { getModule } from 'vuex-module-decorators'
import '@/plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

async function init() {
  const repositoryModule = getModule(RepositoryModule, store)

  Vue.config.productionTip = false

  await repositoryModule.initRepositoryModule()

  new Vue({
    store,
    router,
    render: (h) => h(App),
  }).$mount('#app')
}

init()
