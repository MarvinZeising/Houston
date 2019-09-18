<template>

  <v-expansion-panel-content class="grey darken-4">
    <v-btn
      class="ma-3 red"
      v-if="isRunning(session.status)"
      v-on:click="session.kill()"
    >
      Kill
    </v-btn>
    <v-btn
      class="ma-3 grey"
      v-if="!isRunning(session.status)"
      v-on:click="repository.removeSession(session.pid)"
    >
      Remove
    </v-btn>
    <v-btn
      class="ma-3 grey"
      v-if="session.log !== ''"
      v-on:click="session.clearLogs()"
    >
      Clear logs
    </v-btn>
    <v-btn
      class="ma-3 grey"
      v-if="session.errors.length > 0"
      v-on:click="session.clearErrors()"
    >
      Clear errors
    </v-btn>
    <div
      v-if="session.errors.length > 0"
      class="caption red--text inline-block"
      style="overflow:scroll; max-height:300px;"
    >
      <div
        v-for="(error, index) in session.errors"
        :key="index"
      >
        <div>ERROR {{ index }}:</div>
        <p><pre style="max-width:0;">{{ error }}</pre></p>
      </div>
    </div>
    <div
      class="caption inline"
      style="overflow:scroll; max-height:300px;"
    >
      <pre style="max-width:0;">{{ session.log }}</pre>
    </div>
  </v-expansion-panel-content>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { SessionStatus } from '@/store/models/enums'
import Session from '@/store/models/session'
import Repository from '../store/models/repository'

@Component({})
export default class SessionBody extends Vue {
  @Prop(Repository) private repository?: Repository
  @Prop(Session) private session?: Session

  private isRunning(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Running
  }

}
</script>
