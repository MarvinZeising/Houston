import uuidv4 from 'uuid/v4'
import Task from '@/store/models/task'
import Session from '@/store/models/session'

export default class Repository {

  public id: string
  public sessions: Session[] = []

  public name: string
  public path: string
  public tasks: Task[]

  constructor(name: string, path: string, tasks: Task[]) {
    this.id = uuidv4()
    this.name = name
    this.path = path
    this.tasks = tasks
  }

  public startSession(task: Task) {
    this.sessions.push(new Session(this.path, task))
  }

  public removeSession(pid: number) {
    this.sessions = this.sessions.filter((session) => session.pid !== pid)
  }

}
