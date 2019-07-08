import { spawn } from 'child_process'
import treeKill from 'tree-kill'
import { SessionStatus } from '@/store/models/enums'

export default class Session {

  public status: SessionStatus = SessionStatus.None
  public pid: number = 0
  public log: string

  private terminal: any

  constructor(path: string, command: string) {
    const terminal = spawn('pwsh.exe', ['-WorkingDirectory', path, '-Command', command])

    this.status = SessionStatus.InProgress
    this.pid = this.terminal.pid
    this.log = ''

    terminal.stdout.on('data', (data: any) => {
      this.log += data
    })

    terminal.stderr.on('data', (data: any) => {
      this.log += '<br>ERROR<br>' + data
      this.status = SessionStatus.Error
    })

    terminal.on('close', (code: string) => {
      if (this.status === SessionStatus.InProgress) {
        this.log += '<br>SUCCESS WITH CODE ' + code
        this.status = SessionStatus.Success
      }
    })

    terminal.on('disconnect', () => {
      if (this.status === SessionStatus.InProgress) {
        this.status = SessionStatus.Ended
      }
    })

    terminal.on('exit', (code: any) => {
      if (this.status === SessionStatus.InProgress) {
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
