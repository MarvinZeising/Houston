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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Home from '@/components/Home.vue'

@Component({
  components: {
    Home,
  },
})
export default class App extends Vue {}
</script>
