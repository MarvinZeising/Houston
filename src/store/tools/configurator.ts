import fs from 'fs'
import { homedir } from 'os'
import { getModule } from 'vuex-module-decorators'
import store from '@/store'
import RepositoryModule from '@/store/modules/repositories'

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

export { loadConfig }
