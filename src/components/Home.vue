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
            <div class="headline">{{ repository.name }}</div>
          </v-card-title>
          <v-card-actions>
            <v-btn
              v-for="task in repository.tasks"
              :key="task.id"
              v-text="task.name"
              v-on:click="startSession(repository.id, task.id)"
            />
          </v-card-actions>
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
