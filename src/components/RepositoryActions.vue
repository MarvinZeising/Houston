<template>

  <v-card-actions>
    <v-btn
      v-for="task in repository.tasks.filter((t) => t.command)"
      :key="task.id"
      v-text="task.name"
      v-on:click="repository.startSession(task)"
          :color="task.color"
    />
    <Prompt
      v-for="task in repository.tasks.filter((t) => !t.command)"
      :key="task.id"
      :repository="repository"
      :task="task"
    />
  </v-card-actions>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Repository from '@/store/models/repository'
import Prompt from '@/components/Prompt.vue'

@Component({
  components: {
    Prompt,
  },
})
export default class RepositoryActions extends Vue {
  @Prop(Repository) private repository?: Repository
}
</script>
