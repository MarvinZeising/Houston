<template>

  <div>
    <div
      v-for="category in repository.categories"
      :key="category.id"
    >
      <v-card-text class="pt-0 pb-0">
        <span v-if="category.name !== ''">{{ category.name }}</span>
      </v-card-text>

      <v-card-actions class="pl-4 pb-4">
        <v-btn
          v-for="task in category.tasks.filter((t) => t.command)"
          :key="task.id"
          v-on:click="repository.startSession(task)"
          :color="task.color"
        >
          {{ task.name }}
          <v-icon
            v-if="task.type === TaskType.DefiniteWithNotifications"
            class="mr-0"
            right
          >
            announcement
          </v-icon>
          <v-icon
            v-if="task.type === TaskType.Continuous"
            class="mr-0"
            right
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
      </v-card-actions>

    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Repository from '@/store/models/repository'
import Prompt from '@/components/Prompt.vue'
import { TaskType } from '@/store/models/enums'
import Task from '@/store/models/task'
import { setupWindowCloser } from '@/store/tools/configurator'

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
