import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {markdownSchema} from 'sanity-plugin-markdown'
import {singletonTools} from 'sanity-plugin-singleton-management'
import {structure} from './structure'
import config from '../sanity.json' with {type: 'json'}
import './styles.css'

export default defineConfig({
  name: 'default',
  title: 'Emma Campas',
  projectId: config.projectId,
  dataset: 'production',
  plugins: [structureTool({structure}), visionTool(), markdownSchema(), singletonTools()],
  schema: {
    types: schemaTypes,
  },
})
