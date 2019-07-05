<template>
  <v-container>
    <v-layout wrap>

      <v-flex mb-4>
        <v-btn @click="runPersonTests">
          Run Person Tests
        </v-btn>
        <v-btn @click="killTerminal">
          Kill Terminal
        </v-btn>

        <div style="background-color:#000;color:#fff; max-width:700px; min-height:300px; max-height:500px; overflow:auto;">
          <pre>OUTPUT</pre>
          <pre v-html="output" />
        </div>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  private output: string = ''

  private terminal: any = null

  private runPersonTests() {
    const { spawn, exec } = require('child_process')

    this.output = ''

    this.terminal = spawn(
      'pwsh.exe',
      ['-WorkingDirectory', 'C:\\src\\HuB\\Admin', '-Command', '.\\ci.cmd rundevserver'])

    this.terminal.stdout.on('data', (data: any) => {
      this.output += data
    })

    this.terminal.stderr.on('data', (data: any) => {
      this.output += '<br>ERROR ' + data
    })

    this.terminal.on('close', (code: any) => {
      this.output += '<br>CLOSED ' + code
    })

    this.terminal.on('disconnect', () => {
      this.output += '<br>DISCONNECT'
    })

    this.terminal.on('exit', (code: any) => {
      this.output += '<br>EXIT ' + code
    })

    this.terminal.on('error', (error: any) => {
      this.output += '<br>ERROR ' + error
    })
  }

  private killTerminal() {
    const kill = require('tree-kill')

    kill(this.terminal.pid, 'SIGINT', (err: any) => {
      this.output += '<br>TREE-KILLED ' + err
    })
  }
}
</script>
