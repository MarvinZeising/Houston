declare module 'pushbullet' {
  export default class PushBullet {
    constructor(token: string)

    public devices(): Promise<any>
    public note(iden: string, title: string, body: string): Promise<any>
  }
}
