<template>

  <v-expansion-panel-header disable-icon-rotate>

    <div>
      <v-progress-circular
        v-if="isRunning(session.status)"
        :size="22"
        color="primary"
        indeterminate
        class="mr-3"
      ></v-progress-circular>

      <v-icon
        v-if="isSuccess(session.status)"
        color="teal"
        left
      >
        done
      </v-icon>
      <v-icon
        v-if="isFailed(session.status)"
        color="error"
        left
      >
        error
      </v-icon>
      <v-icon
        v-if="isCancelled(session.status)"
        color="grey"
        left
      >
        cancel
      </v-icon>

      {{ session.task.name }}
      <span v-if="session.overview.lastLog">
        ({{ session.overview.lastLog }})
      </span>
    </div>

    <template v-slot:actions>

      <v-btn
        small
        class="red"
        v-if="isRunning(session.status)"
        v-on:click.stop="session.kill()"
      >
        Kill
      </v-btn>
      <v-btn
        small
        class="grey"
        v-if="!isRunning(session.status)"
        v-on:click.stop="repository.removeSession(session.pid)"
      >
        Remove
      </v-btn>

    </template>

  </v-expansion-panel-header>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Session from '@/store/models/session'
import Repository from '@/store/models/repository'
import { SessionStatus } from '@/store/models/enums'

@Component({})
export default class SessionHeader extends Vue {
  @Prop(Repository) private repository?: Repository
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

  private isKilled(sessionStatus: SessionStatus): boolean {
    return sessionStatus === SessionStatus.Killed
  }

}
</script>
