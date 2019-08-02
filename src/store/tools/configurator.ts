import fs from 'fs'
import { homedir } from 'os'
import { getModule } from 'vuex-module-decorators'
import store from '@/store'
import RepositoryModule from '@/store/modules/repositories'
import { remote } from 'electron'

const configuration: {
  path: string,
  library: string,
  pushedKey: string,
  pushedSecret: string,
} = {
  path: homedir() + '/houston.config',
  library: '',
  pushedKey: '',
  pushedSecret: '',
}

function loadConfig() {
  const repositoryModule = getModule(RepositoryModule, store)

  fs.readFile(configuration.path, (err: any, data: any) => {
    if (err) {
      repositoryModule.initRepositoryModule([])
    } else {
      const fileContent = JSON.parse(data)

      if (Object.keys(fileContent).includes('repositories')) {
        repositoryModule.initRepositoryModule(fileContent.repositories)
      } else {
        repositoryModule.initRepositoryModule([])
      }

      if (Object.keys(fileContent).includes('library')) {
        configuration.library = fileContent.library.join(' ')
      }

      if (Object.keys(fileContent).includes('pushedKey') &&
          Object.keys(fileContent).includes('pushedSecret')) {
        configuration.pushedKey = fileContent.pushedKey
        configuration.pushedSecret = fileContent.pushedSecret
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

export { configuration, loadConfig, setupWindowCloser }
