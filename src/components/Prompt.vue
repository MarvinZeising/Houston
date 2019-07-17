<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="200px"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on">{{ name }}</v-btn>
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
import RepositoryModule from '@/store/modules/repositories'
import { getModule } from 'vuex-module-decorators'
import { Prop } from 'vue-property-decorator'

@Component({
  props: {
    name: String,
  },
})
export default class Prompt extends Vue {
  private repositoryModule: RepositoryModule = getModule(RepositoryModule, this.$store)

  @Prop(String) private readonly repositoryId?: string
  @Prop(String) private readonly taskId?: string

  private dialog: boolean = false
  private input: string = ''

  private save() {
    if (this.repositoryId && this.taskId) {
      this.repositoryModule.startSession({
        repositoryId: this.repositoryId,
        taskId: this.taskId,
        input: this.input,
      })
    }

    this.dialog = false
  }

}
</script>
