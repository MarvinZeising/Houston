<template>

  <v-card class="pa-2">
    <v-card-title
      primary-title
      class="pt-2 pb-0 pl-1"
    >
      <h1 class="headline">{{ repository.name }}</h1>
    </v-card-title>

    <RepositoryActions :repository="repository" />

    <v-card-text v-if="repository.sessions.length > 0">
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(session, i) in repository.sessions"
          :key="i"
          class="grey darken-4"
        >

          <template v-slot:header>
            <SessionHeader :session="session" />
          </template>

          <SessionBody
            :repository="repository"
            :session="session"
          />

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card-text>
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
}
</script>
