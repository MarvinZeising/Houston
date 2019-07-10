import uuidv4 from 'uuid/v4'
import { TaskType } from './enums'

export default class Task {

  public id: string
  public name: string
  public command: string
  public type: TaskType

  constructor(name: string, type: TaskType, command: string) {
    this.id = uuidv4()
    this.name = name
    this.command = command
    this.type = type
  }

}
