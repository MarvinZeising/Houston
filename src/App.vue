<template>
  <div>

    <v-app>

      <SystemBar />

      <v-content>
        <Home />
      </v-content>

    </v-app>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Home from '@/components/Home.vue'
import SystemBar from '@/components/SystemBar.vue'

@Component({
  components: {
    Home,
    SystemBar,
  },
})
export default class App extends Vue {}
</script>
