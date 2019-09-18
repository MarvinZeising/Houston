import { spawn } from 'child_process'
import treeKill from 'tree-kill'
import { SessionStatus, TaskType } from '@/store/models/enums'
import Task from '@/store/models/task'
import { configuration } from '@/store/tools/configurator'
import { pushNotification } from '../tools/notifications'

const defaultLog = 'Waiting for process to start...'

export default class Session {

  public pid: number = 0
  public task: Task
  public log: string
  public errors: string[] = []
  public overview: { lastLog: string, lastError: string } = {
    lastLog: defaultLog,
    lastError: '',
  }

  private sessionStatus: SessionStatus = SessionStatus.None

  get status(): SessionStatus {
    return this.sessionStatus
  }

  set status(value: SessionStatus) {
    const firstSuccess = value === SessionStatus.Success && this.sessionStatus !== SessionStatus.Success

    if (firstSuccess && this.task.type === TaskType.DefiniteWithNotifications) {
      pushNotification(this.task.name + ' succeeded')
    }

    const firstFail = value === SessionStatus.Failed && this.sessionStatus !== SessionStatus.Failed

    if (firstFail && this.task.type === TaskType.DefiniteWithNotifications) {
      pushNotification(this.task.name + ' failed (' + this.errors.join(';;;') + ')')
    }

    this.sessionStatus = value
  }

  constructor(path: string, task: Task) {
    const terminal = spawn('pwsh.exe', [
      '-WorkingDirectory', path,
      '-Command', configuration.library + task.command,
    ])

    this.task = task
    this.status = SessionStatus.Running
    this.pid = terminal.pid
    this.log = ''

    terminal.stdout.on('data', (data: any) => {
      this.log += data

      if ((/error/ig).test(data)) {
        this.errors.push(data)
        this.overview.lastError = data.toString().trim()
      } else {
        this.overview.lastLog = data.toString().trim()
      }
    })

    terminal.stderr.on('data', (data: any) => {
      this.errors.push(data)
      this.status = SessionStatus.Failed
      this.overview.lastError = data.toString().trim()
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

  public setLastLog(lastLog: string) {
    if (lastLog.includes('\n')) {
      lastLog = lastLog.substr(lastLog.indexOf('\n'))
    }

    while (lastLog.indexOf('--') > -1) {
      lastLog = lastLog.replace(/--/gi, '-')
    }

    while (lastLog.indexOf('==') > -1) {
      lastLog = lastLog.replace(/==/gi, '=')
    }

    this.overview.lastLog = lastLog
  }

  public clearLogs() {
    this.log = ''
    this.overview.lastLog = ''
  }

  public clearErrors() {
    this.errors = []
    this.overview.lastError = ''
  }

  public kill() {
    if (this.pid > 0) {
      treeKill(this.pid, 'SIGINT', () => {
        this.status = SessionStatus.Killed
      })
    }
  }

}
