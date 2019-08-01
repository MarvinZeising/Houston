import uuidv4 from 'uuid/v4'
import Task from '@/store/models/task'

export default class Category {

  public id: string
  public name: string
  public tasks: Task[]

  constructor(name: string, tasks: Task[]) {
    this.id = uuidv4()
    this.name = name
    this.tasks = tasks
  }

}
