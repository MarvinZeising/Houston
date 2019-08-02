import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import Repository from '@/store/models/repository'
import { TaskType, SessionStatus } from '@/store/models/enums'
import Task from '@/store/models/task'
import Session from '@/store/models/session'
import Category from '../models/category'

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
  public async initRepositoryModule(rawRepositories: any) {
    await this.context.dispatch('killAllSessions')

    const validRepositories: any[] = rawRepositories.filter((r: any) => hasKeys(r, ['name', 'path', 'categories']))

    const repositories: Repository[] = validRepositories.map((repo: {
      name: string,
      path: string,
      categories: any[],
    }) => {
      const validCategories: any[] = repo.categories.filter((c: any) => hasKeys(c, ['name', 'tasks']))

      const categories: Category[] = validCategories.map((category: {
        name: string,
        tasks: any[],
      }) => {
        const validTasks: any[] = category.tasks.filter((task: any) => {
            const taskKeys = Object.keys(task)
            const typeKeys = Object.keys(TaskType).map((t: string) => t.toLowerCase())

            return taskKeys.includes('name') && taskKeys.includes('type') &&
              (taskKeys.includes('command') || taskKeys.includes('commandFunc')) &&
              typeKeys.includes(task.type.toLowerCase())
          })

        const tasks: Task[] = validTasks.map((task: {
          name: string,
          color: string,
          type: keyof typeof TaskType,
          command?: string,
          commandFunc: string,
        }) => {
          if (task.command) {
            return new Task(task.name, task.color, task.type as TaskType, task.command)
          } else {
            return new Task(
              task.name,
              task.color,
              task.type as TaskType,
              '',
              (input: string) => task.commandFunc.replace(/{input}/g, input))
          }
        })

        return new Category(category.name, tasks)
      })

      return new Repository(repo.name, repo.path, categories)
    })

    this.context.commit('setRepositories', repositories)
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

function hasKeys(object: any, keys: string[]) {
  const neededKeys = keys.sort().join(',')
  const objectKeys = Object.keys(object).sort().join(',')
  return neededKeys === objectKeys
}
