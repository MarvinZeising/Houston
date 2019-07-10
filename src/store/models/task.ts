import uuidv4 from 'uuid/v4'

export default class Task {

  public id: string
  public name: string
  public command: string

  constructor(name: string, command: string) {
    this.id = uuidv4()
    this.name = name
    this.command = command
  }

}
