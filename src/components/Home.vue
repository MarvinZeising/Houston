<template>

  <v-container>
    <v-layout wrap>

      <v-flex
        v-for="repository in repositories"
        :key="repository.id"
      >
        <h1>{{ repository.name }}</h1>
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

}
</script>
