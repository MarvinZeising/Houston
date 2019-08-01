<template>

  <v-card-actions>
    <v-layout column>
      <div
        v-for="category in repository.categories"
        :key="category.id"
      >
        <p class="mt-2 mb-0 ml-1">{{ category.name }}</p>
        <v-btn
          v-for="task in category.tasks.filter((t) => t.command)"
          :key="task.id"
          v-text="task.name"
          v-on:click="repository.startSession(task)"
          :color="task.color"
          class="ma-1"
        />
        <Prompt
          v-for="task in category.tasks.filter((t) => !t.command)"
          :key="task.id"
          :repository="repository"
          :task="task"
        />
      </div>
    </v-layout>
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
