import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import Repository from '@/store/models/repository'
import Session from '@/store/modules/repositories'

@Module({ name: 'RepositoryModule' })
export default class RepositoryModule extends VuexModule {
  public repositories: Repository[] = []

  public get getRepositories(): Repository[] {
    return this.repositories
  }

  @MutationAction({ mutate: ['repositories'] })
  public async initRepositoryModule() {
    const hub = new Repository('HuB', 'C:\\src\\HuB\\Admin', [{
      name: 'Start Server',
      command: '.\\ci.cmd rundevserver',
    }])
    const personMesh = new Repository('Person Mesh', 'C:\\src\\Mesh\\Person', [{
      name: 'Start Service',
      command: 'cd .\\src\\JW.Mesh.Person.Service; dotnet watch run',
    }, {
      name: 'Start Subscriber',
      command: 'cd .\\src\\JW.Mesh.Person.Subscriber; dotnet watch run',
    }])
    return { repositories: [ hub, personMesh ] }
  }

  @MutationAction({ mutate: ['repositories'] })
  public async clearRepositories() {
    return { repositories: [] }
  }

  @MutationAction({ mutate: ['repositories'] })
  public async setSession(id: string, session: Session) {
    const updated = this.repositories.map((x: Repository) => {
      if (x.id === id) {
        x.session = session
      }
      return x
    })

    return { repositories: updated }
  }

}
