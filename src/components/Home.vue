<template>

  <v-container
    fluid
    grid-list-lg
  >
    <v-layout row wrap>

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
              v-for="task in repository.tasks"
              :key="task.id"
              v-text="task.name"
              v-on:click="startSession(repository.id, task.id)"
            />
          </v-card-actions>
          <v-card-text v-if="repository.sessions.length > 0">
            <h2 class="subheading">Sessions</h2>
            <v-expansion-panel>
              <v-expansion-panel-content
                v-for="(session, i) in repository.sessions"
                :key="i"
              >
                <template v-slot:header>
                  <div>{{ session.task.name }}</div>
                </template>
                <v-card>
                  <v-btn v-on:click="session.kill()">Kill</v-btn>
                  <v-card-text>
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
import { Component, Vue } from 'vue-property-decorator'
import { spawn, exec } from 'child_process'
import { getModule } from 'vuex-module-decorators'
import Session from '@/store/models/session'
import Repository from '@/store/models/repository'
import RepositoryModule from '@/store/modules/repositories'

@Component({})
export default class Home extends Vue {
  private repositoryModule: RepositoryModule = getModule(RepositoryModule, this.$store)

  private get repositories(): Repository[] {
    return this.repositoryModule.getRepositories
  }

  private startSession(repositoryId: string, taskId: string) {
    this.repositoryModule.startSession({ repositoryId, taskId })
  }

}
</script>
