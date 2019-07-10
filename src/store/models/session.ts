import { spawn } from 'child_process'
import treeKill from 'tree-kill'
import { SessionStatus } from '@/store/models/enums'
import Task from '@/store/models/task'

export default class Session {

  public pid: number = 0
  public task: Task
  public status: SessionStatus = SessionStatus.None
  public log: string

  constructor(path: string, task: Task) {
    const terminal = spawn('pwsh.exe', ['-WorkingDirectory', path, '-Command', task.command])

    this.task = task
    this.status = SessionStatus.Running
    this.pid = terminal.pid
    this.log = ''

    terminal.stdout.on('data', (data: any) => {
      this.log += data
    })

    terminal.stderr.on('data', (data: any) => {
      this.log += '<br>ERROR<br>' + data
      this.status = SessionStatus.Failed
    })

    terminal.on('close', (code: string) => {
      this.log += '<br>CLOSED WITH CODE ' + code
      this.status = SessionStatus.Success
    })

    terminal.on('disconnect', () => {
      this.status = SessionStatus.Ended
    })

    terminal.on('exit', (code: number) => {
      this.log += '<br>EXITED WITH CODE ' + code
      if (code === 0) {
        this.status = SessionStatus.Success
      } else {
        this.status = SessionStatus.Failed
      }
    })

    terminal.on('error', (error: any) => {
      this.log += '<br>ERROR<br>' + error
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
