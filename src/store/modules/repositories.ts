import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import Repository from '@/store/models/repository'
import { TaskType, SessionStatus } from '@/store/models/enums'
import Task from '@/store/models/task'
import Session from '@/store/models/session'

@Module({ name: 'RepositoryModule' })
export default class RepositoryModule extends VuexModule {
  public repositories: Repository[] = []

  public get getRepositories(): Repository[] {
    return this.repositories
  }

  public get hasOpenSessions(): boolean {
    return this.repositories.map((repo: Repository) => {
      const openSessions = repo.sessions.filter((session: Session) => {
        return session.status === SessionStatus.Running
      })
      return openSessions.length > 0
    }).includes(true)
  }

  @Action({})
  public async initRepositoryModule(config: any) {
    await this.context.dispatch('killAllSessions')

    const repositories: Repository[] = config
    .filter((repo: any) => {
      const neededKeys = ['name', 'path', 'tasks'].sort().join(',')
      const repoKeys = Object.keys(repo).sort().join(',')
      return neededKeys === repoKeys
    })
    .map((repo: any) => {
      const tasks = repo.tasks
      .filter((task: any) => {
        const taskKeys = Object.keys(task)
        const typeKeys = Object.keys(TaskType).map((t: string) => t.toLowerCase())

        return taskKeys.includes('name') && taskKeys.includes('type') &&
          (taskKeys.includes('command') || taskKeys.includes('commandFunc')) &&
          typeKeys.includes(task.type.toLowerCase())
      })
      .map((task: any) => {
        const taskTypeString = task.type as keyof typeof TaskType

        if (task.command) {
          return new Task(task.name, TaskType[taskTypeString], task.command)
        } else {
          return new Task(
            task.name,
            TaskType[taskTypeString],
            '',
            (input: string) => task.commandFunc.replace(/{name}/g, input))
        }
      })
      return new Repository(repo.name, repo.path, tasks)
    })

    this.context.commit('setRepositories', repositories)
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

  @Action({})
  public async killAllSessions() {
    for (const repo of this.repositories) {
      for (const session of repo.sessions) {
        session.kill()
      }
    }

    while (this.hasOpenSessions) {
      await wait(100)
    }

    return true
  }

  @Mutation
  public setRepositories(repositories: Repository[]) {
    this.repositories = repositories
  }

}

function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}
