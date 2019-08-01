import fs from 'fs'
import { homedir } from 'os'
import { getModule } from 'vuex-module-decorators'
import store from '@/store'
import RepositoryModule from '@/store/modules/repositories'
import { remote } from 'electron'

const configPath: string = homedir() + '/houston.config'

let library: string = ''

function loadConfig() {
  const repositoryModule = getModule(RepositoryModule, store)

  fs.readFile(configPath, (err: any, data: any) => {
    if (err) {
      repositoryModule.initRepositoryModule([])
    } else {
      const config = JSON.parse(data)

      if (Object.keys(config).includes('repositories')) {
        repositoryModule.initRepositoryModule(config.repositories)
      } else {
        repositoryModule.initRepositoryModule([])
      }

      if (Object.keys(config).includes('library')) {
        library = config.library.join(' ')
      }
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

export { configPath, library, loadConfig, setupWindowCloser }
