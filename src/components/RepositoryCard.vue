<template>

  <v-card>

    <v-card-title>
      {{ repository.name }}
    </v-card-title>

    <RepositoryActions :repository="repository" />

    <div>
      <v-tabs
        v-model="tab"
        vertical
        color="grey lighten-3"
        background-color="grey darken-4"
      >
        <v-tab
          v-for="session in repository.sessions"
          :key="session.pid"
          class="ml-0"
        >
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
        </v-tab>

        <v-tab-item
          v-for="session in repository.sessions"
          :key="session.pid"
        >
          <v-card flat tile>
            <v-card-text class="grey darken-4">
              <SessionBody
                :repository="repository"
                :session="session"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>

    <!-- <v-card-text
      v-if="repository.sessions.length > 0"
      class="pa-1"
    >
      <v-expansion-panels>
        <v-expansion-panel
          v-for="session in repository.sessions"
          :key="session.pid"
          class="grey darken-4"
        >
          <v-expansion-panel-header>
            <SessionHeader :session="session" />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <SessionBody
              :repository="repository"
              :session="session"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text> -->

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
