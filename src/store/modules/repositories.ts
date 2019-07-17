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
      new Task('Show changes', TaskType.Definite, 'gst; git diff'),
      new Task('Start Dev Server', TaskType.DefiniteWithNotifications, '.\\ci.cmd rundevserver'),
      new Task('Start Dev Client', TaskType.DefiniteWithNotifications, '.\\ci.cmd rundevclient'),
      new Task('Test Agent 3', TaskType.DefiniteWithNotifications, '.\\ci.cmd servertests 3'),
      new Task('Test Unittests', TaskType.DefiniteWithNotifications, '.\\ci.cmd server'),
      new Task('Gitgreen', TaskType.Definite, 'gitgreen'),
    ])
    const personMesh = new Repository('Person Mesh', 'C:\\src\\cdh\\mesh\\person', [
      new Task('Show changes', TaskType.Definite, 'gst; git diff'),
      new Task('Show branches', TaskType.Definite, 'git br'),
      new Task('Run Service', TaskType.Continuous, 'cd .\\src\\JW.Mesh.Person.Service; dotnet watch run'),
      new Task('Run Subscriber', TaskType.Continuous, 'cd .\\src\\JW.Mesh.Person.Subscriber; dotnet watch run'),
      new Task('Setup', TaskType.Definite, 'sca'),
      new Task('Pull', TaskType.Definite, 'git br -u master; gf'),
    ])
    const serviceBus = new Repository('Service Bus', 'C:\\src\\cdh\\service-bus', [
      new Task('Show changes', TaskType.Definite, 'gst; git diff'),
      new Task('Show branches', TaskType.Definite, 'git br'),
      new Task('Pull', TaskType.Definite, 'git br -u master; gf'),
      new Task(
        'Make new branch',
        TaskType.Definite,
        '',
        (name: string) => `git co master; git br -u origin/master; git pull; git co -b ${name}`),
    ])
    const db = new Repository('Database', 'C:\\src\\HuB\\Database', [
      new Task('Show changes', TaskType.Definite, 'gst; git diff'),
      new Task('Pull', TaskType.Definite, 'git br -u master; gf'),
    ])
    const hubWiki = new Repository('HuB Wiki', 'C:\\src\\HuB\\Admin.wiki', [
      new Task('Open Code', TaskType.Definite, 'code .'),
      new Task('Pull', TaskType.Definite, 'gf'),
    ])
    return { repositories: [ hub, personMesh, serviceBus, db, hubWiki ] }
  }

  @Action({ commit: 'setRepositories' })
  public startSession({ repositoryId, taskId, input }: { repositoryId: string, taskId: string, input?: string }) {
    return this.repositories.map((repo: Repository) => {
      if (repo.id === repositoryId) {
        const task = repo.tasks.filter((t: Task) => t.id === taskId)[0]

        if (input && task.commandFunc) {
          task.command = task.commandFunc(input)
        }

        repo.sessions.push(new Session(repo.path, task))
      }
      return repo
    })
  }

  @Mutation
  public setRepositories(repositories: Repository[]) {
    this.repositories = repositories
  }

}
