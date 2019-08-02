import axios from 'axios'
import { configuration } from '@/store/tools/configurator'

function pushNotification(content: string) {
  axios.post('https://api.pushed.co/1/push', {
    app_key: configuration.pushedKey,
    app_secret: configuration.pushedSecret,
    target_type: 'app',
    content,
  })
}

export { pushNotification }
