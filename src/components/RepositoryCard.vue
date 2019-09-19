<template>

  <v-card>

    <v-card-title>
      {{ repository.name }}
    </v-card-title>

    <RepositoryActions :repository="repository" />

    <hr v-if="repository.sessions.length > 0">

    <v-expansion-panels :accordion="true">
      <v-expansion-panel
        v-for="session in repository.sessions"
        :key="session.pid"
      >

        <SessionHeader
          :repository="repository"
          :session="session"
        />
        <SessionBody :session="session" />

      </v-expansion-panel>
    </v-expansion-panels>

  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Repository from '@/store/models/repository'
import { SessionStatus } from '@/store/models/enums'
import Prompt from '@/components/Prompt.vue'
import SessionHeader from '@/components/SessionHeader.vue'
import SessionBody from '@/components/SessionBody.vue'
import RepositoryActions from '@/components/RepositoryActions.vue'
import RepositoryModule from '../store/modules/repositories'

@Component({
  components: {
    Prompt,
    RepositoryActions,
    SessionHeader,
    SessionBody,
  },
})
export default class RepositoryCard extends Vue {
  @Prop(Repository) private repository?: Repository

  private tab = null
  private window = null

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
