<template>

  <div>
    <span class="mr-3">
      <v-progress-circular
        v-if="isRunning(session.status)"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <v-icon
        v-if="isSuccess(session.status)"
        color="teal"
      >
        done
      </v-icon>
      <v-icon
        v-if="isFailed(session.status)"
        color="error"
      >
        error
      </v-icon>
      <v-icon
        v-if="isCancelled(session.status)"
        color="grey"
      >
        cancel
      </v-icon>
    </span>
    {{ session.task.name }}
    <v-chip
      v-if="isRunning(session.status)"
      label
      :class="session.lastLog.type === 'log' ? 'primary' : 'error'"
    >
      {{ session.lastLog.msg }}
    </v-chip>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Session from '@/store/models/session'
import { SessionStatus } from '@/store/models/enums'

@Component({})
export default class SessionHeader extends Vue {
  @Prop(Session) private session?: Session

  private isRunning(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Running
  }

  private isSuccess(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Success
  }

  private isFailed(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Failed
  }

  private isCancelled(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Ended
        || sessionStatus === SessionStatus.Exited
        || sessionStatus === SessionStatus.Killed
  }

}
</script>
