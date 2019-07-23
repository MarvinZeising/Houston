<template>

  <v-card>
    <v-card-title primary-title>
      <h1 class="headline">{{ repository.name }}</h1>
    </v-card-title>
    <v-card-actions>
      <v-btn
        v-for="task in repository.tasks.filter((t) => t.command)"
        :key="task.id"
        v-text="task.name"
        v-on:click="repository.startSession(task)"
      />
      <Prompt
        v-for="task in repository.tasks.filter((t) => !t.command)"
        :key="task.id"
        :repository="repository"
        :task="task"
      />
    </v-card-actions>
    <v-card-text v-if="repository.sessions.length > 0">
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(session, i) in repository.sessions"
          :key="i"
          class="grey darken-4"
        >
          <template v-slot:header>
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Session from '@/store/models/session'
import Repository from '@/store/models/repository'
import { SessionStatus } from '@/store/models/enums'
import Prompt from '@/components/Prompt.vue'

@Component({
  components: {
    Prompt,
  },
})
export default class RepositoryCard extends Vue {
  @Prop(Repository) private repository?: Repository

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
