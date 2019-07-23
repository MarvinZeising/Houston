import fs from 'fs'
import { homedir } from 'os'
import { getModule } from 'vuex-module-decorators'
import store from '@/store'
import RepositoryModule from '@/store/modules/repositories'
import { remote } from 'electron'

function loadConfig() {
  const repositoryModule = getModule(RepositoryModule, store)

  fs.readFile(homedir() + '/houston.config', (err: any, data: any) => {
    if (err) {
      repositoryModule.initRepositoryModule([])
    } else {
      const config = JSON.parse(data)
      repositoryModule.initRepositoryModule(config)
    }
  })
}

function setupWindowCloser() {
  const repositoryModule = getModule(RepositoryModule, store)

  remote.getCurrentWindow().on('close', () => {
    if (repositoryModule.hasOpenSessions) {
      repositoryModule.killAllSessions().then(() => remote.app.exit())
    } else {
      remote.app.exit()
    }
  })
}

export { loadConfig, setupWindowCloser }
