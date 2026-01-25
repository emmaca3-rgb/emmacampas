import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {markdownSchema} from 'sanity-plugin-markdown'
import {singletonTools} from 'sanity-plugin-singleton-management'
import {structure} from './structure'

const {SANITY_STUDIO_PROJECT_ID} = process.env

export default defineConfig({
  name: 'default',
  title: 'Emma Campas',
  projectId: SANITY_STUDIO_PROJECT_ID as string,
  dataset: 'production',
  plugins: [structureTool({structure}), visionTool(), markdownSchema(), singletonTools()],
  schema: {
    types: schemaTypes,
  },
})
