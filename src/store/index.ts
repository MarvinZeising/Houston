import Vue from 'vue'
import Vuex from 'vuex'
import RepositoryModule from './modules/repositories'

Vue.use(Vuex)
Vue.config.devtools = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    RepositoryModule,
  },
})

export default store
