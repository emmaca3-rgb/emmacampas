import {defineCliConfig} from 'sanity/cli'
import config from '../sanity.json' with {type: 'json'}

export default defineCliConfig({
  api: config,
  deployment: {
    ...config,
    autoUpdates: true,
  },
})
