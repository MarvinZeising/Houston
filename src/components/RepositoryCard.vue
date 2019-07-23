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
            <SessionHeader :session="session" />
          </template>

          <SessionBody :session="session" />

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

@Component({
  components: {
    Prompt,
    SessionHeader,
    SessionBody,
  },
})
export default class RepositoryCard extends Vue {
  @Prop(Repository) private repository?: Repository
}
</script>
