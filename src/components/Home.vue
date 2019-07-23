<template>

  <v-container
    fluid
    grid-list-lg
  >
    <v-layout row wrap>

      <v-flex
        xs12
        class="ma-2 error"
        v-if="repositories.length === 0"
      >
        No repositories configured. Check your config file at ~/houston.config
      </v-flex>

      <v-btn
        class="ma-2 primary"
        v-on:click="reloadConfig"
      >
        Reload config
      </v-btn>

      <v-flex
        xs12
        v-for="repository in repositories"
        :key="repository.id"
      >
        <v-card>
          <v-card-title primary-title>
            <h1 class="headline">{{ repository.name }}</h1>
          </v-card-title>
          <v-card-actions>
            <v-btn
              v-for="task in repository.tasks.filter((t) => t.command)"
              :key="task.id"
              v-text="task.name"
              v-on:click="startSession(repository.id, task.id)"
            />
            <Prompt
              v-for="task in repository.tasks.filter((t) => !t.command)"
              :key="task.id"
              :name="task.name"
              :repositoryId="repository.id"
              :taskId="task.id"
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
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { remote } from 'electron'
import { spawn, exec } from 'child_process'
import { getModule } from 'vuex-module-decorators'
import Session from '@/store/models/session'
import Repository from '@/store/models/repository'
import RepositoryModule from '@/store/modules/repositories'
import { SessionStatus } from '@/store/models/enums'
import Prompt from '@/components/Prompt.vue'
import { loadConfig } from '@/store/tools/configurator'

@Component({
  components: {
    Prompt,
  },
})
export default class Home extends Vue {
  private repositoryModule: RepositoryModule = getModule(RepositoryModule, this.$store)

  private async reloadConfig() {
    loadConfig()
  }

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

  private get repositories(): Repository[] {
    return this.repositoryModule.getRepositories
  }

  private startSession(repositoryId: string, taskId: string) {
    this.repositoryModule.startSession({ repositoryId, taskId })
  }

}
</script>
