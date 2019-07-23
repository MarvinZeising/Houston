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
  public lastLog: { msg: string, type: 'log' | 'error' } = {
    msg: 'Waiting for process to start...',
    type: 'log',
  }

  // tslint:disable: max-line-length
  public lib: string = `
    function sca {
        $cosmosDbStopped = $null -eq (Get-Process CosmosDB.Emulator -ErrorAction SilentlyContinue);
        $azureStorageEmulatorStopped = $null -eq (Get-Process AzureStorageEmulator -ErrorAction SilentlyContinue);

        $cosmosDbStart = "&'C:\\Program Files\\Azure Cosmos DB Emulator\\CosmosDB.Emulator.exe'";
        $azureStorageEmulatorStart = "&'C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\Storage Emulator\\AzureStorageEmulator.exe' start";

        if ($azureStorageEmulatorStopped -AND $cosmosDbStopped)
        {
            Start-Process powershell -Verb RunAs -ArgumentList "-NoExit; $cosmosDbStart; $azureStorageEmulatorStart"
        }
        elseif ($azureStorageEmulatorStopped)
        {
            Start-Process powershell -Verb RunAs -ArgumentList "-NoExit; $azureStorageEmulatorStart"
        }
        elseif ($cosmosDbStopped)
        {
            Start-Process powershell -Verb RunAs -ArgumentList "-NoExit; $cosmosDbStartCommand"
        }
    };
  `

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
    const terminal = spawn('pwsh.exe', ['-WorkingDirectory', path, '-Command', this.lib + task.command])

    this.task = task
    this.status = SessionStatus.Running
    this.pid = terminal.pid
    this.log = ''

    terminal.stdout.on('data', (data: any) => {
      this.log += data
      if ((/error/ig).test(data)) {
        this.errors.push(data)
        this.lastLog.type = 'error'
      }
      this.lastLog.msg = data.toString().trim()
    })

    terminal.stderr.on('data', (data: any) => {
      this.errors.push(data)
      this.status = SessionStatus.Failed
      this.lastLog.msg = data.toString().trim()
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
