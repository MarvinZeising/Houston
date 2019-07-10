import { Module, VuexModule, MutationAction, Action, Mutation } from 'vuex-module-decorators'
import Repository from '@/store/models/repository'
import { TaskType } from '../models/enums'
import Task from '@/store/models/task'
import Session from '@/store/models/session'

@Module({ name: 'RepositoryModule' })
export default class RepositoryModule extends VuexModule {
  public repositories: Repository[] = []

  public get getRepositories(): Repository[] {
    return this.repositories
  }

  @MutationAction({ mutate: ['repositories'] })
  public async initRepositoryModule() {
    const hub = new Repository('HuB', 'C:\\src\\HuB\\Admin', [
      new Task('Start Server', TaskType.Continuous, '.\\ci.cmd rundevserver'),
    ])
    const personMesh = new Repository('Person Mesh', 'C:\\src\\Mesh\\Person', [
      new Task('Start Service', TaskType.Continuous, 'cd .\\src\\JW.Mesh.Person.Service; dotnet watch run'),
      new Task('Start Subscriber', TaskType.Continuous, 'cd .\\src\\JW.Mesh.Person.Subscriber; dotnet watch run'),
    ])
    return { repositories: [ hub, personMesh ] }
  }

  @Action({ commit: 'setRepositories' })
  public async startSession({ repositoryId, taskId }: { repositoryId: string, taskId: string }) {
    return this.repositories.map((repo: Repository) => {
      if (repo.id === repositoryId) {
        const task = repo.tasks.filter((t: Task) => t.id === taskId)[0]
        repo.session = new Session(repo.path, task.command)
      }
      return repo
    })
  }

  @Mutation
  public async setRepositories(repositories: Repository[]) {
    this.repositories = repositories
  }

}
