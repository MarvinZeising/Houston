import uuidv4 from 'uuid/v4'
import Task from '@/store/models/task'
import Session from '@/store/models/session'

export default class Repository {

  public id: string
  public session: Session | null = null

  public name: string
  public path: string
  public tasks: Task[]

  constructor(name: string, path: string, tasks: Task[]) {
    this.id = uuidv4()
    this.name = name
    this.path = path
    this.tasks = tasks
  }

}
