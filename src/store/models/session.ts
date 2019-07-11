import { spawn } from 'child_process'
import treeKill from 'tree-kill'
import { SessionStatus, TaskType } from '@/store/models/enums'
import Task from '@/store/models/task'
import PushBullet from 'pushbullet'

export default class Session {

  public pid: number = 0
  public task: Task
  public log: string
  public errors: string[] = []

  private sessionStatus: SessionStatus = SessionStatus.None

  get status(): SessionStatus {
    return this.sessionStatus
  }

  set status(value: SessionStatus) {
    if (value === SessionStatus.Success &&
        this.sessionStatus !== SessionStatus.Success &&
        this.task.type === TaskType.DefiniteWithNotifications) {
      const pusher = new PushBullet('o.b8EIjqMABd571hSjufwRaEImbuB1mrp6')
      pusher.devices().then((response: any) => {
        response.devices.forEach((device: any) => {
          pusher.note(device.iden, this.task.name + ' succeeded', '')
        })
      })
    }

    if (value === SessionStatus.Failed &&
        this.sessionStatus !== SessionStatus.Failed &&
        this.task.type === TaskType.DefiniteWithNotifications) {
      const pusher = new PushBullet('o.b8EIjqMABd571hSjufwRaEImbuB1mrp6')
      pusher.devices().then((response: any) => {
        response.devices.forEach((device: any) => {
          pusher.note(device.iden, this.task.name + ' failed', this.errors.join('\n\r'))
        })
      })
    }

    this.sessionStatus = value
  }

  constructor(path: string, task: Task) {
    const terminal = spawn('pwsh.exe', ['-WorkingDirectory', path, '-Command', task.command])

    this.task = task
    this.status = SessionStatus.Running
    this.pid = terminal.pid
    this.log = ''

    terminal.stdout.on('data', (data: string) => {
      this.log += data
      if ((/error/ig).test(data)) {
        this.errors.push(data)
      }
    })

    terminal.stderr.on('data', (data: any) => {
      this.errors.push(data)
      this.status = SessionStatus.Failed
    })

    terminal.on('close', (code: number) => {
      this.log += '\n\rCLOSED WITH CODE ' + code
      if (code === 0) {
        this.status = SessionStatus.Success
      } else if (this.status !== SessionStatus.Killed) {
        this.status = SessionStatus.Failed
      }
    })

    terminal.on('disconnect', () => {
      this.status = SessionStatus.Ended
    })

    terminal.on('exit', (code: number) => {
      this.log += '\n\rEXITED WITH CODE ' + code
      if (code === 0) {
        this.status = SessionStatus.Success
      } else if (this.status !== SessionStatus.Killed) {
        this.status = SessionStatus.Failed
      }
    })

    terminal.on('error', (error: any) => {
      this.log += '\n\rERROR' + error
      this.status = SessionStatus.Failed
    })
  }

  public kill() {
    if (this.pid > 0) {
      treeKill(this.pid, 'SIGINT', () => {
        this.status = SessionStatus.Killed
      })
    }
  }

}
