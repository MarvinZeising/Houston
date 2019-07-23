<template>

  <v-card class="grey darken-4">
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
      v-on:click="session.log = ''"
    >
      Clear logs
    </v-btn>
    <v-btn
      class="ma-3 grey"
      v-if="session.errors.length > 0"
      v-on:click="session.errors = []"
    >
      Clear errors
    </v-btn>
    <v-card-text
      v-if="session.errors.length > 0"
      class="red--text"
      style="overflow:auto; max-height:300px;"
    >
      <div
        v-for="(error, i) in session.errors"
        :key="i"
      >
        <div>ERROR {{ i }}:</div>
        <p><pre>{{ error }}</pre></p>
      </div>
    </v-card-text>
    <v-card-text style="overflow:auto; max-height:300px;">
      <pre>{{ session.log }}</pre>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { SessionStatus } from '@/store/models/enums'
import Session from '@/store/models/session'

@Component({})
export default class SessionBody extends Vue {
  @Prop(Session) private session?: Session

  private isRunning(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Running
  }

}
</script>
