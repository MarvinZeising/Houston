<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="200px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        :color="task.color"
        class="ma-1"
      >
        {{ task.name }}
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="Input"
                v-model="input"
                required />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          flat
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Repository from '@/store/models/repository'
import Task from '@/store/models/task'

@Component({})
export default class Prompt extends Vue {
  @Prop(Repository) private readonly repository?: Repository
  @Prop(Task) private readonly task?: Task

  private dialog: boolean = false
  private input: string = ''

  private save() {
    if (this.repository && this.task && this.task.commandFunc) {
      this.task.command = this.task.commandFunc(this.input)

      this.repository.startSession(this.task)
    }
    this.dialog = false
  }

}
</script>
