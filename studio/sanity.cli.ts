import {defineCliConfig} from 'sanity/cli'

const {SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_APP_ID} = process.env

export default defineCliConfig({
  api: {
    projectId: SANITY_STUDIO_PROJECT_ID,
    dataset: 'production',
  },
  deployment: {
    appId: SANITY_STUDIO_APP_ID,
    autoUpdates: true,
  },
})
