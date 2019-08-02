<template>
  <v-app>
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
