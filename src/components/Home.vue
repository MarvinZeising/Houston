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
        <RepositoryCard :repository="repository" />
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { loadConfig } from '@/store/tools/configurator'
import Repository from '@/store/models/repository'
import RepositoryModule from '@/store/modules/repositories'
import RepositoryCard from '@/components/RepositoryCard.vue'

@Component({
  components: {
    RepositoryCard,
  },
})
export default class Home extends Vue {
  private repositoryModule: RepositoryModule = getModule(RepositoryModule, this.$store)

  private async reloadConfig() {
    loadConfig()
  }

  private get repositories(): Repository[] {
    return this.repositoryModule.getRepositories
  }

}
</script>
