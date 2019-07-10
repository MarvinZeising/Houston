import { spawn } from 'child_process'
import treeKill from 'tree-kill'
import { SessionStatus } from '@/store/models/enums'
import Task from '@/store/models/task'

export default class Session {

  public pid: number = 0
  public task: Task
  public status: SessionStatus = SessionStatus.None
  public log: string
  public errors: string[] = []

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
