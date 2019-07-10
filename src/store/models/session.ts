import { spawn } from 'child_process'
import treeKill from 'tree-kill'
import { SessionStatus } from '@/store/models/enums'
import Task from '@/store/models/task'

export default class Session {

  public task: Task
  public status: SessionStatus = SessionStatus.None
  public log: string

  private pid: number = 0

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
      this.status = SessionStatus.Error
    })

    terminal.on('close', (code: string) => {
      if (this.status === SessionStatus.Running) {
        this.log += '<br>SUCCESS WITH CODE ' + code
        this.status = SessionStatus.Success
      }
    })

    terminal.on('disconnect', () => {
      if (this.status === SessionStatus.Running) {
        this.status = SessionStatus.Ended
      }
    })

    terminal.on('exit', (code: any) => {
      if (this.status === SessionStatus.Running) {
        this.status = SessionStatus.Exiting
      }
    })

    terminal.on('error', (error: any) => {
      this.log += '<br>ERROR<br>' + error
      this.status = SessionStatus.Error
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
