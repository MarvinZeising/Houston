<template>

  <v-system-bar app fixed window>
    <v-spacer></v-spacer>
    <v-btn
      text small tile
      @click="window.minimize()"
    >
      <v-icon class="mr-0">remove</v-icon>
    </v-btn>
    <v-btn
      text small tile
      v-if="!isMaximized"
      @click="window.maximize(); isMaximized = true"
    >
      <v-icon class="mr-0">fullscreen</v-icon>
    </v-btn>
    <v-btn
      text small tile
      v-if="isMaximized"
      @click="window.unmaximize(); isMaximized = false"
    >
      <v-icon class="mr-0">fullscreen_exit</v-icon>
    </v-btn>
    <v-btn
      text small tile
      @click="window.close()"
    >
      <v-icon class="mr-0">close</v-icon>
    </v-btn>
  </v-system-bar>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { remote, BrowserWindow } from 'electron'

@Component({})
export default class SystemBar extends Vue {

  private window: BrowserWindow = remote.getCurrentWindow()

  private isMaximized: boolean = this.window.isMaximized()

}
</script>
