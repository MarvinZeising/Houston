import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#3f51b5',
      },
    },
  },
})
