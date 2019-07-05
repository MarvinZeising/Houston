<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        Houston
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <Home />
    </v-content>
  </v-app>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'App',
  components: {
    Home,
  },
  data() {
    return {
      //
    }
  },
}
</script>
