import uuidv4 from 'uuid/v4'
import { TaskType } from './enums'

export default class Task {

  public id: string
  public name: string
  public color: string
  public type: TaskType
  public command: string
  public commandFunc?: (input: string) => string

  constructor(name: string, color: string, type: TaskType, command: string, commandFunc?: (input: string) => string) {
    this.id = uuidv4()
    this.name = name
    this.color = color
    this.type = type
    this.command = command

    if (commandFunc) {
      this.commandFunc = commandFunc
    }
  }

}
