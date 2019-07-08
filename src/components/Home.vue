<template>

  <v-container>
    <v-layout wrap>

      <v-flex mb-4>
        <v-btn @click="buildServer">
          Build Server
        </v-btn>
        <v-btn @click="killTerminal">
          Kill Terminal
        </v-btn>

        <div style="background-color:#000;color:#fff; max-width:700px; min-height:300px; max-height:500px; overflow:auto;">
          <pre :v-html="getLog" />
        </div>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { spawn, exec } from 'child_process'
import Session from '@/plugins/session'

@Component({})
export default class Home extends Vue {
  private session: Session | null = null

  private getLog() {
    if (this.session !== null) {
      return this.session.log
    } else {
      return ''
    }
  }

  private buildServer() {
    this.session = new Session('C:\\src\\HuB\\Admin', '.\\ci.cmd rundevserver')
  }

  private killTerminal() {
    if (this.session !== null) {
      this.session.kill()
    }
  }
}
</script>
