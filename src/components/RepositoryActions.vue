<template>

  <v-card-actions>
    <v-layout column>
      <div
        v-for="category in repository.categories"
        :key="category.id"
      >
        <p
          v-if="category.name !== ''"
          class="mt-2 mb-0 ml-1"
        >
          {{ category.name }}
        </p>
        <v-btn
          v-for="task in category.tasks.filter((t) => t.command)"
          :key="task.id"
          v-on:click="repository.startSession(task)"
          :color="task.color"
          class="ma-1"
        >
          {{ task.name }}
          <v-icon
            v-if="task.type === TaskType.DefiniteWithNotifications"
            class="ml-2"
            dark
          >
            announcement
          </v-icon>
          <v-icon
            v-if="task.type === TaskType.Continuous"
            class="ml-2"
            dark
          >
            update
          </v-icon>
        </v-btn>
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
import { TaskType } from '@/store/models/enums'
import Task from '@/store/models/task'

@Component({
  components: {
    Prompt,
  },
})
export default class RepositoryActions extends Vue {
  @Prop(Repository) private repository?: Repository

  private TaskType = TaskType
}
</script>
